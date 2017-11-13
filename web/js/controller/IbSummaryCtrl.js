IndonesiaApp
    .controller('IbSummaryCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService, getApi, ngDialog, status, $filter){
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

        $scope.DoCtrlPagingAct= function(page){
            $scope.currentPage =  page;
            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }

            getDataService.data(
                getApi.summary,
                'post',
                {
                    'parameter': JSON.stringify({
                        "page_index":      page,
                        "page_size":       $scope.pageSize,
                        "s_timezone":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.s_timezone,
                        "c_timezone":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.c_timezone,
                        "organization_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id),
                        "lang":            JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                        "resp_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id),
                        "appl_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id),
                        "menu_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.menu_id),
                        "where":{
                            "install_number":  $scope.install_number,
                            "serial_number":   $scope.serial_number,
                            "lot_number":      $scope.lot_number,
                            "customer_name":   $scope.customer_name,
                            "item_number":         $scope.item_number
                        }
                    })
                },
                function (response) {
                    if ( response.data ) {
                        $scope.ex_change_flag = response.exchange_flag;
                        $scope.totalPage =        response.pagecount;
                        $scope.searchIbData =     response.data;
                        $scope.endPage =          $scope.totalPage;
                    }
                }
            )
        }

        $scope.DoCtrlPagingAct(1);

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }

        $scope.saveSerialNumber=function(){
            $scope.serial_number= $('#serial_number').val() || '';
            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(0,ref.indexOf('=')+1);
                window.location.href=ref+$base64.urlsafe_encode($scope.serial_number);
            }else{
                window.location.href=ref+'?serial_number='+$base64.urlsafe_encode($scope.serial_number);
            }
        };


        //Name lov
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
                                    $scope.currentPage =  page;
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

        //itemlov
        $scope.itemLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $rootScope.lov_data = {};
                                $scope.itemFlag= true;
                                $scope.title = "Item List";
                                $scope.searchtype = [{
                                    "value": "item_number",
                                    "name":  "Item Number"
                                }, {"value": "item_desc", "name": "Item Desc"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc= function(name){
                                    $scope.seaTypeValue=name;
                                }
                                $scope.showPrevNext = true;
                                $scope.currentPage =     page;
                                $scope.totalPage =       1;
                                $scope.pageSize =       10;
                                $scope.pages =          [];
                                $scope.endPage =         1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
                                    getDataService.data(
                                        getApi.sr_item,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index":      page,
                                                "page_size":       $scope.pageSize,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang":            $rootScope.InitalData.profile.language,
                                                "category_id":     parseInt($scope.category_id),
                                                "where":           $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
                                        }
                                    )
                                });

                                //query scrollbar
                                $scope.DoCtrlPagingAct = function (page) {
                                    $scope.currentPage =     page;
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
                                                "page_index":      page,
                                                "page_size":       $scope.pageSize,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang":            $rootScope.InitalData.profile.language,
                                                "category_id":     parseInt($scope.category_id),
                                                "where":           $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    if($rootScope.lov_data.radioValue){
                                        $scope.lovData= JSON.parse($rootScope.lov_data.radioValue);
                                        $scope.item_number= $scope.lovData.item_number;

                                    }
                                }
                            }
                        });
                    }
                }
            )
        };

        $scope.queryObj = function (obj,id) {
            $scope.instance_id =  id;
            if(!obj.parent_instance_num){
                $scope.up_ex_ib = false;
            }else if(obj.parent_instance_num){
                $scope.up_ex_ib = false;
            }
        };

        $scope.goUpdateIB = function () {
            if ( !$scope.instance_id )
                return ;
            window.location.href="#/ib_update/"+$filter('urlFilter')($scope.instance_id);
        };

        $scope.goExChangeIB = function () {
            if ( !$scope.instance_id )
                return;
            window.location.href="#/id_ex_change/"+$filter('urlFilter')($scope.instance_id);

        };

        $scope.goNewIB =function(){
            window.location.href="#/F_ID_IB_CREATE";
        }

        //reset
        $scope.reset= function(){
            $scope.install_number= '';
            $scope.serial_number= '';
            $scope.customer_name= '';
            $scope.address= '';
            $scope.lot_number= '';
            $scope.item_number='';
            //重置时将url的条件也重置，防止再次点击查询时number被赋值
            if(ref.indexOf('=') > -1){
                window.location.href = ref.substring(0,ref.indexOf('=')+1);
            }
            window.location.href = ref;
        }

    }

);


