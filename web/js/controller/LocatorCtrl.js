/**
 * Created by fuguxu on 2016/9/22.
 */
IndonesiaApp
    .controller('LocatorCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService,getDataService2,$timeout, getApi, ngDialog, status, $filter){
        /*** page init ***/
        var ref=window.location.href;

        if(ref.indexOf('=')>-1){
            ref=ref.substring(ref.indexOf('=')+1);
            $scope.serial_number= $base64.urlsafe_decode(ref)
        }

        $scope.noData=       false;
        $scope.currentPage =     1;
        $scope.totalPage =       0;
        $scope.pageSize =       10;
        $scope.pages =          [];
        $scope.endPage =         1;
        $scope.showPrevNext = true;

        //默认
        $scope.subinventory='';
         $scope.location= '';


        getDataService2.data(
            getApi.get_subinventory,
            'post',
            {
                "parameter":{
                    'transaction_type' :""
                }
            },
            function (response) {
                $scope.inventory = response.data;
            }
        );

        $scope.getV = function(subinventory_code){

            $scope.subinventory_code = subinventory_code;

            angular.forEach($scope.inventory,function(v,k){
                if(subinventory_code== v.subinventory_code){
                    $scope.locator_ctl = v.locator_ctl;
                }
            })

            console.log(subinventory_code,$scope.subinventory_code)

        }


        //location lov
        $scope.locationLov = function (page,index) {
            if($scope.locator_ctl == 'Y'){
                status.data(
                    function (data) {
                        if (data.status == "S") {
                            ngDialog.open({
                                className: "datatable-theme",
                                template: "dialog/npr_lov.html",
                                scope: $scope,
                                preCloseCallback: function (value) {
                                    if (value == "2") {
                                        var responseData= JSON.parse($scope.lov_data.radioValue);
                                        console.log(responseData)
                                        $scope.location_code= responseData.location_code;
                                        $scope.location_id= responseData.location_id;
                                    }
                                    $timeout(function () {
                                        //$scope.partsForm.$dirty = true;
                                    }, 0);
                                },
                                controller: function ($scope, $rootScope) {
                                    $scope.searchtype = [{
                                        "value": "locator_code",
                                        "name": "Locator Code"
                                    }, {"value": "locator_desc", "name": "Locator Desc"}];
                                    $scope.obj_select = {};
                                    $scope.obj_select.value = $scope.searchtype[0].value;
                                    $scope.seaTypeValue = $scope.searchtype[0].name;
                                    $scope.searFuc = function (name) {
                                        $scope.seaTypeValue = name;
                                    }

                                    $scope.Location = true
                                    $scope.showPrevNext = true;
                                    $scope.title = "Locator"
                                    $rootScope.lov_data = {};
                                    $scope.currentPage = 1;
                                    $scope.totalPage = 1;
                                    $scope.pageSize = 10;
                                    $scope.pages = [];
                                    $scope.endPage = 1;
                                    $scope.$on('ngDialog.opened', function () {

                                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                                        getDataService.data(
                                            getApi.location,
                                            'post',
                                            {
                                                //profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index": page,
                                                    "page_size": $scope.pageSize,
                                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                                    "lang": $rootScope.InitalData.profile.language,
                                                    "where": {'subinventory_code':$scope.subinventory_code}
                                                })

                                            },

                                            function (response) {
                                                console.log(response)
                                                $scope.myList = response.data;
                                                $scope.totalPage = response.pagecount;
                                                $scope.endPage = $scope.totalPage;
                                            }
                                        )
                                    })

                                    $scope.DoCtrlPagingAct = function (page) {
                                        if ($scope.obj_select.value == null) {
                                            $scope.where = '';
                                        }

                                        else {
                                            var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                            if(obj_name){
                                                $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                            }else{
                                                $scope.where={'subinventory_code':$scope.subinventory_code}
                                            }

                                        }


                                        getDataService.data(
                                            getApi.location,
                                            'post',
                                            {
                                                //profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index": page,
                                                    "page_size": $scope.pageSize,
                                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                                    "serial_number": 1,
                                                    "lang": $rootScope.InitalData.profile.language,
                                                    "where": $scope.where
                                                })

                                            },

                                            function (response) {
                                                $scope.myList = response.data;
                                                $scope.totalPage = response.pagecount;
                                                $scope.endPage = $scope.totalPage;
                                            }
                                        )
                                    };
                                }
                            })
                        }
                    })
            }else{

            }

        };



        //search
        $scope.DoCtrlPagingAct= function(page){
            //翻页的时候清空 只能保存当页数据
            $scope.locators_list = [];

            var ref=window.location.href;
            $scope.totalPage = page;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }

            getDataService.data(
                getApi.location,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "organization_id": $rootScope.InitalData.profile.organization_id,
                        "lang": $rootScope.InitalData.profile.language,
                        "where": {'subinventory_code':$scope.subinventory_code,'location_id':$scope.location_id}
                    })
                },
                function (response) {
                    //if(response.status=='S'){
                        $scope.serachDate = response.data;
                        $scope.totalPage = response.pagecount;
                        $scope.endPage = $scope.totalPage;
                   /* }else if(response.status=='E'){
                        swal({
                            title: response.message,
                            type: "error"
                        })
                    }*/

                }
            )
        }

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }


        //save
        //$scope.pricelist_line = [];
        $scope.submitForm=function(){
            console.log($scope.locators_list)
            $scope.locators_list_date = [];
            angular.forEach($scope.locators_list,function(v,k){
                if(v){
                    $scope.obj={};
                    $scope.obj.subinv_code = v.subinventory_code;
                    $scope.obj.loc_name = v.location_code;
                    $scope.obj.location_id= v.location_id;
                    $scope.obj.loc_desc= v.location_desc;
                    $scope.obj.disabled_date= v.disable_date;
                    $scope.locators_list_date.push($scope.obj);
                    if(!v.location_desc){
                        $scope.sumbitted=true;
                        swal({
                        title:'location description not empty',
                        type:'error'
                        })
                        $scope.location_desc_status = true;
                    }else{
                        $scope.location_desc_status = false;
                        $scope.sumbitted=false;
                    }
                }

            })

            if($scope.location_desc_status) return;

            var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

            getDataService.data(
                getApi.update_locator,
                'post',
                {
                    profile: JSON.stringify(profile),
                        'parameter': JSON.stringify({
                        "organization_id":parseInt( profile.organization_id),
                        "locators": $scope.locators_list_date

                    })
                },

                function (response) {
                    if (response.Status == "S") {
                        swal({
                            title: response.Message,
                            type: "success"
                        })
                    }else if(response.Status == "E"){
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }

                }
            )
        }




        //reset
        $scope.reset= function(){
            $scope.locator_ctl='';
            $scope.location_code = '';
            $scope.subinventory_code = '';
            $scope.location_id='';
        }

    }

);





