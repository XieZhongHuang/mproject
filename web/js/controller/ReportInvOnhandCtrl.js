/**
 * Created by fuguxu on 2016/8/19.
 */

IndonesiaApp
    .controller('ReportInvOnhandCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService,getDataService2, getApi, ngDialog, status, $filter){
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

        //init Subinventory
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
                console.log($scope.inventory)
                //$scope.DoCtrlPagingAct2(1);
            }

        );

        //选择不同Subinventory
        $scope.choiceSubinventory = function(subinventory_code){
            $scope.subinventory_code = subinventory_code;
        }

        //init price list
        getDataService.data(
            getApi.getHeader,
            'post',
            {
                'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify(

                )

            },
            function (response) {
                $scope.priceList=response.pricelist_header;
                console.log($scope.priceList)
                $scope.list_header_id=$scope.priceList[0].list_header_id;

            }
        )

        //选择不同price list
        $scope.choicePriceList=function(id){
            $scope.list_header_id = parseInt(id);
        }



        //download
        $scope.DoCtrlPagingAct= function(page){
            var ref=window.location.href;
            $scope.totalPage = page;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }


            $http({
                url:getApi.srReportDate+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method:'post',
                data:$.param({
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "price_list_id": $scope.list_header_id,
                        "subinventory_code": $scope.subinventory_code,
                        "item_category_id":$scope.inventory_item_id,
                        "item": $scope.item_number,
                        "category_code": $scope.category,
                        "category_id":$scope.category_id
                    }),
                    'objecttype' :"OH"
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(response){
                if(response.file_name=='No Data Found'){
                    swal({
                        title:response.file_name,
                        type:'warning'
                    })
                }else{
                    window.open(
                        response.url+'/filedown?filename='+ response.file_name +'&filetype=application/msexcel&downLoadType=REPORT'
                    )
                }

            })


            /*getDataService.data(
                getApi.srReportDate,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "price_list_id": $scope.list_header_id,
                        "subinventory_code": $scope.subinventory_code,
                        "item_category_id":$scope.inventory_item_id,
                        "item": $scope.item_number,
                        "category_code": $scope.category,
                        "category_id":$scope.category_id
                    }),
                    'objecttype' :"OH"
                },
                function (response) {
                    window.open(
                        'https://iservicetest.midea.com:8081/rest/filedown?filename='+ response +'&filetype=application/msexcel&downLoadType=REPORT'
                    )

                }
            )*/
        }

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }



        //item lov
       /* $scope.itemlov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/pricelist_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.price_item = angular.fromJson($rootScope.lov_data.radioValue).item_num;
                                    $scope.price_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc;
                                    $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "item_number",
                                    "name": "item_number"
                                }, {"value": "item_desc", "name": "item_desc"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                ;//设置option默认值
                                $scope.price_item = true
                                $scope.showPrevNext = true;
                                $scope.title = "PriceList"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.getItemDate,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize
                                                //"organization_id": $rootScope.InitalData.profile.organization_id,
                                                //"resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                //"appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                //"lang": $rootScope.InitalData.profile.language,
                                                //"category_id": parseInt($scope.category_id),
                                                //"where": $scope.where

                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                            console.log(response,$scope.data)

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
                                        getApi.getItemDate,
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
        }*/

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
                                    "name": "item_number"
                                }, {"value": "item_desc", "name": "item_desc"}];
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


        //reset
        $scope.reset= function(){
            $scope.subinventory_code='';
            $scope.item_number='';
            $scope.category='';
            $scope.list_header_id='';
        }

    }

);





