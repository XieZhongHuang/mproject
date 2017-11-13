IndonesiaApp
    .controller('CreateIBCtrl', function ($scope,$timeout, $rootScope, $http,menuData,$base64, Upload, getDataService, getApi, ngDialog, status) {
        /*** page init ***/
        var dates  = new Date();
        var years  = dates.getFullYear();
        var months = dates.getMonth()+1<10?'0'+(dates.getMonth()+1):dates.getMonth()+1;
        var days   = dates.getDate()<10?'0'+dates.getDate():dates.getDate();
        var hours  = dates.getHours()<10?'0'+dates.getHours():dates.getHours();
        var mins   = dates.getMinutes()<10?'0'+dates.getMinutes():dates.getMinutes();
        var secs   = dates.getSeconds()<10?'0'+dates.getSeconds():dates.getSeconds();
        //$scope.instance_date=years+'-'+months+'-'+days+' '+hours+':'+mins+':'+secs;
        $scope.lov_data    =      {};
        $scope.srNumberDom =      true;
        $scope.lotDom=true;
        $scope.serial_number_control_code= 'Y';
        $scope.lot_control_code= 'Y';
        //getDefaultInstaller
        getDataService.data(
            getApi.getDefaultInstaller,
            'post',
            {
                'parameter': JSON.stringify({
                    "vendor_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.vendor_id),
                    "s_timezone":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.s_timezone,
                    "c_timezone":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.c_timezone,
                    "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.resp_id,
                    "menu_id":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.menu_id
                })

            },function(res){
                $timeout(function () {
                    $scope.ib_form.$dirty = false;
                }, 0);

                $scope.F_ID_IB_CREATE_N=res.F_ID_IB_CREATE_N
                if(!$scope.F_ID_IB_CREATE_N){
                    $scope.party_id=res.party_id
                    $scope.party_name=res.party_name
                }
                //$scope.instance_date=res.date

            }
        )

        $scope.changeInstallDate =function(instance_date){
            $scope.instance_date = instance_date.slice(0,10)
        }

        $scope.profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

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
                                        $scope.lovData=          JSON.parse($scope.lov_data.radioValue);
                                        $scope.customer_id=      $scope.lovData.party_id;
                                        $scope.name=             $scope.lovData.customer_name;
                                        $scope.email=            $scope.lovData.email;
                                        $scope.phone=            $scope.lovData.phone;
                                        $scope.address=          $scope.lovData.address;
                                        $scope.account_number=   $scope.lovData.account_number;
                                        $scope.cust_account_id=  $scope.lovData.cust_account_id;

                                        $scope.CreateIBcustormerInfo = JSON.stringify($scope.lovData)
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //Category lov
        $scope.categoryLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.categoryFlag = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Category List"
                                $scope.searchtype = [{"value": "category", "name": "Category"}, {
                                    "value": "description",
                                    "name":  "Description"
                                }];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc= function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.currentPage =    page;
                                $scope.totalPage =      1;
                                $scope.pageSize =      10;
                                $scope.pages =         [];
                                $scope.endPage =        1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
                                    getDataService.data(
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index":     page,
                                                "page_size":      $scope.pageSize,
                                                "category_type":  "US_Service_Product_Type",
                                                "resp_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang":           $rootScope.InitalData.profile.language,
                                                "where":          $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
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
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index":     page,
                                                "page_size":      $scope.pageSize,
                                                "category_type":  "US_Service_Product_Type",
                                                "resp_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang":           $rootScope.InitalData.profile.language,
                                                "where":          $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
                                        }
                                    )
                                }
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    if($scope.lov_data.radioValue){
                                        $scope.lovData=       JSON.parse($scope.lov_data.radioValue);
                                        $scope.category_id=   $scope.lovData.category_id;
                                        $scope.category=      $scope.lovData.category;
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

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
                                                "ib_flag":         "Y",
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
                                                "ib_flag":         "Y",
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
                                    if($scope.lov_data.radioValue){
                                        $scope.lovData=                    JSON.parse($scope.lov_data.radioValue);
                                        $scope.item_number=                $scope.lovData.item_number;
                                        $scope.inventory_item_id=          $scope.lovData.inventory_item_id;
                                        $scope.category=                   $scope.lovData.category_desc;
                                        $scope.item_category_id=           $scope.lovData.item_category_id;
                                        $scope.item_category_set_id=       $scope.lovData.item_category_set_id;
                                        $scope.item_desc=                  $scope.lovData.item_desc;
                                        $scope.serial_number_control_code= $scope.lovData.serial_number_control_code;
                                        $scope.lot_control_code= $scope.lovData.lot_control_code;
                                        $scope.trackable_flag= $scope.lovData.trackable_flag;
                                        $scope.uom_code= $scope.lovData.uom_code;
                                        /*if($scope.serial_number_control_code=='Y'){
                                            $scope.srNumberDom=  true;
                                            $scope.lotDom=      false;
                                        }else{
                                            $scope.srNumberDom= false;
                                            $scope.lotDom=       true;
                                        }*/
                                        if($scope.lot_control_code=='N'){
                                            $scope.lot_number=''
                                        }
                                        if($scope.serial_number_control_code=='N'){
                                            $scope.serialNumber=''
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //serail number lov
        $scope.srNumberLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Serail Number";
                                $scope.searchtype = [{"value": "serial_number", "name": "Serial Number"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                }
                                $scope.serialFlag =   true;
                                $scope.showPrevNext = true;
                                $scope.currentPage =     page;
                                $scope.totalPage =       1;
                                $scope.pageSize =       10;
                                $scope.pages =          [];
                                $scope.endPage =         1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});//init srollbar
                                    getDataService.data(
                                        getApi.serial_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":         page,
                                                "page_size":          $scope.pageSize,
                                                "inventory_item_id":  parseInt($scope.inventory_item_id)
                                            })
                                        },
                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
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
                                        getApi.serial_number,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index":         page,
                                                "page_size":          $scope.pageSize,
                                                "inventory_item_id":  parseInt($scope.inventory_item_id),
                                                'serial_number':      $scope.serial_number_control_code,
                                                "where":              $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =       response.data;
                                            $scope.totalPage =  response.pagecount;
                                            $scope.endPage =    $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    if($scope.lov_data.radioValue){
                                        $scope.lovData=       JSON.parse($scope.lov_data.radioValue);
                                        $scope.serial_number= $scope.lovData.serial_number;
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //Lot Lov
        $scope.LotLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{"value": "lot_number", "name": "Lot Number"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc= function(name){
                                    $scope.seaTypeValue=name;
                                }
                                $scope.title = "Lot Number";
                                $scope.lotFlag =      true;
                                $scope.showPrevNext = true;
                                $scope.currentPage =     page;
                                $scope.totalPage =       1;
                                $scope.pageSize =       10;
                                $scope.pages =          [];
                                $scope.endPage =         1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});//init scrollbar
                                    getDataService.data(
                                        getApi.lot_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                'org_id':            JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id
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
                                        getApi.lot_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":         page,
                                                "page_size":          $scope.pageSize,
                                                "inventory_item_id":  parseInt($scope.inventory_item_id),
                                                'lot_number':         $scope.lot_number_control_code,
                                                'org_id':             JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                                "where":              $scope.where
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
                                        $scope.lovData=      JSON.parse($scope.lov_data.radioValue);
                                        $scope.lot_number=   $scope.lovData.lot_number;
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //installer Lov
        $scope.installerLov = function (page) {

            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Installer";
                                $scope.searchtype = [{"value": "party_name", "name": "Party Name"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc= function(name){
                                    $scope.seaTypeValue= name;
                                }
                                $scope.installerFlag= true;
                                $scope.showPrevNext = true;
                                $scope.currentPage =     page;
                                $scope.totalPage =       1;
                                $scope.pageSize =       10;
                                $scope.pages =          [];
                                $scope.endPage =         1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});//init scrollbar
                                    getDataService.data(
                                        getApi.installer,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":  page,
                                                "page_size":   $scope.pageSize,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code,
                                                'org_id': JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.org_id
                                            })
                                        },
                                        function (response) {
                                            $scope.data =      response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage =   $scope.totalPage;
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
                                        getApi.installer,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":     page,
                                                "page_size":      $scope.pageSize,
                                                'lot_number':     $scope.lot_number_control_code,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code,
                                                "where":          $scope.where,
                                                'org_id': JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.org_id
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
                                    if($scope.lov_data.radioValue){
                                        $scope.lovData=     JSON.parse($scope.lov_data.radioValue);
                                        $scope.party_name=  $scope.lovData.party_name;
                                        $scope.party_id=    $scope.lovData.party_id;
                                        $scope.technician_name =    '';
                                        $scope.technician_id =     ''
                                    }
                                }
                            }
                        });
                    }
                }
            )

        }

        //technician Lov
        $scope.technicianLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Technician";
                                $scope.searchtype = [{"value": "tech_name", "name": "Tech Name"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                }
                                $scope.technicianFlag=   true;
                                $scope.showPrevNext =    true;
                                $rootScope.lov_data =      {};
                                $scope.currentPage =        page;
                                $scope.totalPage =          1;
                                $scope.pageSize =          10;
                                $scope.pages =             [];
                                $scope.endPage =            1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});//init scrollbar
                                    getDataService.data(
                                        getApi.technician,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":   page,
                                                "page_size":    $scope.pageSize,
                                                "party_id":     parseInt($scope.party_id),
                                                "where":        $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =       response.data;
                                            $scope.totalPage =  response.pagecount;
                                            $scope.endPage =    $scope.totalPage;
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
                                        getApi.technician,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":   page,
                                                "page_size":    $scope.pageSize,
                                                "party_id":     parseInt($scope.party_id),
                                                "where":        $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =       response.data;
                                            $scope.totalPage =  response.pagecount;
                                            $scope.endPage =    $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    if($scope.lov_data.radioValue){
                                        $scope.lovData=             JSON.parse($scope.lov_data.radioValue);
                                        $scope.technician_name =    $scope.lovData.party_name;
                                        $scope.technician_id =      $scope.lovData.party_id;
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //clearRelative
        $scope.clearRelative= function(obj){
            if(obj=='name'){
                if(!$scope.name){
                    $scope.address= '';
                    $scope.email=   '';
                    $scope.phone=   '';
                    $scope.serialNumber=''
                    $scope.lot_number=''
                }
            }
            if(obj=='item'){
                $scope.category=    '';
                $scope.item_desc=   '';
                $scope.uom_code=    '';
                $scope.serialNumber=''
                $scope.lot_number=''
            }
        }
       /* $scope.removeSNLN = function(){
            $scope.serialNumber=''
            $scope.lot_number=''
        }*/

        $scope.customerType ='PERSON';

        if(sessionStorage.CreateIBcustormerInfo&&sessionStorage.CreateIBcustormerInfo!='undefined'){
            var CreateIBcustormerInfo = JSON.parse(sessionStorage.CreateIBcustormerInfo);

            $scope.customer_id=      CreateIBcustormerInfo.party_id;
            $scope.name=            CreateIBcustormerInfo.customer_name;
            $scope.email=            CreateIBcustormerInfo.email;
            $scope.phone=            CreateIBcustormerInfo.phone;
            $scope.address=         CreateIBcustormerInfo.address;
            $scope.account_number=   CreateIBcustormerInfo.account_number;
            $scope.cust_account_id=  CreateIBcustormerInfo.cust_account_id;
            $scope.customerType = CreateIBcustormerInfo.customer_type;
        }




        //submit
        $scope.submitForm = function (valid) {
            var newDate = new Date();
            var year = newDate.getFullYear();
            var month = newDate.getMonth()+1;
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minute = newDate.getMinutes();
            var second = newDate.getSeconds();

            var nowDate = year+'-'+(month>=10?month:'0'+month)+'-'+(day>=10?day:'0'+day)+' '+(hour>=10?hour:'0'+hour)+':'+(minute>=10?minute:'0'+minute)+':'+(second>=10?second:'0'+second)
            console.log($scope.instance_date,nowDate,$scope.instance_date>nowDate)

           /* if($scope.instance_date>nowDate){
                swal({
                    title:'The installed date is a future date. Are you sure to continue?',
                    type:"warning",
                    showCancelButton:true
                })
            }*/

            valid.$dirty=false;
            console.log(valid)
            $scope.submitted = true;
            if (valid.$valid) {
                if($scope.instance_date>nowDate){
                    swal({
                        title:'The installed date is a future date. Are you sure to continue?',
                        type:"warning",
                        showCancelButton:true
                    },function(){
                        if($scope.lot_number&&$scope.serialNumber){
                            swal({
                                title:'Both product Serial Number and Lot Number are enabled now. Please check item attributes.',
                                type:"error"
                            })
                            return false;
                        }
                        if(!$scope.lot_number&&!$scope.serialNumber){
                            swal({
                                title:'Product Serial Number or Lot Number should be enabled. Please check item attributes.',
                                type:"error"
                            })
                            return false;
                        }
                        $scope.createIbSubmitFlag=true;
                        getDataService.data(
                            getApi.create_IB,
                            'post',
                            {
                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                ib_entity: JSON.stringify({
                                    inv_item_id:    parseInt($scope.inventory_item_id),
                                    uom_code:       $scope.uom_code,
                                    customer_id:    parseInt($scope.customer_id),
                                    lot_ctrl_flag:  $scope.serial_number_control_code,
                                    serial_number:  $scope.serialNumber,
                                    lot_number:     $scope.lot_number,
                                    qty:            parseInt($scope.quanlity),
                                    install_date:   $scope.instance_date,
                                    installer_id:   parseInt($scope.party_id),
                                    technician_id:  parseInt($scope.technician_id),
                                    store_name:     $scope.storename
                                })
                            },
                            function (response) {
                                //更新Recent items
                                menuData.data()
                                if (response.Status == "S") {
                                    $scope.updateId= response.instance_id;
                                    swal({
                                        title: response.Message,
                                        type: "success",
                                        showCancelButton: true,
                                        confirmButtonText: "NEXT",
                                        cancelButtonText: "OK"

                                    }, function (isConfirm) {
                                        if($scope.CreateIBcustormerInfo){
                                            sessionStorage.CreateIBcustormerInfo = $scope.CreateIBcustormerInfo;
                                        }

                                        if(isConfirm){
                                            location.reload()
                                        }else{
                                            //location.reload()
                                            window.location.href="index.html#/ib_update/"+$base64.urlsafe_encode($scope.updateId);
                                        }

                                    });
                                }
                                else if (response.Status == "E") {

                                    swal({
                                        title: response.Message,
                                        type: "error"
                                    });
                                }
                                else{
                                    $rootScope.lodingbox=false;
                                    swal({
                                        title: response.Message,
                                        type: "error"
                                    });
                                }
                                $scope.createIbSubmitFlag=false;
                            }
                        )
                    })
                    return false
                }

                if($scope.lot_number&&$scope.serialNumber){
                    swal({
                        title:'Both product Serial Number and Lot Number are enabled now. Please check item attributes.',
                        type:"error"
                    })
                    return false;
                }
                if(!$scope.lot_number&&!$scope.serialNumber){
                    swal({
                        title:'Product Serial Number or Lot Number should be enabled. Please check item attributes.',
                        type:"error"
                    })
                    return false;
                }
                $scope.createIbSubmitFlag=true;
                getDataService.data(
                    getApi.create_IB,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        ib_entity: JSON.stringify({
                            inv_item_id:    parseInt($scope.inventory_item_id),
                            uom_code:       $scope.uom_code,
                            customer_id:    parseInt($scope.customer_id),
                            lot_ctrl_flag:  $scope.serial_number_control_code,
                            serial_number:  $scope.serialNumber,
                            lot_number:     $scope.lot_number,
                            qty:            parseInt($scope.quanlity),
                            install_date:   $scope.instance_date,
                            installer_id:   parseInt($scope.party_id),
                            technician_id:  parseInt($scope.technician_id),
                            store_name:     $scope.storename
                        })
                    },
                    function (response) {
                        //更新Recent items
                        menuData.data()
                        if (response.Status == "S") {
                            $scope.updateId= response.instance_id;
                            swal({
                                title: response.Message,
                                type: "success",
                                showCancelButton: true,
                                confirmButtonText: "NEXT",
                                cancelButtonText: "OK"

                            }, function (isConfirm) {
                                if($scope.CreateIBcustormerInfo){
                                    sessionStorage.CreateIBcustormerInfo = $scope.CreateIBcustormerInfo;
                                }
                                if(isConfirm){
                                    location.reload()
                                }else{
                                    //location.reload()
                                    window.location.href="index.html#/ib_update/"+$base64.urlsafe_encode($scope.updateId);
                                }
                            });
                        }
                        else if (response.Status == "E") {

                            swal({
                                title: response.Message,
                                type: "error"
                            });
                        }
                        else{
                            $rootScope.lodingbox=false;
                            swal({
                                title: response.Message,
                                type: "error"
                            });
                        }
                        $scope.createIbSubmitFlag=false;
                    }
                )
            }else{
                $('html,body').animate({'scrollTop': $("input[name="+valid.$error.required[0].$name+"]").offset().top-150},500);
            }

        }
    }
);