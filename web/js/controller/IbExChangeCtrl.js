/**
 * Created by Administrator on 2016/7/26 0026.
 */
IndonesiaApp.controller('IbExChangeCtrl', function( $scope, $rootScope, $timeout, $http,$base64, Upload, $stateParams, getDataService, getDataService2, getApi, ngDialog, status,menuData,$filter ){
    //init
    $scope.InitalData=    JSON.parse($base64.urlsafe_decode(localStorage.InitalData));
    $scope.lov_data =     {};
    $scope.serDom=        true;
    $scope.installerDis=  true;
    $scope.technicianDis= true;

    var init = function () {
        this.initData = function(){
            return getDataService.data(
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
                        "organization_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id),
                        "org_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.org_id)
                    })
                },function(data){
                    $scope.modData=           data.ib_info;
                    $scope.customer_type=     $scope.modData.customer_type;
                    $scope.customer_name=     $scope.modData.customer_name;
                    $scope.address=           $scope.modData.address;
                    $scope.email=             $scope.modData.email;
                    $scope.phone=             $scope.modData.phone;
                    $scope.category=          $scope.modData.category;
                    $scope.install_date=      $scope.modData.install_date;
                    $scope.item_number=       $scope.modData.item_number;
                    $scope.item_desc=         $scope.modData.item_desc;
                    $scope.uom_code=          $scope.modData.uom;
                    $scope.serial_number=     $scope.modData.serial_number;
                    $scope.lot_number=        $scope.modData.lot_number;
                    $scope.installer_name=        $scope.modData.installer;
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
                    $scope.serial_control_flag = $scope.modData.serial_control_flag;
                    $scope.party_name = data.default_ex_party_name;
                    $scope.new_party_id = data.default_ex_party_id;
                    $scope.F_ID_IB_EXCHANGE = $scope.modData.F_ID_IB_EXCHANGE
                    $scope.N_PARTY_SOURCE_TABLE=data.N_PARTY_SOURCE_TABLE
                    $scope.default_ex_account_id = data.default_ex_account_id
                    $scope.new_address = data.default_address1;
                    $scope.new_location_id = data.default_location;
                    $scope.N_LOCATION_TYPE_CODE = data.N_LOCATION_TYPE_CODE;
                    $timeout(function(){
                        $scope.ex_change_form.$dirty = false;
                    }, 0);
                },
                'N'
            )
        }
    };


    var initDate = new init();
    initDate.initData();

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
    };

    $scope.newSrNumLov = function (page) {
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
                                $scope.new_sr_num=  $scope.lov_data.serial_number;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
                                }, 0);
                            }
                        }
                    });
                }
            }
        )
    };

    //lotNumLov
    $scope.newLotLov = function (page) {
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
                                $scope.new_lot_num =  $scope.lov_data.lot_number;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
                                }, 0);
                            }
                        }
                    });
                }
            }
        )
    };

    //party

    $scope.partyLov = function (page) {
        status.data(
            function (data) {
                if (data.status == "S") {
                    ngDialog.open({
                        className: "datatable-theme",
                        template:  "dialog/ib_lov.html",
                        scope: $scope,
                        controller: function ($scope, $rootScope) {
                            $scope.title = "Party";
                            $scope.searchtype = [{"value": "party_name", "name": "Party Name"}];
                            $scope.obj_select= {};
                            $scope.obj_select.value= $scope.searchtype[0].value;
                            $scope.seaTypeValue=     $scope.searchtype[0].name;
                            $scope.searFuc=function(name){
                                $scope.seaTypeValue=name;
                            };
                            $scope.partyFlag =   true;
                            $scope.showPrevNext = true;
                            $scope.currentPage =  page;
                            $scope.totalPage =    1;
                            $scope.pageSize =    10;
                            $scope.pages =       [];
                            $scope.endPage =      1;
                            $scope.$on('ngDialog.opened', function () {
                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                getDataService.data(
                                    getApi.party,
                                    'post',
                                    {
                                        profile: JSON.stringify($scope.InitalData.profile),
                                        'parameter': JSON.stringify({
                                            "page_index":        page,
                                            "page_size":         $scope.pageSize,
                                            "party_name": ""
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
                                    getApi.party,
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
                                $scope.party_name = $scope.lov_data.Party_Name;
                                $scope.new_party_id = $scope.lov_data.new_party_id;
                                $scope.new_account_id = $scope.lov_data.new_account_id;
                                $scope.N_PARTY_SOURCE_TABLE = $scope.lov_data.N_PARTY_SOURCE_TABLE;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
                                }, 0);
                            }
                        }
                    });
                }
            }
        )
    };

    //addressLov
    $scope.addressLov = function (page){
        status.data(
            function (data) {
                if (data.status == "S") {
                    ngDialog.open({
                        className: "datatable-theme",
                        template:  "dialog/ib_lov.html",
                        scope: $scope,
                        controller: function ($scope, $rootScope) {
                            $scope.title = "Address";
                            $scope.is_status = true;
                            $scope.addressFlag =   true;
                            $scope.showPrevNext = true;
                            $scope.currentPage =  page;
                            $scope.totalPage =    1;
                            $scope.pageSize =    10;
                            $scope.pages =       [];
                            $scope.endPage =      1;
                            $scope.$on('ngDialog.opened', function () {
                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});
                                getDataService.data(
                                    getApi.newAddress,
                                    'post',
                                    {
                                        profile: JSON.stringify($scope.InitalData.profile),
                                        'parameter': JSON.stringify({
                                            "page_index":        page,
                                            "page_size":         $scope.pageSize,
                                            "party_id": $scope.new_party_id
                                        })
                                    },

                                    function (response) {
                                        $scope.data =         response.data;
                                        $scope.totalPage =    response.pagecount;
                                        $scope.endPage =      $scope.totalPage;
                                    }
                                )
                            });

                        },
                        preCloseCallback: function (value) {
                            $rootScope.noData= false;
                            if (value == "2") {
                                $scope.lov_data=       JSON.parse($scope.lov_data.radioValue);
                                $scope.new_address = $scope.lov_data.address1;
                                $scope.N_LOCATION_TYPE_CODE = $scope.lov_data.N_LOCATION_TYPE_CODE;
                                $scope.new_location_id = $scope.lov_data.new_location_id;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
                                }, 0);
                            }
                        }
                    });
                }
            }
        )
    };

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
                                $scope.customer_id =   $scope.lov_data.customer_id;
                                $scope.customer_name = $scope.lov_data.customer_name;
                                $scope.address =       $scope.lov_data.address;
                                $scope.email =         $scope.lov_data.email;
                                $scope.phone =         $scope.lov_data.phone;
                                $scope.party_id =      $scope.lov_data.party_id;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
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
                                $scope.installer_name =  $scope.lov_data.party_name;
                                $scope.installer_id =    $scope.lov_data.party_id;
                                //update $dirty
                                $timeout(function(){
                                    $scope.ex_change_form.$dirty = true;
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
                                    $scope.ex_change_form.$dirty = true;
                                }, 0);
                            }
                        }
                    });
                }
            }
        )
    }


    //submit
    $scope.submitForm = function (valid) {
        valid.$dirty=false;
        $scope.submitted = true;
        console.log($scope.new_sr_num);
        if (valid.$valid) {
            getDataService.data(
                getApi.exchange,
                'post',
                {
                    profile: JSON.stringify($scope.InitalData.profile),
                    ib_entity: JSON.stringify({
                        instance_id:    parseInt($scope.instance_id),
                        inventory_item_id: $scope.inventory_item_id,
                        old_serial_number: $scope.serial_number,
                        old_lot_number: $scope.lot_number,
                        new_party_id: $scope.new_party_id,
                        new_account_id: $scope.new_account_id,
                        new_location_id: $scope.new_location_id,
                        N_LOCATION_TYPE_CODE: $scope.N_LOCATION_TYPE_CODE,
                        N_PARTY_SOURCE_TABLE: $scope.N_PARTY_SOURCE_TABLE,
                        new_account_id:$scope.default_ex_account_id,
                        new_lot_number: $scope.new_lot_num,
                        new_serial_number: $scope.new_sr_num,
                        serial_control_flag:$scope.serial_control_flag,
                        installer_id:$scope.installer_id,
                        technician_id:$scope.technician_id
                    })
                },
                function (response) {
                    //更新Recent items
                    menuData.data();
                    if (response.Status == "S") {

                        swal({
                            title: response.Message,
                            type: "success"

                        }, function (callback) {

                            /*location.reload();
                            $rootScope.reload();
                            $timeout(function () {
                                $scope.ex_change_form.$dirty = false;
                            }, 0);*/
                            initDate.initData();
                            window.location.href="#/ib_update/"+$filter('urlFilter')($scope.instance_id);
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

                }
            )
        }else{
            $('html,body').animate({'scrollTop': $("input[name="+valid.$error.required[0].$name+"]").offset().top-150},500)
        }
    }
});