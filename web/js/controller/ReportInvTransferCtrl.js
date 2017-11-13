/**
 * Created by fuguxu on 2016/8/19.
 */

IndonesiaApp
    .controller('ReportInvTransferCtrl',function($scope, $state,$timeout, $rootScope, $http, $base64,Upload, getDataService,getDataService2, getApi, ngDialog, status, $filter){
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


        getDataService.data(
            getApi.TranxType,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                "parameter":JSON.stringify({

                })
            },
            function(response){
                $scope.TranxType=response.data;
                //$scope.DoCtrlPagingAct2(1);
                console.log(response)
            }
        );

        $scope.choiceTranxType =function(transaction_type_name){
            angular.forEach($scope.TranxType,function(v,k){
                if(transaction_type_name== v.transaction_type_name){
                    $scope.transaction_type_id = v.transaction_type_id;
                    $scope.transaction_source_type_id = v.transaction_source_type_id;
                    $scope.transaction_type_name = v.transaction_type_name;
                    $scope.transaction_action_id = v.transaction_action_id;
                }
            })
        }

        //选择不同Subinventory from
        $scope.choiceSubinventoryFrom = function(organization_code_from){
            $scope.SubinventoryFrom=organization_code_from;

            if(organization_code_from){
                angular.forEach($scope.inventory,function(v,k){
                    if(organization_code_from== v.subinventory_code){
                        $scope.locator_ctl = v.locator_ctl
                        if($scope.locator_ctl=='N'){
                            $scope.location_code= '';
                            $scope.location_id= '';
                        }
                    }
                })
            }else{
                $scope.location_code= '';
                $scope.location_id= '';
            }

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


        //选择不同Subinventory to
        /*$scope.choiceSubinventoryTo = function(organization_code_to){
            $scope.SubinventoryTo=organization_code_to;

        }*/


        $scope.chargeDateFrom = function(date){
            if(date){
                $scope.submittedDateFrom=false;
            }else{
                $scope.submittedDateFrom=true;;
            }
        }
        $scope.chargeDateTo = function(date){
            if(date){
                $scope.submittedDateTo=false;
            }else{
                $scope.submittedDateTo=true;
            }
        }



        //download
        $scope.DoCtrlPagingAct= function(page){
            var ref=window.location.href;
            $scope.totalPage = page;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }

            if(!$scope.trs_date_from){
                $scope.submittedDateFrom = true;
                if(!$scope.trs_date_to){
                    $scope.submittedDateTo=true;
                }
                return;
            }

            if(!$scope.trs_date_to){
                $scope.submittedDateTo=true;
                return;
            }

            $http({
                url:getApi.srReportDate+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method:'post',
                data:$.param({
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "subinventory_code_from": $scope.SubinventoryFrom,
                        //"subinventory_code_to": $scope.SubinventoryTo,
                        "locator_id":$scope.location_id,
                        "item": $scope.item_number,
                        "category_code": $scope.category,
                        "trx_date_from":$scope.trs_date_from,
                        "trx_date_to":$scope.trs_date_to,
                        "reference":$scope.reference,
                        "transaction_type_id":parseInt($scope.transaction_type_id),
                        "transaction_source_type_id":parseInt($scope.transaction_source_type_id),
                        "transaction_action_id":parseInt($scope.transaction_action_id),
                        "transaction_type_name":$scope.transaction_type_name
                    }),
                    'objecttype' :"TX"
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

        }

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
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
            $scope.item_number='';
            $scope.subinventory_code_from='';
            $scope.organization_code_to='';
            $scope.category='';
            $scope.trs_date_from='';
            $scope.trs_date_to='';
            $scope.reference='';
            $scope.transaction_type_id='';
            $scope.transaction_source_type_id ='';
            $scope.transaction_type_name = '';
            $scope.transaction_action_id = '';
        }

    }

);





