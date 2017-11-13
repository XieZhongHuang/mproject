/**
 * Created by fuguxu on 2017/1/21.
 */

IndonesiaApp
    .controller('PoAddressUpdateCtrl', function ($http, $base64, $scope, $rootScope, Upload, menuData,$timeout, getDataService,getDataService2 ,$stateParams, getApi, globals, ngDialog, status, AuthenticationService) {

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;
        var site_use_code = $base64.urlsafe_decode($stateParams.address_flag);
        var update_flage = $base64.urlsafe_decode($stateParams.update_flag);
        $scope.update_flage = update_flage;

        //PO item information
        $scope.poiteminfo=[{}];

        $scope.site_use_to = [{use_to_list:[]}];

        $scope.addpoiteminfo = function(){
            $scope.poiteminfo.push({});
            $scope.site_use_to.push({use_to_list:[]});
        }

        //改变状态
        $scope.changeStatus = function(index,status){

            $scope.changeStatus_flag = true;
            if(status=='Active'){
                $scope.site_use_to[index].status = 'A';
            }else if(status=='Inactive'){
                $scope.site_use_to[index].status = 'I';
            }

            //$scope.site_use_to[index].site_use_type = site_use_code;
            $scope.site_use_to[index].location_id= $scope.poiteminfo[index].location_id;
            //$scope.site_use_to[index].site_use_id= $scope.poiteminfo[index].site_use_id;

        }
        
        $scope.changeBillStatus = function(index,status){

            $scope.site_use_to[index].use_to_list[0]={site_use_type:'BILL_TO'};

            if(status=='Active'){
                $scope.site_use_to[index].use_to_list[0].STATUS = 'A';
            }else if(status=='Inactive'){
                $scope.site_use_to[index].use_to_list[0].STATUS = 'I';
            }

            if(!update_flage){return};

            angular.forEach($scope.poiteminfo[index].use_to_list,function(v,i){
                if(v.site_use_type=='BILL_TO'){
                    $scope.site_use_to[index].use_to_list[0].site_use_id = v.site_use_id;
                }
            })

            $scope.site_use_to[index].location_id= $scope.poiteminfo[index].location_id;
        }

        $scope.changeShipStatus = function(index,status){
            $scope.site_use_to[index].use_to_list[1]={site_use_type:'SHIP_TO'};

            if(status=='Active'){
                $scope.site_use_to[index].use_to_list[1].STATUS = 'A';
            }else if(status=='Inactive'){
                $scope.site_use_to[index].use_to_list[1].STATUS = 'I';
            }

            if(!update_flage){return};

            angular.forEach($scope.poiteminfo[index].use_to_list,function(v,i){
                if(v.site_use_type=='SHIP_TO'){
                    $scope.site_use_to[index].use_to_list[1].site_use_id = v.site_use_id;
                }
            })

            $scope.site_use_to[index].location_id= $scope.poiteminfo[index].location_id;
        }

        if(update_flage=='Y'){
            getDataService.data(
                getApi.get_location,
                'post',
                {
                    profile: JSON.stringify(profile),
                    'parameter': JSON.stringify({
                        "customer_id":profile.customer_id,
                        "site_use_code":site_use_code
                    })
                },

                function (response) {
                    $scope.poiteminfo = response.addr;
                    $scope.initPoiteminfo = angular.copy(response.addr);//保存所有地址，待提交时与poiteminfo对象比对抽取修改行。

                    angular.forEach($scope.poiteminfo,function(v,k){

                        $scope.site_use_to[k]={};
                        $scope.site_use_to[k].use_to_list=[];
                        //$scope.site_use_to[k].location_id= v.location_id;
                        //$scope.site_use_to[k].site_use_id= v.site_use_id;
                        //$scope.site_use_to[k].status = v.STATUS;
                        //$scope.site_use_to[k].site_use_type = v.site_use_type;
                        angular.forEach(v.use_to_list,function(value,index){
                            if(value.site_use_type=='BILL_TO'){
                                $scope.poiteminfo[k].bill_status=value.STATUS;
                            }
                            if(value.site_use_type=='SHIP_TO'){
                                $scope.poiteminfo[k].ship_status=value.STATUS;
                            }
                        })
                    })
                }
            )
        }


        $scope.addressLov = function(page){
            if(!$scope.poiteminfo[page].country){
                return;
            }
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/po_address_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                //点击列选择的国家。
                                $scope.flagCountry = $scope.poiteminfo[page].country;
                                initSite($scope.flagCountry);
                                $scope.title = "AddressInfo";

                                //如果国家修改过，弹出框的值全部清空。
                                if(page && $scope.poiteminfo[page].country != $scope.initPoiteminfo[page].country){
                                    $rootScope.address_line = '';
                                    $rootScope.city = '';
                                    $rootScope.county = '';
                                    $rootScope.state= '';
                                    $rootScope.postal_code = '';
                                    $rootScope.province = '';
                                }else{
                                    $rootScope.address_line = $scope.poiteminfo[page].address1;
                                    $rootScope.city = $scope.poiteminfo[page].city;
                                    $rootScope.county = $scope.poiteminfo[page].county;
                                    $rootScope.state= $scope.poiteminfo[page].state;
                                    $rootScope.postal_code = $scope.poiteminfo[page].postal_code;
                                    $rootScope.province = $scope.poiteminfo[page].province;
                                }


                                $scope.reset = function(){
                                    $rootScope.address_line='';
                                    $rootScope.city='';
                                    $rootScope.county='';
                                    $rootScope.state='';
                                    $rootScope.postal_code='';
                                }

                                $scope.changeAddressLine = function(address_line){
                                    $rootScope.address_line=address_line;
                                }
                                $scope.changeCity = function(city){
                                    $rootScope.city=city;
                                }

                                $scope.changeCounty = function(county){
                                    $rootScope.county=county;
                                }


                                $scope.changeState = function(state_code){
                                    //$rootScope.state=state;
                                    if($scope.flagCountry == 'CA'){
                                        $rootScope.state = state_code;
                                    }else{
                                        angular.forEach($rootScope.states,function(v,k){
                                            if(state_code== v.obj_code){
                                                $rootScope.state= v.obj_name;
                                            }
                                        })
                                    }
                                }

                                $scope.changePostalCode = function(postal_code){
                                    $rootScope.postal_code=postal_code;
                                }

                                $scope.changeProvince = function(province){
                                    $rootScope.province=province;
                                }
                            },
                            preCloseCallback: function (value) {
                                //隐藏下拉框
                                $('#select2-drop').hide();
                                $('#select2-drop-mask').hide();
                                $('#s2id_autogen1').removeClass('select2-dropdown-open');

                                if(value==0){
                                    //$scope.site_use_to[page]={};
                                    $scope.site_use_to[page].status = $scope.poiteminfo[page].status;//标记修改。
                                    $scope.site_use_to[page].county =  $scope.poiteminfo[page].county = $rootScope.county;
                                    $scope.site_use_to[page].address1 = $scope.poiteminfo[page].address1 = $rootScope.address_line;
                                    $scope.site_use_to[page].postal_code = $scope.poiteminfo[page].postal_code = $rootScope.postal_code;
                                    $scope.site_use_to[page].state = $scope.poiteminfo[page].state = $rootScope.state;
                                    $scope.site_use_to[page].city = $scope.poiteminfo[page].city = $rootScope.city;
                                    $scope.site_use_to[page].province = $scope.poiteminfo[page].province = $rootScope.province;

                                    //$scope.site_use_to[page].site_use_type = site_use_code;
                                    $scope.site_use_to[page].location_id= $scope.poiteminfo[page].location_id;
                                    //$scope.site_use_to[page].site_use_id= $scope.poiteminfo[page].site_use_id;

                                    if(!$scope.changeStatus_flag){
                                        if($scope.poiteminfo[page].STATUS=='Active'){
                                            $scope.site_use_to[page].status = 'A';
                                        }else if($scope.poiteminfo[page].STATUS=='Inactive'){
                                            $scope.site_use_to[page].status = 'I';
                                        }
                                    }
                                    $scope.poiteminfo[page].address =
                                        ($rootScope.address_line?($rootScope.address_line +','):'')+
                                        ($rootScope.city?($rootScope.city +','):'')+
                                        ($rootScope.county?($rootScope.county +','):'')+
                                        ($rootScope.state?($rootScope.state +','):'')+
                                        ($scope.poiteminfo[page].country == "CA"?($rootScope.province?($rootScope.province+','):''):'')+
                                        ($rootScope.postal_code?$rootScope.postal_code:'');
                                }
                            }
                        });
                    }
                }
            )
        }

        /**
         * create limalin,2017.5.17
         * 初始化国家。
         */
        function initCountrys(){
            //初始化国家
            getDataService.data(
                getApi.get_country,
                'post',
                {
                    profile: JSON.stringify(profile)
                },
                function (response) {
                    $scope.countrys = response.data;
                }
            );
        }initCountrys();


        /**
         * create limalin,2017.5.17
         * 初始化地点。
         */
        function initSite(country_code){
            //初始化state
            getDataService.data(
                getApi.cmLov,
                'post',
                {

                    'parameter': JSON.stringify({
                        "page_index": 1,
                        "page_size": 10,
                        "geography_type": 'STATE',
                        "address_type":"HZ_US_STATES",
                        "type":"LOV",
                        "country": country_code
                    })
                },
                function (response) {
                    $rootScope.states = response.data;
                }
            )
        }





        if(update_flage=='N'){
            var api = getApi.create_party_site_use;
        }else if(update_flage=='Y'){
            var api = getApi.update_party_site_use;
        }

        //sr 提交
        $scope.submitForm = function (valid) {
            valid.$dirty=false;
            $scope.submitted=true;
            $scope.site_use_to_temp = [];

            angular.forEach($scope.site_use_to,function(v,k){
                //debugger;

                v.use_to_list = v.use_to_list.length>0?v.use_to_list:$scope.poiteminfo[k].use_to_list;
                v.site_name = $scope.poiteminfo[k].party_site_name?$scope.poiteminfo[k].party_site_name:'';
                v.addressee = $scope.poiteminfo[k].addressee?$scope.poiteminfo[k].addressee:'';
                v.address = $scope.poiteminfo[k].address?$scope.poiteminfo[k].address:'';
                v.country = $scope.poiteminfo[k].country?$scope.poiteminfo[k].country:'';
                v.location_id= $scope.poiteminfo[k].location_id;
                v.status = $scope.poiteminfo[k].status;
                v.county = $scope.poiteminfo[k].county;
                v.address1 = $scope.poiteminfo[k].address1;
                v.postal_code = $scope.poiteminfo[k].postal_code;
                v.state = $scope.poiteminfo[k].state;
                v.city = $scope.poiteminfo[k].city;
                v.province = $scope.poiteminfo[k].province;


                if($scope.initPoiteminfo){
                    //只提交编辑过的条目
                    if($scope.initPoiteminfo[k].address != $scope.poiteminfo[k].address || $scope.poiteminfo[k].isChange){
                        $scope.site_use_to_temp.push(v);
                    }
                }else{
                    $scope.site_use_to_temp.push(v);
                }

                //v.country = $scope.poiteminfo[k].country?$scope.poiteminfo[k].country:'';
                //$scope.site_use_to_temp.push(v);
                //if(!v.address1){
                //    v.sddress1 = $scope.poiteminfo[k].address;
                //}
                //if(v.status){
                //    $scope.site_use_to_temp.push(v);
                //}
            });


            if(valid.$valid){
                $rootScope.lodingbox = true;
                getDataService.data(
                    api,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        'parameter': JSON.stringify({
                            site_use_to:$scope.site_use_to_temp,
                            org_id:profile.org_id,
                            party_id:profile.customer_id
                        })
                    },

                    function (response) {
                        if (response.status == "S") {

                            $rootScope.lodingbox = false

                            swal({
                                title: response.message,
                                type: "success"

                            }, function () {
                                location.reload();
                            })
                        }
                        else if (response.status == "E") {

                            $rootScope.lodingbox = false
                            swal({
                                title: response.message,
                                type: "error"
                            })

                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'error',
                                type: "error"
                            })

                        }
                    }
                )
            }
        };
    })
