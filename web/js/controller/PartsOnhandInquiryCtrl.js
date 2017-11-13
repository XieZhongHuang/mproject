/**
 * Created by Augus on 2015/8/28.
 */
IndonesiaApp.controller('PartsOnhandInquiryCtrl',function($scope, $rootScope, $http,$base64,status,getDataService,ngDialog,getApi,getDataService2,$timeout){
    $scope.formData = {};
    $scope.noData=       false;
    $scope.currentPage =     1;
    $scope.totalPage =       0;
    $scope.pageSize =       10;
    $scope.pages =          [];
    $scope.endPage =         1;
    $scope.showPrevNext = true;

    getDataService2.data(
        getApi.get_subinventory,
        'post',
        {
            "parameter":{
                'transaction_type' :$scope.transaction_type
            }
        },
        function(response){
            $scope.inventory=response.data;
            $scope.DoCtrlPagingAct2(1);
        }

    );

    // change Subinventory
    $scope.changeSubinventory = function() {
        $scope.formData.location_code = '';
        $scope.formData.location_id= '';
    }

    //location lov
    $scope.locationLov = function (page, subinventory_code) {
        if (! subinventory_code) return;

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
                                $scope.formData.location_code = responseData.location_code;
                                $scope.formData.location_id= responseData.location_id;
                            }
                        },
                        controller: function ($scope, $rootScope) {
                            $scope.searchtype = [{
                                "value": "locator_code",
                                "name": "Locator Code"
                            }, {"value": "locator_desc", "name": "Locator Description"}];
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
                                            "serial_number": 1,
                                            "lang": $rootScope.InitalData.profile.language,
                                            "where": {'subinventory_code':subinventory_code}
                                        })

                                    },

                                    function (response) {
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
                                        $scope.where = {'subinventory_code':subinventory_code}
                                    }

                                }


                                getDataService.data(
                                    getApi.location,
                                    'post',
                                    {
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
            });
    };

   //Category lov
    $scope.categoryLov = function (page) {
        status.data(
            function (data) {
                if (data.status == "S") {
                    ngDialog.open({
                        className: "datatable-theme",
                        template: "dialog/npr_lov.html",
                        scope: $scope,
                        preCloseCallback: function (value) {
                            if (value == "2") {
                                $scope.category_id = angular.fromJson($rootScope.lov_data.radioValue).category_id
                                $scope.category = angular.fromJson($rootScope.lov_data.radioValue).category
                                $scope.category_set_id = angular.fromJson($rootScope.lov_data.radioValue).category_set_id
                            }
                        },
                        controller: function ($scope, $rootScope) {

                            // $scope.obj_select = 'category'
                            $scope.Category = true
                            $scope.showPrevNext = true;
                            $scope.title = "Category List"
                            $scope.searchtype = [{"value": "category", "name": "Category"}, {
                                "value": "description",
                                "name": "Description"
                            }];
                            $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//����optionĬ��ֵ
                            $rootScope.lov_data = {};
                            $scope.currentPage = 1;//Ĭ����ʾ��һҳ
                            $scope.totalPage = 1;
                            $scope.pageSize = 10;//Ĭ������
                            $scope.pages = [];
                            $scope.endPage = 1;
                            $scope.$on('ngDialog.opened', function () {

                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//��ʼ��������

                                getDataService.data(
                                    getApi.spcategory,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        'parameter': JSON.stringify({
                                            "page_index": page,
                                            "page_size": $scope.pageSize,
                                            "category_type": "US_Service_Product_Type",
                                            "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                            "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                            "lang":$rootScope.InitalData.profile.language,
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

                            //��ѯ����ҳ���
                            $scope.DoCtrlPagingAct = function (page) {
                                if ($scope.obj_select.value == null) {
                                    $scope.where = '';
                                }

                                else {
                                    var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                    $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                }


                                getDataService.data(
                                    getApi.spcategory,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        'parameter': JSON.stringify({
                                            "page_index": page,
                                            "page_size": $scope.pageSize,
                                            "category_type": "US_Service_Product_Type",
                                            "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                            "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                            "lang": $rootScope.InitalData.profile.language,
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

    //item lov
    $scope.itemLov = function (page) {
        status.data(
            function (data) {
                if (data.status == "S") {
                    ngDialog.open({
                        className: "datatable-theme",
                        template: "dialog/npr_lov.html",
                        scope: $scope,
                        preCloseCallback: function (value) {
                            if (value == "2") {
                                $scope.item_number = angular.fromJson($rootScope.lov_data.radioValue).item_number
                                $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id
                                $scope.item_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc.replace(/&quot;/,'"');

                                $scope.category = angular.fromJson($rootScope.lov_data.radioValue).category_desc
                                $scope.category_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_id
                                $scope.category_set_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_set_id
                            }
                        },
                        controller: function ($scope, $rootScope) {
                            $scope.searchtype = [{
                                "value": "item_number",
                                "name": "Item Number"
                            }, {"value": "item_desc", "name": "Item Desc"}];
                            $scope.obj_select= {};
                            $scope.obj_select.value=$scope.searchtype[0].value;
                            $scope.seaTypeValue=$scope.searchtype[0].name;

                            $scope.searFuc=function(name){
                                $scope.seaTypeValue=name;
                            }
                            ;//����optionĬ��ֵ
                            $scope.sr_item = true
                            $scope.showPrevNext = true;
                            $scope.title = "Item List"
                            $rootScope.lov_data = {};
                            $scope.currentPage = 1;//Ĭ����ʾ��һҳ
                            $scope.totalPage = 1;
                            $scope.pageSize = 10;//Ĭ������
                            $scope.pages = [];
                            $scope.endPage = 1;
                            $scope.$on('ngDialog.opened', function () {

                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//��ʼ��������

                                getDataService.data(
                                    getApi.OnhandItems,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        'parameter': JSON.stringify({
                                            "page_index": page,
                                            "page_size": $scope.pageSize,
                                            "organization_id":  $rootScope.InitalData.profile.organization_id,
                                            "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                            "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
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

                            //��ѯ����ҳ���
                            $scope.DoCtrlPagingAct = function (page) {
                                if ($scope.obj_select.value == null) {
                                    $scope.where = '';
                                }

                                else {
                                    var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                    $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                }

                                getDataService.data(
                                    getApi.OnhandItems,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        'parameter': JSON.stringify({
                                            "page_index": page,
                                            "page_size": $scope.pageSize,
                                            "organization_id": $rootScope.InitalData.profile.organization_id,
                                            "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                            "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
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
    //��ѯ
    $scope.DoCtrlPagingAct2 = function (page) {
        $scope.currentPage =page;
        getDataService2.data(
            getApi.OnhandInquiry,
            'post',
            {
              'parameter': {
                    "page_index": page,
                    "page_size": 10,
                    "user_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id,
                    "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                    "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                    "organization_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                    "lang": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                    "where":{
                        "category_id":parseInt($scope.category_id),
                        "category_set_id":parseInt($scope.category_set_id),
                        "inventory_item_id":parseInt($scope.inventory_item_id),
                        "subinventory_code":$scope.subinventory||"",
                        "location_id": $scope.formData.location_id
                    }
                }
        },
            function (response) {
                if(response){
                    $scope.List = response.data;
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;
                }
            }
        )
    };

    //监听回车事件
    $scope.enter = function(ev) {

        if (ev.keyCode == 13){
            $scope.DoCtrlPagingAct2(1);
        }
    }

    $scope.itemem = function () {
        $scope.item_number = '';
        $scope.inventory_item_id = '';
        $scope.item_desc = '';
    }
    $scope.categoryem = function () {
        $scope.category_id = '';
        $scope.category = '';
        $scope.category_set_id = '';
    }
    $scope.reset = function () {
        $scope.category_id = '';
        $scope.category = '';
        $scope.category_set_id = '';
        $scope.item_number = '';
        $scope.inventory_item_id = '';
        $scope.item_desc = '';
        $scope.subinventory = '';
    }
});
