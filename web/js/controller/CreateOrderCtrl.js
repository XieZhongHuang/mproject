/**
 * Created by Administrator on 2016/4/11.
 */
IndonesiaApp
    .controller('CreateOrderCtrl', function ($scope, getDataService2, getApi, ngDialog, $rootScope, $timeout, $state, menuData, $base64) {


        $scope.arr = [];

        if (!$scope.order_Number) {
            $scope.is_show = true;
        }

        $scope.newItem = function (arr) {

            var item = {
                "line_number": arr.length + 1,
                "item_number": "",
                "quantity": "",
                "uom_code": "",
                "item_description": "",
                "inventory_item_id": ""
            };

            $scope.arr.push(item);
        };

        $scope.newItem($scope.arr);

        var init = function () {

            /*  this.getSourceIvnData = function () {

             getDataService2.data(getApi.s_inventory, 'POST', {
             parameter: {
             "organization_id": $rootScope.InitalData.profile.organization_id
             }
             },
             function (res) {
             if (res.data) {
             $scope.source_inventory = res.data.default_subinv;
             }
             })
             };
             */
            this.initDate = function () {
                var date = new Date();
                var dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate().toString();
                var MM = (date.getMonth() + 1).toString();
                var yyyy = date.getFullYear().toString();
                var hh = date.getHours().toString();
                var mm = date.getMinutes().toString();
                var ss = date.getSeconds();

                $scope.required_date = yyyy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + (ss < 10 ? "0" + ss : ss);
            }

        };

        var initData = new init();
        //initData.getSourceIvnData();
        initData.initDate();

        //item lov
        $scope.itemLov = function (page, index) {

            if (!$scope.is_show) {
                return false;
            }

            if ( !$scope.organization_id ) {
                $scope.notSelectedDes = true;
                return false;
            }
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/order_item_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {
                        var responseData = JSON.parse($scope.lov_data.radioValue);
                        $scope.arr[index] = {
                            "inventory_item_id": responseData.inventory_item_id,
                            "item_number": responseData.item_number,
                            "uom_code": responseData.uom_code,
                            "item_description": responseData.item_desc,
                            "line_number": index + 1
                        };

                        $timeout(function () {
                            $scope.add_order_form.$dirty = true;
                        }, 0);
                        // $scope.inventory_item_id = responseData.inventory_item_id;

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

                    $scope.sr_item = true;
                    $scope.showPrevNext = true;
                    $scope.title = "Item List";
                    $rootScope.lov_data = {};
                    $scope.currentPage = 1;
                    $scope.totalPage = 1;
                    $scope.pageSize = 10;
                    $scope.pages = [];
                    $scope.endPage = 1;
                    $scope.$on('ngDialog.opened', function () {

                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                        getDataService2.data(
                            getApi.item_required_lov,
                            'post',
                            {
                                // profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
                                'parameter': {
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": $scope.organization_id,
                                    "serial_number": 1,
                                    "lang": $rootScope.InitalData.profile.language,
                                    "where": $scope.where
                                }
                            },

                            function (response) {
                                if (response) {
                                    $scope.data = response.data;
                                    $scope.totalPage = response.pagecount;
                                    $scope.endPage = $scope.totalPage;
                                }
                            }
                        )
                    });

                    $scope.DoCtrlPagingAct = function (page) {
                        if ($scope.obj_select.value == null) {
                            $scope.where = '';
                        }

                        else {
                            var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                            $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                        }

                        getDataService2.data(
                            getApi.item_required_lov,
                            'post',
                            {
                                'parameter': {
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                    "serial_number": 1,
                                    "lang": $rootScope.InitalData.profile.language,
                                    "where": $scope.where
                                }
                            },
                            function (response) {
                                if (response) {
                                    $scope.data = response.data;
                                    $scope.totalPage = response.pagecount;
                                    $scope.endPage = $scope.totalPage;
                                }
                            }
                        )
                    };
                }
            })
        };

        //delete
        $scope.del = function (i) {
            $scope.arr.splice(i, 1);
            angular.forEach($scope.arr, function (item_object, index) {
                if (index + 1 > i) {
                    $scope.arr[index].line_number = $scope.arr[index].line_number - 1;
                }
            });
        };

        //destination_in_lov
        $scope.destination_in_lov = function (page) {
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/destination_in_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {
                        var responseData = JSON.parse($scope.lov_data.radioValue);
                        $scope.destination_in = responseData.subinv_code;
                        $scope.organization_id = responseData.organization_id;
                        $scope.source_inventory = responseData.source_subinv;
                    }
                    ;

                },
                controller: function ($scope, $rootScope) {
                    $scope.searchtype = [{
                        "value": "subinv_code",
                        "name": "Subinv Code"
                    }, {"value": "subinv_desc", "name": "Subinv Desc"}];
                    $scope.obj_select = {};
                    $scope.obj_select.value = $scope.searchtype[0].value;
                    $scope.seaTypeValue = $scope.searchtype[0].name;


                    $scope.searFuc = function (name) {
                        $scope.seaTypeValue = name;
                    }

                    $scope.sr_item = true
                    $scope.showPrevNext = true;
                    $scope.title = "Destination Inventory"
                    $rootScope.lov_data = {};
                    $scope.currentPage = 1;
                    $scope.totalPage = 1;
                    $scope.pageSize = 10;
                    $scope.pages = [];
                    $scope.endPage = 1;
                    $scope.$on('ngDialog.opened', function () {

                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                        getDataService2.data(
                            getApi.des_inventory,
                            'post',
                            {
                                // profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
                                'parameter': {
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                    "lang": $rootScope.InitalData.profile.language,
                                    "where": $scope.where
                                }
                            },

                            function (response) {
                                $scope.data = response.data;
                                $scope.totalPage = response.pagecount;
                                $scope.endPage = $scope.totalPage;
                            }
                        )
                    });

                    $scope.DoCtrlPagingAct = function (page) {
                        if ($scope.obj_select.value == null) {
                            $scope.where = '';
                        }

                        else {
                            var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                            $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                        }

                        getDataService2.data(
                            getApi.des_inventory,
                            'post',
                            {
                                'parameter': {
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                    "lang": $rootScope.InitalData.profile.language,
                                    "where": $scope.where
                                }
                            },
                            function (response) {
                                if (response) {
                                    $scope.data = response.data;
                                    $scope.totalPage = response.pagecount;
                                    $scope.endPage = $scope.totalPage;
                                }
                            }
                        )
                    };
                }
            })
        };

        $scope.getV = function (val, index) {

            $scope.arr[index].quantity = parseInt(val[index].quantity);

        };

        $scope.submitForm = function (valid) {

            var status;

            if ($scope.status === "Incomplete") {
                status = 1;
            }

            $scope.submitted = true;
            valid.$dirty = false;

            if (valid.$valid) {
                var param = {
                    "header_status": status,
                    "organization_id": $scope.organization_id,
                    "date_required": $scope.required_date,
                    "from_subinventory_code": $scope.source_inventory,
                    "to_subinventory_code": $scope.destination_in,
                    "DESCRIPTION": $scope.description,
                    "transaction_type_id": null,
                    "lines": $scope.arr
                };
                getDataService2.data(getApi.create_order, "POST",
                    {
                        'parameter': param
                    },

                    function (response) {
                        if (response.Status == "S") {

                            menuData.data();
                            $scope.order_Number = response.data.request_number;
                            $scope.is_show = false;
                            $scope.is_add = true;
                            swal({
                                title: 'Order Number:' + response.data.request_number,
                                type: 'success'
                            }, function () {


                            })

                        } else {
                            swal({title: response.Message, type: "error"});

                            return false;
                        }
                    })
            }
        };

        // addNewOrder
        $scope.newOrder = function (valid) {
            //clear
            $scope.order_Number = null;
            $scope.source_inventory = null;
            $scope.description = null;
            $scope.destination_in = null;
            $scope.organization_id = null;
            initData.initDate();
            $scope.arr = [];
            $scope.newItem($scope.arr);
            $scope.submitted = false;
            $scope.notSelectedDes = false;
            $scope.is_add = false;
            $scope.is_show = true;
        }




    });