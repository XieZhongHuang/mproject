/**
 * Created by fuguxu on 2017/1/11.
 */
IndonesiaApp
    .controller('CreatePoCtrl', function ($http, $base64, $scope, $rootScope, Upload, menuData,$timeout, getDataService,getDataService2 ,$stateParams, getApi, globals, ngDialog, status, AuthenticationService) {

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;


        $scope.Status='Open';
        //初始化
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
                angular.forEach($scope.billAddress,function(v,k){
                    if(v.primary=='Y'){
                        $scope.changeBillAddress(v.site_use_id);
                    }
                })
            }
        )

        $scope.changeBillAddress = function(bill_site_use_id){
            $scope.bill_site_use_id = Number(bill_site_use_id);
            angular.forEach($scope.billAddress,function(v,k){
                if(bill_site_use_id== v.site_use_id){
                    $scope.location_id= v.location_id;
                }
            })
        }


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
                angular.forEach($scope.shipAddress,function(v,k){
                    if(v.primary=='Y'){
                        $scope.changeShipAddress(v.site_use_id);
                    }
                })
            }
        )

        $scope.changeShipAddress=function(ship_site_use_id){
            $scope.ship_site_use_id = Number(ship_site_use_id);
        }


        //PO item information
        $scope.poiteminfo=[{}];

        //加一行
        $scope.addpoiteminfo = function(){
            $scope.poiteminfo.push({});
        }

        //删一行
        $scope.removepoiteminfo=function(index){
            $scope.poiteminfo.splice(index,1);
        }


        //Purchase Qty
        $scope.changePurchaseQty = function(qty,index){
            $scope.poiteminfo[index].totalprice = ($scope.poiteminfo[index].price*qty).toFixed(2);
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

                                    $scope.poiteminfo[index]= {
                                        'item_num':responseData.item_number,
                                        'item_desc':responseData.item_desc,
                                        'inventory_item_id':responseData.inventory_item_id,
                                        'uom_code':responseData.product_uom_code,
                                        'price':responseData.price,
                                        'price_list_id':responseData.list_header_id,
                                        'onhand_qty':responseData.onhand_qty,
                                        'Available_Qty':responseData.Available_Qty
                                    };

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




        //sr 提交
        $scope.submitForm = function (valid) {
            valid.$dirty=false;
            $scope.submitted=true;


            if(valid.$valid){
                var nowDate = new Date();
                var nowTime = nowDate.getFullYear()+'-'+((nowDate.getMonth()+1)<10?'0'+(nowDate.getMonth()+1):(nowDate.getMonth()+1))+'-'+(nowDate.getDate()<10?'0'+nowDate.getDate():nowDate.getDate())+' '+(nowDate.getHours()<10?'0'+nowDate.getHours():nowDate.getHours())+':'+(nowDate.getMinutes()<10?'0'+nowDate.getMinutes():nowDate.getMinutes())+':'+(nowDate.getSeconds()<10?'0'+nowDate.getSeconds():nowDate.getSeconds());
                $scope.poiteminfo[0].qty = parseInt($scope.poiteminfo[0].qty);//qty必须为number类型。
                $rootScope.lodingbox = true;
                getDataService.data(
                    getApi.create_po,
                    'post',
                    {
                        profile: JSON.stringify(profile),
                        //'parameter': JSON.stringify({}),
                        sr_entity:JSON.stringify({
                            "customer_id":profile.customer_id,
                            "status_id":1,
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
                            "location_id":$scope.location_id || ''
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
                                window.location.href="index.html#/po_update/2/"+$base64.urlsafe_encode(response.Incident_id);
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
