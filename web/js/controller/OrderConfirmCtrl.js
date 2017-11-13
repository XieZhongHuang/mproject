/**
 * Created by Administrator on 2016/4/11.
 */
IndonesiaApp
    .controller('OrderConfirmCtrl', function ($scope, getApi, getDataService2, ngDialog, $rootScope) {

        //selected
        var selectedArr = 0; //选中confirm计数.
        $scope.confirmData = []; //初始化

        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.showPrevNext = true;

        //order_num_lov
        $scope.order_num_lov = function (page) {
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/order_item_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {
                        var responseData = JSON.parse($scope.lov_data.radioValue);

                        $scope.order_number = responseData.request_number;
                        $scope.header_id = responseData.header_id;
                    }

                },
                controller: function ($scope, $rootScope) {
                    $scope.searchtype = [{
                        "value": "request_number",
                        "name": "Request Number"
                    }];
                    $scope.obj_select = {};
                    $scope.obj_select.value = $scope.searchtype[0].value;
                    $scope.seaTypeValue = $scope.searchtype[0].name;


                    $scope.searFuc = function (name) {
                        $scope.seaTypeValue = name;
                    }

                    $scope.num_item = true;
                    $scope.showPrevNext = true;
                    $scope.title = "Order Number";
                    $rootScope.lov_data = {};
                    $scope.currentPage = 1;
                    $scope.totalPage = 1;
                    $scope.pageSize = 10;
                    $scope.pages = [];
                    $scope.endPage = 1;
                    $scope.where = {};
                    $scope.$on('ngDialog.opened', function () {
                        $scope.where.confirm_flag = "Y";

                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                        getDataService2.data(
                            getApi.order_num_lov,
                            'post',
                            {
                                // profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
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
                            $scope.where.confirm_flag = "Y";
                        }

                        getDataService2.data(
                            getApi.order_num_lov,
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
                                if (response.data) {
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

        $scope.submitForm = function (valid) {

            $scope.submitted = true;

            if (valid.$valid) {
                $scope.DoCtrlPagingAct(1);
            }
        };

        $scope.DoCtrlPagingAct = function (page) {

            getDataService2.data(
                getApi.detail, 'POST',
                {
                    'parameter': {
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "lang": $rootScope.InitalData.profile.language,
                        "where": {
                            "header_id": $scope.header_id,
                            "confirm_flag": "Y"
                        }
                    }
                },
                function (response) {
                    if (response.data) {
                        selectedArr = 0;
                        $scope.is_confirm = false;

                        $scope.confirmData = response.data.lines;
                        $scope.totalPage = response.pagecount;
                        $scope.endPage = $scope.totalPage;
                    }

                }
            )
        };


        $scope.getV = function (val, index) {

            if (val[index].transaction_qty <= $scope.initTr_qty) {
                $scope.confirmData[index].transaction_qty = parseInt(val[index].transaction_qty);
            }
            else {
                $scope.confirmData[index].transaction_qty = $scope.initTr_qty;
            }

        };

        $scope.setV = function (val,index) {
            if (!$scope.initTr_qty){
                $scope.initTr_qty = val[index].transaction_qty
            }
        };

        $scope.selectedStatus = function ($event, index) {

            if (angular.isArray($scope.confirmData)) {

                $scope.confirmData[index].selected_order = $event.target.checked;

            }

            if ($event.target.checked) {
                selectedArr += 1;
                if (selectedArr > 0) {
                    $scope.is_confirm = true;
                }
            }

            if (!$event.target.checked) {
                selectedArr -= 1;
                if (selectedArr ==0 ) {
                    $scope.is_confirm = false;
                }

            }

        };


        $scope.confirm_submit_order = function () {

            var confirmOrder = [];

            if (angular.isArray($scope.confirmData)) {
                angular.forEach($scope.confirmData, function (confirmIObj) {
                    if (confirmIObj.selected_order) {
                        var params = {
                            'line_id': confirmIObj.line_id,
                            'deliveried_qty': confirmIObj.deliveried_qty,
                            'transaction_qty': confirmIObj.transaction_qty
                        };
                        confirmOrder.push(params);
                    }
                });

                getDataService2.data(getApi.confirm_order, 'POST',
                    {
                        'parameter': {
                            'lines': confirmOrder
                        }
                    },
                    function (response) {
                        if (response.Status == "S") {
                            swal({
                                title: 'Confirm ' + response.Message,
                                type: 'success'
                            }, function () {

                                $scope.DoCtrlPagingAct(1);
                            })

                        } else {
                            swal({title: response.Message, type: "error"});

                            return false;
                        }
                    })
            } else {
                return false;
            }

        }
    });