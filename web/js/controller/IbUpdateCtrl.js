IndonesiaApp
.controller('IbUpdateCtrl',function($scope, $rootScope, $timeout, $http,$base64, Upload, $stateParams,menuData, getDataService, getApi, ngDialog, status){
        //init
        $scope.InitalData=    JSON.parse($base64.urlsafe_decode(localStorage.InitalData));
        $scope.lov_data =     {};
        $scope.serDom=        true;
        $scope.installerDis=  true;
        $scope.technicianDis= true;

        getDataService.data(
            getApi.ib_detail,
            'post',
            {
                'parameter': JSON.stringify({
                    "instance_id": parseInt($base64.urlsafe_decode($stateParams.instance_id)),
                    "language":    $scope.InitalData.profile.language,
                    "s_timezone":  $scope.InitalData.profile.s_timezone,
                    "c_timezone":  $scope.InitalData.profile.c_timezone,
                    "resp_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id),
                    "appl_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id),
                    "menu_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.menu_id),
                    "organization_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id)
                })
            },function(data){
                $scope.modData=           data.ib_info;
                $scope.F_ID_IB_CREATE_N=$scope.modData.F_ID_IB_CREATE_N
                $scope.customer_type=     $scope.modData.customer_type;
                $scope.customer_name=     $scope.modData.customer_name;
                $scope.address=           $scope.modData.address;
                $scope.email=             $scope.modData.email;
                $scope.phone=             $scope.modData.phone;
                $scope.category=          $scope.modData.category;
                $scope.install_date=      $scope.modData.install_date.slice(0,10);
                $scope.item_number=       $scope.modData.item_number;
                $scope.item_desc=         $scope.modData.item_desc;
                $scope.uom_code=          $scope.modData.uom;
                $scope.serial_number=     $scope.modData.serial_number;
                $scope.lot_number=        $scope.modData.lot_number;
                $scope.party_name=        $scope.modData.installer;
                $scope.party_id=          $scope.modData.installer_id;
                $scope.technician_name=   $scope.modData.Technician;
                $scope.installer_id=      $scope.modData.installer_id;
                $scope.technician_id=     $scope.modData.Technician_id;
                $scope.customer_id=       $scope.modData.customer_id;
                $scope.instance_id=       $scope.modData.instance_id;
                $scope.inventory_item_id= $scope.modData.inventory_item_id;
                $scope.instance_number=   $scope.modData.instance_number;
                $scope.quanlity=          1;
                $scope.warranty_end_date= $scope.modData.warranty_end_date;
                $scope.warranty_start_date= $scope.modData.warranty_start_date;
                $scope.storename = $scope.modData.store_name;
                $timeout(function(){
                    $scope.ib_form.$dirty = false;
                }, 0);
            },
            'N'
        )

        $scope.monthSort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        $scope.monthNumber=[01,02,03,04,05,06,07,08,09,10,11,12]
        $scope.changeDate = function(install_date){
            var month = install_date.slice(3,6)
        }




        //clearRelatives
        $scope.clearRelative= function(obj){
            if(obj=='name'){
                if(!$scope.name){
                    $scope.address= '';
                    $scope.email=   '';
                    $scope.phone=   '';
                }
            }
            if(obj=='item'){
                $scope.category=  '';
                $scope.item_desc= '';
                $scope.uom_code=  '';
            }
        }

        //customerInfo lov
        $scope.addCustomerInfo = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.nameFlag = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Customer Information"
                                $scope.searchtype = [{"value": "customer_name", "name": "Name"}, {
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
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});
                                    getDataService.data(
                                        getApi.cmList,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":    page,
                                                "page_size":     $scope.pageSize,
                                                "customer_name": $scope.obj_select,
                                                "customer_type": $scope.CustomerType,
                                                "phone":         $scope.phone,
                                                "query_type":    "lov"
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage =   response.pagecount;
                                            $scope.endPage =     $scope.totalPage;
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
                                    getDataService.data(
                                        getApi.cmList,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":    page,
                                                "page_size":     $scope.pageSize,
                                                "customer_type": $scope.CustomerType,
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
                                    $scope.lov_data=       JSON.parse($scope.lov_data.radioValue);
                                    $scope.customer_id =   $scope.lov_data.party_id;
                                    $scope.customer_name = $scope.lov_data.customer_name;
                                    $scope.address =       $scope.lov_data.address;
                                    $scope.email =         $scope.lov_data.email;
                                    $scope.phone =         $scope.lov_data.phone;
                                    $scope.party_id =      $scope.lov_data.party_id;
                                    $scope.customer_type = $scope.lov_data.customer_type;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
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
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.currentPage = page;
                                $scope.totalPage =   1;
                                $scope.pageSize =   10;
                                $scope.pages =      [];
                                $scope.endPage =     1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});
                                    getDataService.data(
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":    page,
                                                "page_size":     $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id":       $scope.InitalData.profile.resp_id,
                                                "appl_id":       $scope.InitalData.profile.appl_id,
                                                "lang":          $rootScope.InitalData.profile.language,
                                                "where":         $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =        response.data;
                                            $scope.totalPage =   response.pagecount;
                                            $scope.endPage =     $scope.totalPage;
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

                                    getDataService.data(
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":    page,
                                                "page_size":     $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id":       $scope.InitalData.profile.resp_id,
                                                "appl_id":       $scope.InitalData.profile.appl_id,
                                                "lang":          $rootScope.InitalData.profile.language,
                                                "where":         $scope.where
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
                                    $scope.lov_data=         JSON.parse($scope.lov_data.radioValue);
                                    $scope.category_id =     $scope.lov_data.category_id;
                                    $scope.category =        $scope.lov_data.category;
                                    $scope.category_set_id = $scope.lov_data.category_set_id;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
                                }
                            }
                        });
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
                            template: "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Item List";
                                $scope.searchtype = [{
                                    "value": "item_number",
                                    "name":  "item_number"
                                }, {"value": "item_desc", "name": "item_desc"}];

                                $scope.itemFlag = true;
                                $scope.showPrevNext = true;
                                $scope.obj_select= {};
                                $scope.obj_select.value=$scope.searchtype[0].value;
                                $scope.seaTypeValue=$scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.currentPage = page;
                                $scope.totalPage =   1;
                                $scope.pageSize =   10;
                                $scope.pages =      [];
                                $scope.endPage =     1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});
                                    getDataService.data(
                                        getApi.sr_item,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":      page,
                                                "page_size":       $scope.pageSize,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id":         $scope.InitalData.profile.resp_id,
                                                "appl_id":         $scope.InitalData.profile.appl_id,
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
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":      page,
                                                "page_size":       $scope.pageSize,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id":         $scope.InitalData.profile.resp_id,
                                                "appl_id":         $scope.InitalData.profile.appl_id,
                                                "lang":            $rootScope.InitalData.profile.language,
                                                "category_id":     parseInt($scope.category_id),
                                                "where":           $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =          response.data;
                                            $scope.totalPage =     response.pagecount;
                                            $scope.endPage =       $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                $rootScope.noData= false;
                                if (value == "2") {
                                    $scope.lov_data=                    JSON.parse($scope.lov_data.radioValue);
                                    $scope.item_number =                $scope.lov_data.item_number
                                    $scope.inventory_item_id =          $scope.lov_data.inventory_item_id
                                    $scope.item_desc =                  $scope.lov_data.item_desc.replace(/&quot;/g,'"')
                                    $scope.category =                   $scope.lov_data.category_desc
                                    $scope.category_id =                $scope.lov_data.item_category_id
                                    $scope.category_set_id =            $scope.lov_data.item_category_set_id
                                    $scope.uom_code =                   $scope.lov_data.uom_code;
                                    $scope.serial_number_control_code = $scope.lov_data.serial_number_control_code;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
                                    if($scope.serial_number_control_code=='Y'){
                                        $scope.serDom=true;
                                        $scope.lotDom=false;
                                    }else{
                                        $scope.serDom=false;
                                        $scope.lotDom=true;
                                    }
                                }
                            }
                        });
                    }
                }
            )
        }

        //Serial Lov
        $scope.srNumberLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "SerialNumber";
                                $scope.searchtype = [{"value": "serial_number", "name": "Serial Number"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.serialFlag =   true;
                                $scope.showPrevNext = true;
                                $scope.currentPage =  page;
                                $scope.totalPage =    1;
                                $scope.pageSize =    10;
                                $scope.pages =       [];
                                $scope.endPage =      1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                    getDataService.data(
                                        getApi.serial_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id)
                                            })
                                        },

                                        function (response) {
                                            $scope.data =         response.data;
                                            $scope.totalPage =    response.pagecount;
                                            $scope.endPage =      $scope.totalPage;
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
                                    getDataService.data(
                                        getApi.serial_number,
                                        'post',
                                        {
                                            profile: JSON.stringify($scope.InitalData.profile),
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                'serial_number':     $scope.serial_number_control_code,
                                                "where":             $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =            response.data;
                                            $scope.totalPage =       response.pagecount;
                                            $scope.endPage =         $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                $rootScope.noData= false;
                                if (value == "2") {
                                    $scope.lov_data=       JSON.parse($scope.lov_data.radioValue);
                                    $scope.serial_number=  $scope.lov_data.serial_number;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
                                }
                            }
                        });
                    }
                }
            )
        }

        //Lot Lov
        $scope.lotNumberLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Lot Number";
                                $scope.searchtype = [{"value": "lot_number", "name": "lot number"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.lotFlag =         true;
                                $scope.showPrevNext =    true;
                                $scope.currentPage =        page;
                                $scope.totalPage =          1;
                                $scope.pageSize =          10;
                                $scope.pages =             [];
                                $scope.endPage =            1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                    getDataService.data(
                                        getApi.lot_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                'org_id':            $scope.InitalData.profile.organization_id
                                            })
                                        },
                                        function (response) {
                                            $scope.data =            response.data;
                                            $scope.totalPage =       response.pagecount;
                                            $scope.endPage =         $scope.totalPage;
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
                                    getDataService.data(
                                        getApi.lot_number,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                'lot_number':        $scope.lot_number_control_code,
                                                'org_id':            $scope.InitalData.profile.organization_id,
                                                "where":             $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =            response.data;
                                            $scope.totalPage =       response.pagecount;
                                            $scope.endPage =         $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                $rootScope.noData= false;
                                if (value == "2") {
                                    $scope.lov_data=     JSON.parse($scope.lov_data.radioValue);
                                    $scope.lot_number =  $scope.lov_data.lot_number;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
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
                            template: "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Installer";
                                $scope.searchtype = [{"value": "installer_number", "name": "installer number"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.installerFlag =   true;
                                $scope.showPrevNext =    true;
                                $scope.currentPage =        page;
                                $scope.totalPage =          1;
                                $scope.pageSize =          10;
                                $scope.pages =             [];
                                $scope.endPage =            1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                    getDataService.data(
                                        getApi.installer,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":   page,
                                                "page_size":    $scope.pageSize,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code
                                            })
                                        },
                                        function (response) {
                                            $scope.data =       response.data;
                                            $scope.totalPage =  response.pagecount;
                                            $scope.endPage =    $scope.totalPage;
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
                                    getDataService.data(
                                        getApi.installer,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":        page,
                                                "page_size":         $scope.pageSize,
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                'lot_number':        $scope.lot_number_control_code,
                                                'org_id':            $scope.InitalData.profile.organization_id,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code,
                                                "where":             $scope.where
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
                                $rootScope.noData= false;
                                if (value == "2") {
                                    $scope.lov_data= JSON.parse($scope.lov_data.radioValue);
                                    $scope.party_name =  $scope.lov_data.party_name;
                                    $scope.party_id =    $scope.lov_data.party_id;
                                    $scope.technician_name='';
                                    $scope.technician_id='';
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
                                }
                            }
                        })
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
                            template: "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.title = "Technician";
                                $scope.searchtype = [{"value": "tech_name", "name": "Tech Name"}];
                                $scope.obj_select= {};
                                $scope.obj_select.value= $scope.searchtype[0].value;
                                $scope.seaTypeValue=     $scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                };
                                $scope.technicianFlag =  true;
                                $scope.showPrevNext =    true;
                                $scope.currentPage =        page;
                                $scope.totalPage =          1;
                                $scope.pageSize =          10;
                                $scope.pages =             [];
                                $scope.endPage =            1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                    getDataService.data(
                                        getApi.technician,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index":  page,
                                                "page_size":   $scope.pageSize,
                                                "party_id":    parseInt($scope.party_id),
                                                "where":       $scope.where
                                            })
                                        },
                                        function (response) {
                                            $scope.data =      response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage =   $scope.totalPage;
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
                                            $scope.data = response.data;
                                            $scope.totalPage =  response.pagecount;
                                            $scope.endPage =    $scope.totalPage;
                                        }
                                    )
                                }
                            },
                            preCloseCallback: function (value) {
                                $rootScope.noData= false;
                                if (value == "2") {
                                    $scope.lov_data= JSON.parse($scope.lov_data.radioValue);
                                    console.log($scope.lov_data)
                                    $scope.technician_name =    $scope.lov_data.party_name;
                                    $scope.technician_id =      $scope.lov_data.party_id;
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.ib_form.$dirty = true;
                                    }, 0);
                                }
                            }
                        });
                    }
                }
            )
        }

        $scope.technicianRemove = function(){
            $scope.technician_name =  '';
            $scope.technician_id = '';
        }
        $scope.installerRemove = function(){
            $scope.party_name =  '';
            $scope.party_id =   '';
        }

        $scope.serialNumberChange=function(serial_number){
            $scope.serial_number = serial_number;
        }

        //submit
        $scope.submitForm = function (valid) {
            console.log(valid)
            valid.$dirty=false;
            $scope.submitted = true;
            if (valid.$valid) {
                $scope.upDateIbSubmitFlag=true;
                getDataService.data(
                    getApi.ib_update,
                    'post',
                    {
                        profile: JSON.stringify($scope.InitalData.profile),
                        ib_entity: JSON.stringify({
                            instance_id:    parseInt($scope.instance_id),
                            serial_number:  $scope.serial_number,
                            lot_number:     $scope.lot_number,
                            installer_id:   parseInt($scope.party_id),
                            technician_id:  parseInt($scope.technician_id),
                            customer_id:    parseInt($scope.customer_id),
                            store_name:     $scope.storename,
                            install_date:  $scope.install_date
                        })
                    },
                    function (response) {
                        //更新Recent items
                        menuData.data()
                        if (response.Status == "S") {

                            swal({
                                title: response.Message,
                                type: "success"

                            }, function (callback) {

                                location.reload()
                                $rootScope.reload()
                                $timeout(function () {
                                    $scope.sr_form.$dirty = false;
                                }, 0);
                            });
                        }
                        else if (response.Status == "E") {

                            swal({
                                title: response.Message,
                                type: "error"
                            });
                        }
                        else{
                            swal({
                                title: 'error',
                                type: "error"
                            });
                        }
                        $scope.submitted = false;
                        $scope.upDateIbSubmitFlag=false;
                    }
                )
            }else{
                $('html,body').animate({'scrollTop': $("input[name="+valid.$error.required[0].$name+"]").offset().top-150},500)
            }
        }
    }
);