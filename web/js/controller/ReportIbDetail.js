/**
 * Created by fuguxu on 2016/8/19.
 */

IndonesiaApp
    .controller('ReportIbDetail',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService, getApi, ngDialog, status, $filter){
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


        //选择不同价格
        $scope.choicePriceList = function(id){
            angular.forEach( $scope.priceList,function(v,k){
                if(v.list_header_id==id){
                    $scope.description=v.description;
                    $scope.currency_code=v.currency_code;
                    $scope.start_date_active=v.start_date_active;
                    $scope.org_name=v.org_name;
                }
            })

        }


        $scope.chargeDateFrom = function(date){
            if(date){
                $scope.submittedWarrantyDateFrom=false;
            }else{
                $scope.submittedWarrantyDateFrom=true;;
            }
        }
        $scope.chargeDateTo = function(date){
            if(date){
                $scope.submittedWarrantyDateTo=false;
            }else{
                $scope.submittedWarrantyDateTo=true;
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


           /* if(!$scope.warranty_date_from){
                $scope.submittedWarrantyDateFrom = true;
                if(!$scope.warranty_date_to){
                    $scope.submittedWarrantyDateTo=true;
                }
                return;
            }

            if(!$scope.warranty_date_to){
                $scope.submittedWarrantyDateTo=true;
                return;
            }*/

            if(!$scope.party_name&&!$scope.item_number&&!$scope.customer_name&&!($scope.install_date_from&&$scope.install_date_to)&&!($scope.warranty_date_from&&$scope.warranty_date_to)&&!$scope.category){
                swal({
                    title:'Please enter at least one search parameter.',
                    type:'warning'
                })
                return;
            }


            $http({
                url:getApi.srReportDate+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method:'post',
                data:$.param({
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "installer": $scope.party_name,
                        "item": $scope.item_number,
                        "cust_name": $scope.customer_name,
                        "install_date_from": $scope.install_date_from,
                        "install_date_to": $scope.install_date_to,
                        "warranty_date_from": $scope.warranty_date_from,
                        "warranty_date_to":  $scope.warranty_date_to,
                        "category":$scope.category
                    }),
                    'objecttype' :"IB"
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
                        "installer": $scope.party_name,
                        "item": $scope.item_number,
                        "cust_name": $scope.customer_name,
                        "install_date_from": $scope.install_date_from,
                        "install_date_to": $scope.install_date_to,
                        "warranty_date_from": $scope.warranty_date_from,
                        "warranty_date_to":  $scope.warranty_date_to
                    }),
                    'objecttype' :"IB"
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




        //Customer Name lov
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


        //categoryLov
        $scope.categoryLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/ib_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $rootScope.lov_data = {};
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
                                    if($rootScope.lov_data.radioValue){
                                        $scope.lovData=       JSON.parse($rootScope.lov_data.radioValue);
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
                                $rootScope.lov_data = {};
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
                                    if($rootScope.lov_data.radioValue){
                                        $scope.lovData=     JSON.parse($rootScope.lov_data.radioValue);
                                        $scope.party_name=  $scope.lovData.party_name;
                                        $scope.party_id=    $scope.lovData.party_id;
                                    }
                                }
                            }
                        });
                    }
                }
            )

        }


        //reset
        $scope.reset= function(){
            $scope.customer_name='';
            $scope.category = '';
            $scope.item_number='';
            $scope.install_date_from='';
            $scope.install_date_to='';
            $scope.party_name='';
            $scope.warranty_date_from='';
            $scope.warranty_date_to='';
        }

    }

);





