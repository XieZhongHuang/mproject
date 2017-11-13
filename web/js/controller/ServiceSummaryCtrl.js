/**
 * Created by lingyin on 15/6/5.
 */
IndonesiaApp
    .controller('ServiceSummaryCtrl', function ($scope, $sce, $rootScope, status, $location, $base64, $http, Upload, $stateParams, getDataService, getApi, ngDialog) {

        if ($location.path() == '/F_ID_SR_SEARCH') {
            $scope.start_date = ''
            $scope.end_date = ''
            $scope.status_flag = ''
            $scope.task_close_flag = ''
            $scope.query_type = 'summary'
            $scope.today_sr_flag = ''
            //init search
            var ref = window.location.href;
            if (ref.indexOf('=') > -1) {
                ref = ref.substring(ref.indexOf('=') + 1);
                $scope.sr_number = $base64.urlsafe_decode(ref);
            }
        } else {
            $scope.query_type = 'homepage'
            $scope.status_flag = $stateParams.status_flag
            $scope.task_close_flag = $stateParams.task_close_flag
            $scope.start_date = $stateParams.start_date
            $scope.end_date = $stateParams.end_date
            $scope.today_sr_flag = $stateParams.today_sr_flag
        }

        $scope.reset = function () {
            $scope.sr_number = ''
            $scope.sr_type = ''
            $scope.subject = ''
            $scope.sr_status = ''
            $scope.customer_name = ''
            $scope.phone = ''
            $scope.item_number = ''
            $scope.inventory_item_id = ''
            $scope.serial_number = ''
            //重置时将url的条件也重置，防止再次点击查询时number被赋值
            if(ref.indexOf('=') > -1){
                window.location.href = ref.substring(0,ref.indexOf('=')+1);
            }
            window.location.href = ref;
        }

        $scope.currentPage = 1;//默认显示第一页
        $scope.totalPage = 1;
        $scope.pageSize = 10;//默认条数
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.showPrevNext = true//显示上一页下一页

        if (!$scope.sr_number) {
            getDataService.data(
                getApi.sr_summary,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": 1,
                        "page_size": 10,
                        "query_type": $scope.query_type,
                        "where": {
                            "sr_number": $scope.sr_number || '',
                            "sr_type": parseInt($scope.sr_type) || '',
                            "sr_status": $scope.sr_status || '',
                            "subject": $scope.subject || '',
                            "status_flag": $scope.status_flag,
                            "today_sr_flag": $scope.today_sr_flag,
                            "task_close_flag": $scope.task_close_flag,
                            "start_date": $scope.start_date,
                            "end_date": $scope.end_date
                        }
                    })
                },
                function (response) {
                    $scope.summaryList = response.data
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;

                    var $nicescroll = $('.nicescroll-rails');
                    for(var i = 0;i<$nicescroll.length;i++){
                        $nicescroll.eq(i).css({display:'none'})
                    }
                }
            )
        }

        //customer Name lov
        $scope.namelov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                                className: "datatable-theme",
                                template:  "dialog/ib_lov.html",
                                scope:     $scope,
                                controller: function ($scope) {
                                    $rootScope.lov_data = {};
                                    $scope.nameFlag =     true;
                                    $scope.showPrevNext = true;
                                    $scope.title =        "Customer Information";
                                    $scope.searchtype =   [{"value": "customer_name", "name": "Name"}, {
                                        "value": "phone",
                                        "name":  "Phone"
                                    }];
                                    $scope.obj_select= {};
                                    $scope.obj_select.value=$scope.searchtype[0].value;
                                    $scope.seaTypeValue=$scope.searchtype[0].name;
                                    $scope.searFuc=function(name){

                                        $scope.seaTypeValue=name;
                                    };
                                    $scope.currentPage =  page;
                                    $scope.totalPage =    1;
                                    $scope.pageSize =    10;
                                    $scope.pages =       [];
                                    $scope.endPage =      1;
                                    $scope.$on('ngDialog.opened', function () {
                                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
                                        getDataService.data(
                                            getApi.cmList,
                                            'post',
                                            {
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index":    page,
                                                    "page_size":     $scope.pageSize,
                                                    "customer_type": $scope.customerType,
                                                    "phone":         $scope.phone,
                                                    "query_type":    "lov"
                                                })
                                            },
                                            function (response) {
                                                $scope.data =        response.data;
                                                $scope.totalPage =   response.pagecount;
                                                $scope.endPage =     $scope.totalPage;
                                            }
                                        )
                                    });

                                    //query page
                                    $scope.DoCtrlPagingAct = function (page) {
                                        if ($scope.obj_select.value == null) {
                                            $scope.where = '';
                                        }
                                        else {
                                            var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                            $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                        }
                                        getDataService.data(
                                            getApi.cmList,
                                            'post',
                                            {
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index":    page,
                                                    "page_size":     $scope.pageSize,
                                                    "customer_type": $scope.customerType,
                                                    "where":         $scope.where,
                                                    "query_type":    "lov"
                                                })
                                            },
                                            function (response) {
                                                $scope.data =        response.data;
                                                $scope.totalPage =   response.pagecount;
                                                $scope.endPage =     $scope.totalPage;
                                            }
                                        )
                                    };
                                },
                                preCloseCallback: function (value) {
                                    if (value == "2") {
                                        if($scope.lov_data.radioValue){
                                            $scope.lovData = JSON.parse($rootScope.lov_data.radioValue);
                                            $scope.customer_id= $scope.lovData.party_id;
                                            $scope.customer_name = $scope.lovData.customer_name;
                                        }
                                    }
                                }
                            });
                    }
                }
            )
        };
        //item lov
        $scope.itemLov = function (page) {
                status.data(
                    function (data) {
                        if (data.status == "S") {
                            ngDialog.open({
                                    className: "datatable-theme",
                                    template: "dialog/sr_lov.html",
                                    scope: $scope,
                                    preCloseCallback: function (value) {
                                        if (value == "2") {
                                            $scope.item_number = angular.fromJson($rootScope.lov_data.radioValue).item_number
                                            $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id

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
                                        ;//设置option默认值
                                        $scope.sr_item = true
                                        $scope.showPrevNext = true;
                                        $scope.title = "Item List"
                                        $rootScope.lov_data = {};
                                        $scope.currentPage = 1;//默认显示第一页
                                        $scope.totalPage = 1;
                                        $scope.pageSize = 10;//默认条数
                                        $scope.pages = [];
                                        $scope.endPage = 1;
                                        $scope.$on('ngDialog.opened', function () {

                                            $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                            getDataService.data(
                                                getApi.sr_item,
                                                'post',
                                                {
                                                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                    'parameter': JSON.stringify({
                                                        "page_index": page,
                                                        "page_size": $scope.pageSize,
                                                        "organization_id": $rootScope.InitalData.profile.organization_id,
                                                        "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                        "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                        "lang": $rootScope.InitalData.profile.language,
                                                        "category_id": parseInt($scope.category_id),
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
                                                getApi.sr_item,
                                                'post',
                                                {
                                                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                    'parameter': JSON.stringify({
                                                        "page_index": page,
                                                        "page_size": $scope.pageSize,
                                                        "organization_id": $rootScope.InitalData.profile.organization_id,
                                                        "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                        "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                        "lang": $rootScope.InitalData.profile.language,
                                                        "category_id": parseInt($scope.category_id),
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
        //当前页数据
        $scope.DoCtrlPagingAct = function (page) {
            $scope.currentPage = page
            var ref = window.location.href;
            if (ref.indexOf('=') > -1) {
                ref = ref.substring(ref.indexOf('=') + 1);
                $scope.sr_number = $base64.urlsafe_decode(ref);
            }

            getDataService.data(
                getApi.sr_summary,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": 10,
                        "query_type": $scope.query_type,
                        "where": {
                            "sr_number": $scope.sr_number || '',
                            "sr_type": parseInt($scope.sr_type) || '',
                            "sr_status": $scope.sr_status || '',
                            "subject": $scope.subject || '',
                            "customer_name": $scope.customer_name || '',
                            "customer_phone": $scope.phone || '',
                            "inventory_item_id": parseInt($scope.inventory_item_id) || '',
                            "serial_number": $scope.serial_number || '',
                            "today_sr_flag": $scope.today_sr_flag,
                            "status_flag": $scope.status_flag,
                            "task_close_flag": $scope.task_close_flag,
                            "start_date": $scope.start_date,
                            "end_date": $scope.end_date
                        }
                    })
                },
                function (response) {
                    $scope.summaryList = response.data
                    $scope.totalPage = response.pagecount;
                    $scope.searchFlag = false;

                    if (localStorage.sr_number == "") {
                        window.location.href = "index.html#/F_ID_SR_SEARCH";
                    }
                }
            )
        };

        if ($scope.sr_number) {
            $scope.DoCtrlPagingAct(1);
        }
        $scope.enter = function (ev) {

            if (ev.keyCode == 13) {
                $scope.DoCtrlPagingAct(1);
            }
        }
        $scope.saveCustomerName = function () {
            $scope.sr_number = $('#sr_number').val() || '';
            var ref = window.location.href;
            if (ref.indexOf('=') > -1) {
                ref = ref.substring(0, ref.indexOf('=') + 1);
                window.location.href = ref + $base64.urlsafe_encode($scope.sr_number);
            } else {
                window.location.href = ref + '?sr_number=' + $base64.urlsafe_encode($scope.sr_number);
            }
        }

        getDataService.data(
            getApi.get_sr_initial,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            }
            , function (data) {
                $scope.srData = data


            })


    })
