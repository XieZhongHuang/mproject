/**
 * Created by lingyin on 15/6/4.
 */
IndonesiaApp
    .controller('NewServiceCtrl', function ($http, $base64, $scope, $rootScope, Upload, menuData, getDataService, getApi, globals, ngDialog, status, AuthenticationService) {
        $scope.formData = {};

        $scope.resource_id = JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.owner_id;
        $scope.resource_name = JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.owner_name;
        $scope.group_id= JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.group_owner_id;
        $scope.group_name= JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.group_owner_name;

        $scope.checkCurchase_date = false; //控制
        $scope.removeItemRelative=function(){
            $scope.inventory_item_id = '';
            $scope.formData.instance_number = '';
            $scope.formData.serial_number = '';
            $scope.formData.lot_number='';
            $scope.warranty_start_date = ''
            $scope.warranty_end_dat =''
            $scope.instance_date =''
        }

        $scope.removeInstallNumber = function(){
            $scope.inventory_item_id = '';
            $scope.formData.instance_number = '';
            $scope.formData.serial_number = '';
            $scope.formData.lot_number='';
            $scope.warranty_start_date = ''
            $scope.warranty_end_dat =''
            $scope.instance_date =''
            $scope.instance_id='';
            $scope.contract_id='';
            $scope.contract_service_id='';
            $scope.item_desc='';
            $scope.category =''
            $scope.category_id=''
            $scope.item_number='';

        }

        $scope.sr_select_fun = function (item) {

            var arr = _.filter($scope.srData.sr_type, function (num) {
                return num.type_id == item
            });

            $scope.sr_select_arr = arr[0].ib_require_flag;
            $scope.serial_number_control_code = "Y";
        };

        //监听Customer变化 清空客户信息
        $scope.customer_c = function () {
            $scope.account_number = ''
            $scope.email = ''
            $scope.address = ''
            $scope.phone = ''
        }
        //监听Itemmodel
        $scope.Item_c = function () {
            $scope.item_desc = ''


        }
        $(".upload-list").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

        //父级改变model值
        $scope.$on('to-parent', function (d, data) {
            $scope.$apply(function () {
                $scope.res = JSON.parse(data);
                $scope.CustomerType = $scope.res.customer_type;
                $scope.customer_name = $scope.res.obj_name;
                $scope.customer_id = $scope.res.customer_id;
                $scope.email = $scope.res.email;
                $scope.phone = $scope.res.phone;
                $scope.country_name = $scope.res.country_name;
                $scope.province = $scope.res.province;
                $scope.city = $scope.res.city;
                $scope.district = $scope.res.district;
                $scope.address = $scope.res.address + ',' + $scope.district + ',' + $scope.res.city + ',' + $scope.res.province + ',' + $scope.country_name;
                $scope.postal_code = $scope.res.postal_code;
                $scope.account_number = $scope.res.account_number;
                $scope.cust_account_id = $scope.res.cust_account_id;
            });
        });

        //CustomerTypeChange
        $scope.CustomerTypeChange = function () {
            //个人，组织切换时清空数据
            $scope.customer_name = '';
            $scope.address = '';
            $scope.email = '';
            $scope.phone = '';
            $scope.customer_id = '';
        }

        //监听Category model
        $scope.$watch('category_id', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.p_looup_code = ''
                $scope.p_desc = ''
                $scope.looup_code = ''
                $scope.meaning = ''
            }
        });

        //监听Item model
        $scope.$watch('inventory_item_id', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.p_looup_code = ''
                $scope.p_desc = ''
                $scope.looup_code = ''
                $scope.meaning = ''
            }
        })
        //$scope.CustomerType = 'PERSON'
        getDataService.data(
            getApi.get_sr_initial,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            }
            , function (data) {
                $scope.srData = data;
                if($scope.srData.sr_type.length==1){
                    $scope.sr_type_item = data.sr_type[0].type_id;
                    $scope.sr_type($scope.sr_type_item)
                }

                var arr = _.filter(data.sr_type, function (val) {
                    return val.default_flag == 'Y'
                });
                if ( arr.length > 0 ) {
                    $scope.sr_select_fun(arr[0].type_id);
                }
                else {
                    $scope.sr_select_arr = "N"; // 默认显示 非必填;
                    $scope.serial_number_control_code = "Y";
                }

                $scope.urgency_id = data.urgency[2].urgency_id;
                $scope.severity_id = 2;
            },
            'N'
        )



        //set sr_type
        $scope.sr_type = function ( type_id) {

            angular.forEach($scope.srData.sr_type,function(v,k){
                if(v.type_id ==type_id){
                    $scope.sn_required = v.sn_required
                }
            })

            $scope.statusSelect = "";
            getDataService.data(
                getApi.get_sr_init_status,
                    'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        sr_type_id: parseInt(type_id)
                }, function (resp) {

                    $scope.statusSelect = resp.data[0].status_id;
                    $scope.status = resp.data;
                },
                    'N'
            )

        };


        //customerInfo lov
        $scope.custInfo = function (page, optionSel) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                    $scope.customer_id = angular.fromJson($rootScope.lov_data.radioValue).party_id
                                    $scope.customer_name = angular.fromJson($rootScope.lov_data.radioValue).customer_name
                                    $scope.address = angular.fromJson($rootScope.lov_data.radioValue).address
                                    $scope.email = angular.fromJson($rootScope.lov_data.radioValue).email
                                    $scope.phone = angular.fromJson($rootScope.lov_data.radioValue).phone
                                    $scope.party_id = angular.fromJson($rootScope.lov_data.radioValue).party_id
                                    $scope.account_number = angular.fromJson($rootScope.lov_data.radioValue).account_number
                                    $scope.cust_account_id = angular.fromJson($rootScope.lov_data.radioValue).cust_account_id
                                    $scope.CustomerType = angular.fromJson($rootScope.lov_data.radioValue).customer_type

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.sr_cminfo_table = true
                                $scope.showPrevNext = true;
                                $scope.title = "Customer Information";
                                $scope.searchtype = [{value: "customer_name", name: "Name"}, {
                                    value: "phone",
                                    name: "Phone"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;

                                }

                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;


                                //查询、分页数据
                                $scope.DoCtrlPagingAct = function (page) {

                                    if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.cmList,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "customer_type": $scope.CustomerType,
                                                "where": $scope.where,
                                                "query_type": "lov"
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
                            template: "dialog/sr_lov.html",
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
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                };//设置option默认值
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
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
                                        getApi.category,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
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

       //SR-Group lov
        $scope.groupLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                               $scope.group_id= angular.fromJson($rootScope.lov_data.radioValue).group_id
                               $scope.group_name= angular.fromJson($rootScope.lov_data.radioValue).group_name

                                }
                            },
                            controller: function ($scope, $rootScope) {

                                // $scope.obj_select = 'Group'
                                $scope.Group = true
                                $scope.showPrevNext = true;
                                $scope.title = "GroupList"
                                $scope.searchtype = [{"value": "group", "name": "Group"}, {
                                    "value": "description",
                                    "name": "Description"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                };//设置option默认值
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.sr_group,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "where": $scope.where

                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            console.log($scope.data);
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
                                        getApi.sr_group,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "category_type": "US_Service_Product_Type",
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
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

        //Problem Code Lov
        $scope.ProblemCodeLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.p_looup_code = angular.fromJson($rootScope.lov_data.radioValue).looup_code
                                    $scope.p_meaning = angular.fromJson($rootScope.lov_data.radioValue).meaning
                                    $scope.p_desc = angular.fromJson($rootScope.lov_data.radioValue).desc
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                // $scope.obj_select = 'lookup_code'
                                $scope.searchtype = [{
                                    "value": "lookup_code",
                                    "name": "Problem Code"
                                }, {"value": "meaning", "name": "Meaning"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                };//设置option默认值
                                $scope.Problem = true
                                $scope.showPrevNext = true;
                                $scope.title = "Problem List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.problem_code,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "category_id": parseInt($scope.category_id),
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                "sr_type_id": parseInt($scope.sr_type_item),
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
                                })


                                //查询、分页数据
                                $scope.DoCtrlPagingAct = function (page) {

                                    $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + $scope.obj_name2 + '"}');

                                    getDataService.data(
                                        getApi.lookup_code,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "category_id": parseInt($scope.category_id),
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                "sr_type_id": parseInt($scope.sr_type_item),
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

       //Resolution Code lov
        $scope.ResoLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                    $scope.looup_code = angular.fromJson($rootScope.lov_data.radioValue).r_looup_code
                                    $scope.meaning = angular.fromJson($rootScope.lov_data.radioValue).meaning
                                    $scope.desc = angular.fromJson($rootScope.lov_data.radioValue).desc
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "lookup_code",
                                    "name": "Resolution Code"
                                }, {"value": "meaning", "name": "Meaning"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                };//设置option默认值
                                $scope.Resolution = true
                                $scope.showPrevNext = true;
                                $scope.title = "Resolution List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.resolution_code,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "category_id": parseInt($scope.category_id),
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                "sr_type_id": parseInt($scope.sr_type_item),
                                                "problem_code": parseInt($scope.p_looup_code),
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
                                        getApi.resolution_code,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "category_id": parseInt($scope.category_id),
                                                "inventory_item_id": parseInt($scope.inventory_item_id),
                                                "sr_type_id": parseInt($scope.sr_type_item),
                                                "problem_code": parseInt($scope.p_looup_code),
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
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    //console.log(angular.fromJson($rootScope.lov_data.radioValue))
                                    $scope.item_number = angular.fromJson($rootScope.lov_data.radioValue).item_number
                                    $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id
                                    $scope.item_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc.replace(/&quot;/, '"');

                                    $scope.category = angular.fromJson($rootScope.lov_data.radioValue).category_desc
                                    $scope.category_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_id
                                    $scope.category_set_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_set_id;

                                    $scope.trackable_flag = angular.fromJson($rootScope.lov_data.radioValue).trackable_flag;
                                    $scope.serial_number_control_code = angular.fromJson($rootScope.lov_data.radioValue).serial_number_control_code;
                                    $scope.lot_control_code = angular.fromJson($rootScope.lov_data.radioValue).lot_control_code;


                                    if($scope.trackable_flag=='N'){
                                        $scope.serial_number_control_code='Y';
                                        $scope.lot_control_code = 'N';
                                        $scope.checkCurchase_date = true;
                                    }else if($scope.trackable_flag=='Y'){
                                        if($scope.lot_control_code == 'N' && $scope.serial_number_control_code=='N'){
                                            $scope.serial_number_control_code='Y';
                                            $scope.lot_control_code = 'N'
                                        }else if($scope.lot_control_code == 'Y' && $scope.serial_number_control_code=='Y'){
                                            $scope.serial_number_control_code='Y';
                                            $scope.lot_control_code = 'N'
                                        }
                                    }else{
                                        $scope.checkCurchase_date = false;
                                    }
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

        //reference Lov
        $scope.referenceLov=function(page){
            status.data(
                function(data){
                    if(data.status=="S"){
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.ref_sr_num = angular.fromJson($rootScope.lov_data.radioValue).sr_number
                                    $scope.reference = angular.fromJson($rootScope.lov_data.radioValue).sr_number
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{"value": "item_number", "name": "Item Number"}, {
                                    "value": "item_desc",
                                    "name": "Item Desc"
                                }];
                                $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//设置option默认值
                                $scope.sr_reference  = true
                                $scope.showPrevNext = true;
                                $scope.title = "Reference List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

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
                                                    /*"sr_number": $scope.sr_number || '',
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
                                                    "end_date": $scope.end_date*/
                                                }
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data
                                            $scope.totalPage = response.pagecount;
                                            $scope.searchFlag = false;
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
                                        getApi.sr_summary,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": 10,
                                                "query_type": $scope.query_type,
                                                "where": $scope.where/*{
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
                                                }*/
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
                        })}})
        }

        //owner Lov
        $scope.ownerLov = function (page) {

            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    //$scope.resource_id = angular.fromJson($rootScope.lov_data.radioValue).resource_id
                                    //$scope.resource_name = angular.fromJson($rootScope.lov_data.radioValue).resource_name

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "resource_category",
                                    "name": "resource_category"
                                }, {"value": "resource_name", "name": "resource_name"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[1].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }

                                $scope.sr_owner = true
                                $scope.showPrevNext = true;
                                $scope.title = "Owner List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    //初始化搜索条件
                                    if ($scope.searchWhere != undefined) {
                                        $scope.obj_name2 = $scope.searchWhere + '%'
                                    }

                                    getDataService.data(
                                        getApi.owner,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "where": {resource_name: $scope.obj_name2}
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
                                        getApi.owner,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
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

        $scope.serial_is = true
        //Serial Lov
        $scope.SerialLov = function (searchName) {
            $scope.obj_select = searchName;
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    //console.log($rootScope.lov_data.radioValue)
                                    $scope.instance_id = angular.fromJson($rootScope.lov_data.radioValue).instance_id
                                    $scope.formData.instance_number = angular.fromJson($rootScope.lov_data.radioValue).instance_number
                                    $scope.CustomerType = angular.fromJson($rootScope.lov_data.radioValue).party_type
                                    $scope.customer_id = angular.fromJson($rootScope.lov_data.radioValue).party_id
                                    $scope.customer_name = angular.fromJson($rootScope.lov_data.radioValue).customer_name
                                    $scope.address = angular.fromJson($rootScope.lov_data.radioValue).address
                                    $scope.email = angular.fromJson($rootScope.lov_data.radioValue).email
                                    $scope.phone = angular.fromJson($rootScope.lov_data.radioValue).phone
                                    $scope.category = angular.fromJson($rootScope.lov_data.radioValue).category_desc
                                    $scope.category_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_id
                                    $scope.category_set_id = angular.fromJson($rootScope.lov_data.radioValue).item_category_set_id
                                    $scope.item_number = angular.fromJson($rootScope.lov_data.radioValue).item_number
                                    $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id
                                    $scope.item_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc
                                    $scope.warranty_start_date = angular.fromJson($rootScope.lov_data.radioValue).warranty_start_date
                                    $scope.warranty_end_dat = angular.fromJson($rootScope.lov_data.radioValue).warranty_end_date
                                    $scope.instance_date = angular.fromJson($rootScope.lov_data.radioValue).instance_date
                                    $scope.formData.serial_number = angular.fromJson($rootScope.lov_data.radioValue).serial_number || ''
                                    $scope.formData.lot_number = angular.fromJson($rootScope.lov_data.radioValue).lot_number || ''
                                    $scope.instance_date = angular.fromJson($rootScope.lov_data.radioValue).instance_date
                                    $scope.contract_id = angular.fromJson($rootScope.lov_data.radioValue).contract_id
                                    $scope.contract_service_id = angular.fromJson($rootScope.lov_data.radioValue).contract_service_id
                                    $scope.account_number = angular.fromJson($rootScope.lov_data.radioValue).account_number
                                    $scope.cust_account_id = angular.fromJson($rootScope.lov_data.radioValue).cust_account_id
                                    if ($scope.formData.serial_number) {
                                    } else {
                                        $scope.serial_is = false
                                    }
                                }
                            },
                            controller: function ($scope, $rootScope) {

                                $scope.searchtype = [{
                                    "value": "install_number", "name": "Instance Number"
                                },{"value": "serial_number", "name": "Serial Number"}];
                                $scope.obj_select = {};

                                if (searchName == "serial_number") {
                                    $scope.obj_select.value = $scope.searchtype[1].value;
                                    $scope.seaTypeValue = $scope.searchtype[0].name;

                                }
                                else {
                                    $scope.obj_select.value = $scope.searchtype[0].value;
                                    $scope.seaTypeValue = $scope.searchtype[0].name;

                                }
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }

                                $scope.is_Serial = true
                                $scope.showPrevNext = true;
                                searchName == "serial_number" ? $scope.title = "Serial Number List" : $scope.title = "Instance Number List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)", cursorwidth: 6});//初始化滚动条


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
                                        getApi.instance,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "customer_id": parseInt($scope.customer_id),
                                                "where": $scope.where,
                                                "item_id": $scope.inventory_item_id
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

        //sr 提交
        $scope.submitForm = function (valid) {

            if( !$scope.sr_type_item ) {
                $("#s2id_sr_type a").css("border-bottom-color","red");
            }
            valid.$dirty = false
            $scope.submitted = true;
            if (valid.$valid) {
                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.sr_create,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        sr_entity: JSON.stringify({
                            "customer_id": parseInt($scope.customer_id),
                            "type_id": parseInt($scope.sr_type_item),
                            "status_id": parseInt($scope.statusSelect),
                            "urgency_id": parseInt($scope.urgency_id),
                            "problem_code": $scope.p_looup_code,
                            "resolution_code": $scope.looup_code,
                            "owner_id": parseInt($scope.resource_id),
                           "group_id": parseInt($scope.group_id),
                            "inventory_item_id": parseInt($scope.inventory_item_id),
                            "category_id": parseInt($scope.category_id),
                            "category_set_id": parseInt($scope.category_set_id),
                            "summary": $scope.summary,
                            "incident_date": $scope.srData.date,
                            "close_date": "",
                            "note": $scope.note,
                            "attachment": $scope.files_obj,
                            "instance_id": parseInt($scope.instance_id),
                            "severity_id": parseInt($scope.severity_id),
                            "contract_id": parseInt($scope.contract_id),
                            "cust_account_id": parseInt($scope.cust_account_id),
                            "contract_service_id": parseInt($scope.contract_service_id),
                            "purchase_date":$scope.formData.purchase_date,
                            "serial_number":$scope.formData.serial_number,
                            "lot_number":$scope.formData.lot_number,
                            "ref_sr_num":$scope.ref_sr_num
                        })
                    },
                    function (response) {
                        if (response.Status == "S") {
                            //更新Recent items
                            menuData.data()
                            $rootScope.lodingbox = false

                            swal({
                                title: response.Message,
                                type: "success"

                            }, function () {
                                window.location.href = "index.html#/sr_update/2/" + $base64.urlsafe_encode(response.sr_id)
                            })
                        }
                        else if (response.Status == "E") {

                            $rootScope.lodingbox = false
                            swal({
                                title: response.Message,
                                type: "error"
                            })

                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'error',
                                type: "error"
                            })


                        }
                    }
                )
            }
            else {
                if ( valid.$error.required[0].$name == "sr_type") {
                    $('html,body').animate({'scrollTop': $("select[name=" + valid.$error.required[0].$name + "]").offset().top - 150}, 500)
                }
                else {
                    $('html,body').animate({'scrollTop': $("input[name=" + valid.$error.required[0].$name + "]").offset().top - 150}, 500)
                }

            }

        };

        $scope.createNewItem = function () {
            $scope.publicTempTitle = 'New Customer';
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "publicTemp-theme",
                            template: "publicTemp/createCustomer_layer.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                                // $scope.phone=$scope.phone2
                                //清空表格
                                $scope.$on('ngDialog.opened', function () {


                                })
                            },
                            controller: function ($scope, $rootScope) {


                            }
                        })
                    }
                })
        }


        //文件上传校验
        $scope.validate = function (file) {

            if ((file.type == 'image/jpeg'||
                file.type == 'image/jpg' ||
                file.type == 'image/png' ||
                file.type == 'image/bmp' ||
                file.type == 'image/gif' ||
                file.type == 'text/plain'||
                file.type == 'application/pdf'
                ) && file.size < 2097152) {
                return true
            }
            else {
                if (file.size > 2097152) {
                    swal({
                        title: "File size can't be more than 2 M",
                        type: 'error'
                    })
                }
                else {
                    swal({
                        title: 'File type error',
                        type: 'error'
                    })
                }
                return false
            }
        }

        $scope.del = function (index) {

            /*Array.prototype.remove=function(dx)
             {
             if(isNaN(dx)||dx>this.length){return false;}
             for(var i=0,n=0;i<this.length;i++)
             {
             if(this[i]!=this[dx])
             {
             this[n++]=this[i]
             }
             }
             this.length-=1
             }*/
            $scope.fileList.splice(index, 1);
            $('.file_item' + index).hide()
        };

        var num = 0;
        $scope.fileList = [];


        $scope.fileSelected = function ($files, $event) {
            if ($event.target.files) {
                num++;
                if (num === 1) {
                    $scope.fileList = $files;
                }
                else {
                    angular.forEach($files, function (files) {
                        $scope.fileList.push(files);
                    });

                }
            }
        };

        $scope.isremove = true;
        $scope.files_obj = [];
        $scope.upload = function (files) {

            if (files && files.length) {
                $rootScope.lodingbox = true
                for (var i = 0; i < files.length; i++) {
                    if (!files[i].is_upload) {
                        var file = files[i];
                        Upload.upload({
                            url: getApi.file_upload + 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid + '?filetype=' + file.type + '&filename=' + file.name + '',
                            fields: {},
                            file: file
                        }).progress(function (evt) {
                            $scope.evt = evt;

                        })
                            .success(function (data, status, headers, config) {
                                if (data.status == "S") {
                                    $scope.item = {
                                        'filename': data.file,
                                        'filetype': data.filetype,
                                        'original_name': data.original_name
                                    };
                                    $scope.files_obj.push($scope.item);

                                    // upoaded

                                    angular.forEach(files, function (file) {
                                        if( !file.is_upolad ) {
                                            file.is_upload = true;
                                        }
                                    });

                                    $scope.progressPercentage = parseInt(100.0 * $scope.evt.loaded / $scope.evt.total) + '%';

                                    swal({
                                        title: data.message,
                                        type: "success"
                                    });
                                    $rootScope.lodingbox = false
                                }
                                if (data.status == "L") {
                                    swal({
                                        title: 'Login timeout, please log in again',
                                        type: 'error'
                                    }, function () {
                                        AuthenticationService.ClearCredentials();
                                        window.location.href = "index.html#/login";
                                    })
                                }
                                if (data.status == "E") {
                                    swal({
                                        title: 'Upload Error',
                                        type: 'error'
                                    }, function () {
                                        return false
                                    })
                                }
                            })
                    }


                }
            }
            else {
                swal({
                    title: 'Please choose a file',
                    type: 'error'
                })

            }

        }
    })
