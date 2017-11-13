/**
 * Created by lingyin on 15/6/29.
 */
IndonesiaApp
    .controller('NewChargeCtrl', function ($scope, $rootScope, $http, $base64, Upload, $stateParams, getDataService, getDataService2, getApi, ngDialog, status) {
        $scope.priceIsReadonly = true;

        $("html,body").animate({scrollTop: $("html,body").offset().top}, 10);

        var instance_number = $base64.urlsafe_decode($stateParams.instance_number);
        var profile = $rootScope.InitalData.profile;
        $scope.instance_code = $rootScope.InitalData.profile.instance_code;
        
        if(profile.instance_code=='MSA'||profile.instance_code=='MZA'){
            $scope.showpricecurr = true;
            //$scope.Qty=1;
            $scope.Reference='';
        }else{
            $scope.showpricecurr = false;
        }

        function get_subinventory(type, sub_def) {
            getDataService2.data(
                getApi.get_subinventory,
                'post',
                {
                    "parameter": {
                        'transaction_type': type
                    }
                },
                function (response) {

                    if (response.data) {

                        angular.forEach(response.data, function (value) {
                            if (sub_def == value.subinventory_code) {
                                $scope.subinventory = value.subinventory_code;
                            }
                        });

                        $scope.inventory = response.data;
                        $scope.subinventory = $scope.inventory[0].subinventory_code;
                    }
                },
                'N'
            )
        }

        //charge_price
        var getPriceList = function(transaction_type_id, billing_type_code) {
            if (! transaction_type_id || ! billing_type_code) return;
            getDataService2.data(
                getApi.charge_priceListName,
                'post',
                {
                    'parameter': {
                        transaction_type_id:transaction_type_id,
                        billing_type_code:billing_type_code
                    },
                    'profile': profile
                },
                function (response) {
                    $scope.F_ID_SR_CHARGE = response.F_ID_SR_CHARGE_S || response.F_ID_SR_CHARGE_N || 'N';

                    $scope.priceListName = response.pricelist_header;

                    $scope.priceListNameSel =$scope.price_list_id
                    $scope.pricelist_header_id = $scope.priceListNameSel;

                    angular.forEach($scope.priceListName,function(v,k){
                        if(v.price_list_id==$scope.price_list_id){
                            $scope.currency_code = v.currency_code
                        }
                    })

                    if(!$scope.showpricecurr){
                        $scope.Pricelist = $scope.priceListName[0].pricelist_name
                    }
                    //$scope.priceListNameSel = $scope.priceListName[0];
                    //$scope.priceListNameSel = ""+$scope.priceListName[0].price_list_id;
                    $scope.priceIsReadonly = response.category == 'EMPLOYEE' ? false:true;
                    

                    getDataService2.data(
                        getApi.charge_price,
                        'post',
                        {
                            'parameter': {
                                inventory_item_id:$scope.inventory_item_id,
                                pricelist_header_id:$scope.pricelist_header_id,
                                fg_item:$base64.urlsafe_decode($stateParams.item),
                                charge_item:$scope.item_number
                            },
                            'profile': profile
                        },
                        function (response) {
                            //if(response.status=='S'){
                                $scope.price = response.pricelist_price[0].price;
                                $scope.Amount = response.pricelist_price[0].price * $scope.Qty;
                                $scope.price_list_id = $scope.priceListName[0].price_list_id;
                            /* }else if(response.status=='E'){
                             swal({
                             title: response.message,
                             type: "error"
                             })
                             }*/
                        }
                    );



                }
            );
        }

        //------------------------------------------------------------------------------

        //if (profile.instance_code === 'MPI') {

            getDataService2.data(
                getApi.get_subinventory,
                'post',
                {
                    "parameter": {
                        'transaction_type': ''
                    }
                },
                function (response) {
                    $scope.inventory = response.data;
                    $scope.subinventory = $scope.inventory[0].subinventory_code;
                },
                'N'
            )
        //}
        $scope.activityLov = function () {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/charge_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    var activityData = angular.fromJson($rootScope.lov_data.radioValue);
                                    $scope.business_process_id = activityData.business_process_id
                                    $scope.line_category_code = activityData.line_category_code
                                    $scope.transaction_type = activityData.transaction_type
                                    $scope.default_subinv = activityData.default_subinv
                                    if ($scope.transaction_type_id != activityData.transaction_type_id) {
                                        $scope.billing_type = "";
                                        $scope.inventory_item_id = "";
                                        $scope.item_desc = "";
                                        $scope.item_number = "";
                                        $scope.price = "";
                                        $scope.product_uom_code = "";
                                        $scope.currency_code = "";
                                        $scope.price_list_id = "";
                                        $scope.billing_type_code = "";
                                        $scope.Amount = "";
                                        $scope.transaction_type_id = activityData.transaction_type_id;
                                        $scope.transaction_type = activityData.transaction_type;
                                        $scope.priceListName = [];
                                        $scope.priceListNameSel = '';
                                        if (profile.instance_code === 'MET') {
                                            get_subinventory($scope.transaction_type, $scope.default_subinv)
                                        }
                                    }
                                    get_subinventory($scope.transaction_type,$scope.default_subinv)
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.ActivityTable = true
                                $scope.nopage = false
                                $scope.showPrevNext = true;
                                $scope.title = "Activity List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService2.data(
                                        getApi.service_activity,
                                        'post',
                                        {
                                            parameter: {
                                                "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)) || '',
                                                "org_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.org_id,
                                                "bill_type_code": ""
                                            }
                                        },
                                        function (data) {
                                            $scope.data = data.service_activity;

                                        }
                                    )
                                })


                            }
                        })
                    }
                })
        }

        //item lov
        $scope.itemLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/charge_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                    $scope.itemData = angular.fromJson($rootScope.lov_data.radioValue);
                                    $scope.billing_type = $scope.itemData.billing_type
                                    $scope.inventory_item_id = $scope.itemData.inventory_item_id
                                    $scope.item_desc = $scope.itemData.item_desc
                                    $scope.item_number = $scope.itemData.item_number
                                    //$scope.price = $scope.itemData.price
                                    $scope.product_uom_code = $scope.itemData.product_uom_code
                                    $scope.currency_code = $scope.itemData.currency_code
                                    $scope.price_list_id = $scope.itemData.list_header_id
                                    if(!$scope.showpricecurr){
                                        $scope.price = $scope.itemData.price
                                    }

                                    //$scope.priceListNameSel = $scope.itemData.list_header_id
                                    $scope.billing_type_code = $scope.itemData.billing_type_code;
                                    if ($scope.Qty) {
                                        $scope.Amount = parseFloat($scope.price) * parseFloat($scope.Qty)
                                    }

                                    //价格列表
                                    getPriceList($scope.transaction_type_id, $scope.billing_type_code);

                                    //选择物料的时候根据不同国家筛选子库.
                                    if (profile.instance_code === 'MPI') {
                                        if ($scope.inventory.length > 0) {
                                            if ($scope.line_category_code == 'ORDER') {
                                                $scope.Qty = 1;

                                                var UsableObj = {code: ''}
                                                angular.forEach($scope.inventory, function (val) {
                                                    if (val.subinventory_type == 'ASP-Usable') {
                                                        UsableObj.code = val.subinventory_code

                                                    }
                                                });
                                                $scope.subinventory = UsableObj.code;
                                            }
                                            else if ($scope.line_category_code == 'RETURN') {
                                                $scope.Qty = -1;

                                                var Defective = {code: ''}
                                                angular.forEach($scope.inventory, function (val) {
                                                    if (val.subinventory_type == 'ASP-Defective') {
                                                        Defective.code = val.subinventory_code;
                                                    }

                                                });
                                                $scope.subinventory = Defective.code

                                            }

                                        }
                                    }
                                    /*else if ( profile.instance_code === 'MET' ) {

                                     getDataService2.data(
                                     getApi.get_subinventory,
                                     'post',
                                     {
                                     "parameter":{
                                     'transaction_type' :$scope.transaction_type
                                     }
                                     },
                                     function(response){

                                     if ( response.data ) {
                                     $scope.subinventory = $scope.itemData.default_subinv;
                                     $scope.inventory = response.data;
                                     }
                                     },
                                     'N'
                                     )
                                     }*/

                                }
                            },
                            controller: function ($scope, $rootScope) {

                                $scope.itemTable = true
                                $scope.showPrevNext = true;
                                $scope.title = "Item List"
                                $scope.searchtype = [{"value": "item_number", "name": "Item Number"}, {
                                    "value": "item_desc",
                                    "name": "Item Desc"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }

                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                })


                                //查询、分页数据
                                $scope.DoCtrlPagingAct = function (page) {
                                    if ($scope.obj_select == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }


                                    getDataService2.data(
                                        getApi.charge_item,
                                        'post',
                                        {

                                            'parameter': {
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "fg_item": $base64.urlsafe_decode($stateParams.item),
                                                "sr_type_id": parseInt($base64.urlsafe_decode($stateParams.sr_type_id)) || '',
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "transaction_type_id": $scope.transaction_type_id,
                                                "instance_number": instance_number,
                                                "organization_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                                "lang": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                                "org_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.org_id,
                                                "where": $scope.where
                                            }
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                };

                                $scope.DoCtrlPagingAct(1);
                            }
                        })
                    }
                })
        }

        $scope.getPrice = function(id){
            if (!id) {
                $scope.price = '';
                $scope.Amount = '';
                return;
            }
            $scope.pricelist_header_id = parseInt(id);

            //$scope.priceListNameSel.price_list_id = parseInt(id);
            getDataService2.data(
                getApi.charge_price,
                'post',
                {
                    'parameter': {
                        inventory_item_id:$scope.inventory_item_id,
                        pricelist_header_id:parseInt(id)
                    },
                    'profile': profile
                },
                function (response) {
                    //if(response.status=='S'){
                        $scope.price = response.pricelist_price[0].price;
                        $scope.Amount = response.pricelist_price[0].price * $scope.Qty;
                        $scope.price_list_id = parseInt(id);
                    /*else if(response.status=='E'){
                        swal({
                            title: response.message,
                            type: "error"
                        })
                    }*/


                }
            );



            angular.forEach($scope.priceListName,function(v,k){
                if(parseInt(id)== v.price_list_id){
                    $scope.currency_code = v.currency_code;
                }
            })


        }

        /*$scope.$watch($scope.Qty, function () {
            alert($scope.Qty)
            $scope.Amount = ''
            if ($scope.Qty) {
                $scope.Amount = parseFloat($scope.price) * parseFloat($scope.Qty)
            }


        })*/
        $scope.Qty = 1;
        $scope.changeQty = function(Qty){
            $scope.Qty = Qty;
            //$scope.Amount = ''
            if ($scope.Qty) {
                $scope.Amount = parseFloat($scope.price) * parseFloat($scope.Qty)

            }

        }

        $scope.changePrice = function(price){
            $scope.price = price
            if ($scope.Qty) {
                $scope.Amount = parseFloat($scope.price) * parseFloat($scope.Qty)
            }
        }

        $scope.changeReference = function(Reference){
            $scope.Reference = Reference;
        }

        //reason lov
        $scope.reasonLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/charge_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.looup_code = angular.fromJson($rootScope.lov_data.radioValue).looup_code
                                    $scope.meaning = angular.fromJson($rootScope.lov_data.radioValue).meaning
                                    $scope.desc = angular.fromJson($rootScope.lov_data.radioValue).desc
                                }
                            },
                            controller: function ($scope, $rootScope) {

                                $scope.reasonTable = true
                                $scope.showPrevNext = true;
                                $scope.title = "Return Reason List"
                                $scope.searchtype = [{"value": "lookup_code", "name": "Return Reason"}, {
                                    "value": "meaning",
                                    "name": "meaning"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.charge_reason,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                                "lookup_type": "CREDIT_MEMO_REASON",
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

                                //查询、分页数据
                                $scope.DoCtrlPagingAct = function (page) {
                                    if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }


                                    getDataService.data(
                                        getApi.charge_reason,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                                "lookup_type": "CREDIT_MEMO_REASON",
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
        }
        //charge sub
        $scope.submitForm = function (valid) {
            valid.$dirty = false
            $scope.submitted = true

            if (valid.$valid) {

                getDataService2.data(
                    getApi.charge_price,
                    'post',
                    {
                        'parameter': {
                            inventory_item_id: $scope.inventory_item_id,
                            pricelist_header_id: $scope.pricelist_header_id
                        },
                        'profile': profile
                    },
                    function (response) {

                        /*if(response.status=='S'){
                         $scope.price = response.pricelist_price[0].price;
                         $scope.Amount = response.pricelist_price[0].price * $scope.Qty;
                         $scope.price_list_id = parseInt(id);
                         }else*/
                        if (response.status == 'E') {
                            swal({
                                title: response.message,
                                type: "error"
                            })
                            valid.$dirty = false
                            $scope.submitted = false

                        } else {
                            var org_id;


                            angular.forEach($scope.inventory, function (value) {
                                if ($scope.subinventory == value.subinventory_code) {
                                    org_id = value.organization_id;
                                }
                            });
                            $rootScope.lodingbox = true
                            getDataService2.data(
                                getApi.charge_create,
                                'post',
                                {
                                    'charge_entity': {
                                        "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                                        "transaction_type_id": parseInt($scope.transaction_type_id),
                                        "inventory_item_id": parseInt($scope.inventory_item_id),
                                        "uom": $scope.product_uom_code,
                                        "qty": $scope.Qty,
                                        "price_list_id": parseInt($scope.price_list_id),
                                        "price": parseInt($scope.price),
                                        "currency_code": $scope.currency_code,
                                        "line_category_code": $scope.line_category_code,
                                        "business_process_id": parseInt($scope.business_process_id),
                                        "reason": $scope.looup_code,
                                        "billing_type_code": $scope.billing_type_code,
                                        "organization_id": org_id,
                                        "subinventory": $scope.subinventory,
                                        //'price_list_id':$scope.priceListNameSel,
                                        'reference': $scope.Reference
                                    }
                                },
                                function (response) {
                                    if (response.Status == "S") {
                                        valid.$dirty = false
                                        $rootScope.lodingbox = false

                                        swal({
                                            title: response.Message,
                                            type: "success"

                                        }, function () {
                                            window.location.href = "index.html#/sr_update/1/" + $stateParams.sr_id
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


                    }
                );


            }

        }


    })