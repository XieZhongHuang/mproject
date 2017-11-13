/**
 * Created by fuguxu on 2017/1/12.
 */

IndonesiaApp
    .controller('PoUpdateCtrl', function ($http, $base64, $scope, $rootScope, Upload, menuData, $stateParams,getDataService, getApi, globals, ngDialog, status, AuthenticationService) {

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;
        var sr_id = Number($base64.urlsafe_decode($stateParams.sr_id));

        //初始化
        getDataService.data(
            getApi.get_po_info,
            'post',
            {
                profile: JSON.stringify(profile),
                'parameter': JSON.stringify({
                    'sr_id':sr_id
                })
            },
            function (response) {
                $scope.initalData = response.po_info;
                $scope.sr_number=$scope.initalData.incident_number;
                $scope.po_number=$scope.initalData.po_number;
                $scope.sr_status=$scope.initalData.incident_status_name;
                $scope.creation_date= $scope.initalData.incident_date;
                $scope.PoDescription = $scope.initalData.summary;
                $scope.type_id=$scope.initalData.incident_type_id;

                $scope.poiteminfo=$scope.initalData.charge;
                angular.forEach($scope.poiteminfo,function(v,k){
                    $scope.poiteminfo[k].amount = Number((v.qty* v.price).toFixed(2));
                });

                if($scope.initalData.incident_status_name=='Open'){
                    $scope.status_flag=true;
                }else{
                    $scope.status_flag=false;
                }
                //状态
                getDataService.data(
                    getApi.get_po_states,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        'parameter': JSON.stringify({
                            "incident_status_id":$scope.initalData.incident_status_id,
                            "update_flag":"Y"
                        })
                    },

                    function (response) {
                        $scope.srStatus=response.data;
                        $scope.status_id = $scope.initalData.incident_status_id;
                    }
                )

                //billto地址   地址放在初始化后调用是为了防止默认地址无法出现
                getDataService.data(
                    getApi.get_use_to,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        'parameter': JSON.stringify({
                            "customer_id":profile.customer_id,
                            "site_use_code":"BILL_TO"
                        })
                    },

                    function (response) {
                        $scope.billAddress = response.addr;
                        $scope.bill_site_use_id=$scope.initalData.bill_to_site_use_id;
                        angular.forEach($scope.billAddress,function(v,k){
                            if($scope.bill_site_use_id== v.site_use_id){
                                $scope.location_id= v.location_id;
                            }
                        })
                    }
                )

                //shipto地址
                getDataService.data(
                    getApi.get_use_to,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        'parameter': JSON.stringify({
                            "customer_id":profile.customer_id,
                            "site_use_code":"SHIP_TO"
                        })
                    },

                    function (response) {
                        $scope.shipAddress = response.addr;
                        $scope.ship_site_use_id = $scope.initalData.ship_to_site_use_id;
                    }
                )
            }
        )

        $scope.changeStatus = function(status_id){
            $scope.status_id=parseInt(status_id);
        }



        $scope.changeBillAddress = function(bill_site_use_id){
            $scope.bill_site_use_id = Number(bill_site_use_id);
            angular.forEach($scope.billAddress,function(v,k){
                if(bill_site_use_id== v.site_use_id){
                    $scope.location_id= v.location_id;
                }
            })
        }



        $scope.changeShipAddress=function(ship_site_use_id){
            $scope.ship_site_use_id = Number(ship_site_use_id);
        }




        //加一行
        $scope.addpoiteminfo = function(){
            $scope.poiteminfo.push({
                'opt_type':'ADD'
            });
        }

        //删一行
        $scope.removepoiteminfo=function(charge_line_id,index){

            if(!$scope.status_flag){
                return
            }

            if(charge_line_id){
                getDataService.data(
                    getApi.charge_delete,
                    'POST',
                    {
                        profile: JSON.stringify(profile),
                        charge_entity: JSON.stringify({
                            "charge_line_id":parseInt(charge_line_id)
                        })
                    },
                    function(res) {
                        if (res.Status=='S') {

                            swal({
                                    title:res.Message,
                                    type:"success"
                                },function(){
                                    $scope.$apply(function(){
                                        $scope.poiteminfo.splice(index,1);
                                    })
                            })

                        }else{
                            swal({
                                title:res.Message,
                                type:"error"
                            })

                        }
                    }
                )
            }else{
                $scope.poiteminfo.splice(index,1);
            }

        }


        $scope.changeQty=function(qty,index){
            $scope.poiteminfo[index].qty = Number(qty);
            $scope.poiteminfo[index].amount = Number((qty*$scope.poiteminfo[index].price).toFixed(2));
        }



        //item lov
        $scope.itemLov = function (page,index) {
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

                                    $scope.poiteminfo[index].item_name = responseData.item_number;
                                    $scope.poiteminfo[index].item_desc = responseData.item_desc;
                                    $scope.poiteminfo[index].inventory_item_id = responseData.inventory_item_id;
                                    $scope.poiteminfo[index].uom = responseData.product_uom_code;
                                    $scope.poiteminfo[index].price = Number(responseData.price);
                                    $scope.poiteminfo[index].price_list_id = responseData.price_list_id;
                                    $scope.poiteminfo[index].currency_code=responseData.currency_code;
                                    $scope.poiteminfo[index].onhand_qty=responseData.onhand_qty;
                                    $scope.poiteminfo[index].Available_Qty=responseData.Available_Qty;


                                    $scope.poiteminfo[index].line_status='';
                                    $scope.poiteminfo[index].Order_Status='';

                                    $scope.poiteminfo[index].qty = '';
                                    $scope.poiteminfo[index].amount='';
                                }

                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "item_number",
                                    "name": "Item Number"
                                }, {"value": "item_desc", "name": "Item Desc"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;


                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }

                                $scope.sr_item = true
                                $scope.showPrevNext = true;
                                $scope.title = "Item List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    getDataService.data(
                                        getApi.get_item_list,
                                        'post',
                                        {
                                            profile: JSON.stringify(profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": profile.organization_id,
                                                "serial_number": 1,
                                                "lang": profile.language,
                                                "where": $scope.where
                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
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
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }

                                    getDataService.data(
                                        getApi.get_item_list,
                                        'post',
                                        {
                                            profile: JSON.stringify(profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": profile.organization_id,
                                                "serial_number": 1,
                                                "lang": profile.language,
                                                "where": $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                };
                            }
                        })
                    }
                })
        };

        //po 提交
        $scope.submitForm = function (valid) {
            valid.$dirty=false;
            $scope.submitted=true;
            if(valid.$valid){
                var nowDate = new Date();
                var nowTime = nowDate.getFullYear()+'-'+((nowDate.getMonth()+1)<10?'0'+(nowDate.getMonth()+1):(nowDate.getMonth()+1))+'-'+(nowDate.getDate()<10?'0'+nowDate.getDate():nowDate.getDate())+' '+(nowDate.getHours()<10?'0'+nowDate.getHours():nowDate.getHours())+':'+(nowDate.getMinutes()<10?'0'+nowDate.getMinutes():nowDate.getMinutes())+':'+(nowDate.getSeconds()<10?'0'+nowDate.getSeconds():nowDate.getSeconds());

                $rootScope.lodingbox = true;
                getDataService.data(
                    getApi.update_po,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        sr_entity:JSON.stringify({
                            "sr_id":sr_id,
                            "type_id":$scope.type_id,
                            "customer_id":profile.customer_id,
                            "urgency_id":3,
                            "owner_id":null,
                            "group_id":null,
                            "inventory_item_id":null,
                            "category_id":null,
                            "category_set_id":null,
                            "summary":$scope.PoDescription,
                            "incident_date":nowTime,
                            "close_date":"",
                            "attachment":[],
                            "instance_id":null,
                            "severity_id":2,
                            "contract_id":null,
                            "cust_account_id":profile.cust_acct_id,
                            "contract_service_id":null,
                            "cust_po_number":$scope.po_number||'',
                            "bill_to_site_use_id":$scope.bill_site_use_id || '',
                            "ship_to_site_use_id":$scope.ship_site_use_id || '',
                            "location_id":$scope.location_id || '',
                            "status_id":$scope.status_id
                        }),
                        charge_entity:JSON.stringify({"charges":$scope.poiteminfo})
                    },

                    function (response) {
                        if (response.Status == "S") {

                            $rootScope.lodingbox = false

                            swal({
                                title: response.Message,
                                type: "success"

                            }, function () {
                                window.location.reload();
                            })
                        }
                        else if (response.Status == "E") {

                            $rootScope.lodingbox = false
                            swal({
                                title: response.Message,
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
