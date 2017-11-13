/**
 * Created by lingyin on 15/5/25.
 */
IndonesiaApp
    .controller('CreateCustomerCtrl', function ($http, $scope, $rootScope, menuData, globals, getApi, $base64, getDataService, ngDialog, $location, status, $timeout) {

        $scope.org_name = ''
        $scope.first_name = ''
        $scope.last_name = ''

        $scope.cmTable = true//判断datatable类型
        $scope.c_type = 'EMPLOYEE_OF';
        $scope.customer_type = 'PERSON';
        $scope.ORGANIZATION = false;
        $scope.PERSON = false
        $scope.obj_name = ""
        //$scope.phone_country_code = "62"
        $scope.phone_area_code = ""
        $scope.phone = ""
        $scope.email = ""
        $scope.c_type = ""
        $scope.c_name = ""
        $scope.c_email = ""
        //$scope.c_phone_country_code = "62"
        $scope.c_phone_area_code = ""
        $scope.c_phone = ""
        $scope.country = ""
        $scope.address = ""
        $scope.postal_code = ""
        $scope.city = ""
        $scope.state = ""
        $scope.country_name = ""
        $scope.province = ""
        $scope.city = ""
        $scope.district = ""

        $scope.profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

        $scope.instance_code =$scope.profile.instance_code;

        $scope.clearAddr_code = function () {
            $scope.postal_code = ''
        }
        $scope.clearDesc = function () {
            $scope.addressCode_desc = ''
        };
        $scope.c_value = function () {
            $scope.country = ''
        };

        $scope.changeAddress = function(address){
            $scope.address=address;
        }

        //phone_country_code
        getDataService.data(
            getApi.get_phone_country_code,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                parameter: JSON.stringify({"country_code": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code})
            },
            function (response) {
                $scope.phone_country_code = response.phone_country_code;
            }
        );

        //初始化国家
        getDataService.data(
            getApi.get_country,
            'post',
            {profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)},
            function (response) {
                $scope.countrys = response.data;
                $scope.country = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code;
                $scope.country_name = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code

            }
        );


        //----------------------------------------------------------------
        //country change
        $scope.countrychange = function (country_name) {
            $scope.country = country_name;
            //console.log(country_name);
            $scope.phone_country_code = null;
            getDataService.data(
                getApi.get_phone_country_code,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    parameter: JSON.stringify({"country_code": country_name})
                },
                function (response) {
                    $scope.phone_country_code = response.phone_country_code;
                }
            );

            //get address field
            $scope.getAddressField();
        };

        //----------------------------------------------------------------
        //字段显示与必填控制
        $scope.getAddressField = function () {
            $scope.addressInfo = {};
            $scope.submitted = false;

            getDataService.data(
                getApi.get_address_style,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    parameter: JSON.stringify({"country_code": $scope.country || JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code})
                },
                function (res) {
                    $scope.addressInfo = res;
                }
            );
        }
        $scope.getAddressField();

        //country
        $scope.countryData = function () {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/datatable.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.country = angular.fromJson($rootScope.lov_data.radioValue).country_code;
                                    $scope.country_name = angular.fromJson($rootScope.lov_data.radioValue).country_name;
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.showPrevNext = true;
                                $scope.title = "Country List";
                                $scope.searchtype = [{
                                    "obj_code": "geography_code",
                                    "obj_name": "Country Code"
                                }, {"obj_code": "geography_name", "obj_name": "Country Name"}];

                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].obj_code;
                                $scope.seaTypeValue = $scope.searchtype[0].obj_name;
                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }


                                //设置option默认值
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条
                                    getDataService.data(
                                        getApi.cmLov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": $scope.currentPage,
                                                "page_size": $scope.pageSize,
                                                "obj_name": $scope.obj_name2,
                                                "geography_type": 'COUNTRY',
                                                "country": ''
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                })
                                //当前页数据
                                $scope.DoCtrlPagingAct = function (page) {
                                    getDataService.data(
                                        getApi.cmLov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "obj_code": $scope.obj_select.value,
                                                "obj_name": $scope.obj_name2,
                                                "geography_type": 'COUNTRY',
                                                "country": ''
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


        $scope.removeProvince = function(){
            $scope.province='';
            $scope.city_desc='';
            $scope.city=''
        }

        //province lov
        $scope.province_lov = function (page) {

            if ( $scope.country_name ) {
                switch ($scope.country_name) {
                    case 'ID': $scope.address_province = 'MPI_PROVINCE';
                        break;
                    case 'ZA': $scope.address_province = 'CUX_MZA_PROVINCE';// (iservicetest)CUX_CS_ZA_PROVINCE
                        break;
                    case 'VN': $scope.address_province = 'CUX_CS_VN_PROVINCE';
                        break;

                }

            }
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                                if (value == "2") {
                                    var lov_data = angular.fromJson($scope.lov_data.radioValue);
                                    if ($scope.province != lov_data.obj_name) {

                                        $scope.province = lov_data.obj_name;
                                        $scope.city = null;
                                        $scope.city_desc = null
                                    }

                                    $timeout(function () {
                                        $scope.addcustform.$dirty = true;
                                    }, 0);

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.province_table = true
                                $scope.showPrevNext = true;
                                $scope.title = "Province List"
                                $scope.searchtype = [{"value": "name", "name": "Name"}];
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
                                $scope.$on('ngDialog.opened', function () {
                                    $scope.obj_select = "name"
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.address_lov,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.address_province,
                                                "country": $scope.country,
                                                "province": "",
                                                "city": "",
                                                "where": {"name": $scope.obj_name2}
                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                });

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
                                        getApi.address_lov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.address_province,
                                                "country": $scope.country,
                                                "province": "",
                                                "city": "",
                                                "where": {"name": $scope.obj_name2}
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
        $scope.city_lov = function (page) {

            if ( $scope.country_name ) {
                switch ($scope.country_name) {
                    case 'ID': $scope.cityParams = 'MPI_CITY';
                        break;
                    case 'ZA': $scope.cityParams = 'CUX_MZA_CITY';//CUX_CS_ZA_DISTRICT
                        break;
                    case 'VN': $scope.cityParams = 'CUX_CS_VN_CITY';//CUX_CS_ZA_DISTRICT
                        break;
                }

            }
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    // $scope.city = angular.fromJson($rootScope.lov_data.radioValue).obj_name;
                                    $scope.lov_data = JSON.parse($scope.lov_data.radioValue);
                                    $scope.city = $scope.lov_data.obj_name;
                                    $scope.city_desc = $scope.lov_data.obj_desc;console.log($scope.city_desc)
                                    $scope.postal_code = $scope.lov_data.postal_code;
                                    $timeout(function () {
                                        $scope.addcustform.$dirty = true;
                                    }, 0);
                                }
                            },
                            controller: function ($scope, $rootScope) {

                                $scope.obj_select = "name"
                                $scope.city_table = true
                                $scope.showPrevNext = true;
                                if($scope.instance_code=='MSA'||$scope.instance_code=='MZA'){
                                    $scope.title = "district List";
                                }else{
                                    $scope.title = "City List";
                                }


                                //$scope.city isShow table tpl;

                                if ( $scope.country_name == 'TH') {
                                    $scope.cityType = 1; //
                                    $scope.searchtype = [{"value": "obj_code", "name": "English"}, {
                                        "value": "obj_name",
                                        "name": "Thai"
                                    }];
                                }
                                else if ($scope.country_name == 'ID') {
                                    $scope.cityType = 2; //
                                    $scope.searchtype = [{"value": "name", "name": "Name"}];
                                }
                                else if ($scope.country_name == 'ZA') {
                                    $scope.cityType = 3; //
                                    $scope.searchtype = [{"value": "obj_code", "name": "Name"}, {
                                        "value": "obj_name",
                                        "name": "Description"
                                    }];
                                }else if ($scope.country_name == 'VN') {
                                    $scope.cityType = 2; //
                                    $scope.searchtype = [{"value": "name", "name": "Name"}];
                                }


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
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.address_lov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.cityParams,
                                                "country": $scope.country,
                                                "province": $scope.province,
                                                "state": $scope.state,
                                                "city": ""
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
                                        getApi.address_lov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.cityParams,
                                                "country": $scope.country,
                                                "province": $scope.province,
                                                "state": $scope.state,
                                                "city": "",
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
        $scope.district_lov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    // $scope.district = angular.fromJson($rootScope.lov_data.radioValue).obj_name
                                    //  $scope.postal_code=angular.fromJson($rootScope.lov_data.radioValue).postal_code
                                    $scope.lov_data = JSON.parse($scope.lov_data.radioValue);
                                    $scope.district = $scope.lov_data.obj_name;
                                    $scope.postal_code = $scope.lov_data.postal_code;
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.obj_select = "name"
                                $scope.district_table = true
                                $scope.showPrevNext = true;
                                $scope.title = "District List"
                                $scope.searchtype = [{"value": "name", "name": "Name"}];
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
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条
                                    getDataService.data(
                                        getApi.address_lov,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": "MPI District List",
                                                "province": $scope.province,
                                                "city": $scope.city,
                                                "where": {"name": $scope.obj_name2}
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
                                        getApi.address_lov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": "MPI District List",
                                                "province": "",
                                                "city": "",
                                                "where": {"name": $scope.obj_name2}
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
        $scope.stateData = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    var lov_data = angular.fromJson($scope.lov_data.radioValue);
                                    if ($scope.state != lov_data.obj_code) {
                                        $scope.state = lov_data.obj_code;
                                        $scope.s_name2 = lov_data.obj_name;
                                        if($scope.instance_code=='MAC'){

                                        }else{
                                            $scope.city = "";
                                            $scope.city_desc = "";
                                        }

                                    }

                                    $timeout(function () {
                                        $scope.addcustform.$dirty = true;
                                    }, 0);

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                if($scope.instance_code=='MAC'){
                                    $scope.state_table_mac=true;
                                    $scope.searchtype = [{"value": "obj_code", "name": "State"}, {
                                        "value": "obj_name",
                                        "name": "Description"
                                    }];
                                }else{
                                    $scope.state_table = true;
                                    $scope.searchtype = [{"value": "obj_code", "name": "English"}, {
                                        "value": "obj_name",
                                        "name": "Thai"
                                    }];
                                }

                                $scope.showPrevNext = true;
                                $scope.title = "State List"

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
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.cmLov,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": $scope.currentPage,
                                                "page_size": $scope.pageSize,
                                                "geography_type": 'STATE',
                                                "country": $scope.country,
                                                "where": $scope.where
                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                });

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
                                        getApi.cmLov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,

                                                "geography_type": 'STATE',
                                                "country": $scope.country,
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
        $scope.region_lov = function (page) {

            if ( $scope.country_name ) {
                switch ($scope.country_name) {
                    case 'VN': $scope.address_region = 'CUX_CS_VN_REGION';
                        break;
                }

            }
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                                if (value == "2") {
                                    var lov_data = angular.fromJson($scope.lov_data.radioValue);
                                    if ($scope.Region != lov_data.obj_name) {

                                        $scope.Region = lov_data.obj_name;
                    
                                    }

                                    $timeout(function () {
                                        $scope.addcustform.$dirty = true;
                                    }, 0);

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.region_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Region List"
                                $scope.searchtype = [{"value": "name", "name": "Name"}];
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
                                $scope.$on('ngDialog.opened', function () {
                                    $scope.obj_select = "name"
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.address_lov,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.address_region,
                                                "country": $scope.country,
                                                "province": "",
                                                "city": "",
                                                "where": {"name": $scope.obj_name2}
                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                });

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
                                        getApi.address_lov,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "address_type": $scope.address_region,
                                                "country": $scope.country,
                                                "province": "",
                                                "city": "",
                                                "where": {"name": $scope.obj_name2}
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
        $scope.submitForm = function (valid, publicTemp) {

            valid.$dirty = false
            $scope.submitted = true;
            if (valid.$valid) {
                if($scope.instance_code=='MPI'){
                    if($scope.phone.length<7){
                        swal({
                            title:  "Phone number must be greater than 6 digits.",
                            type: "error"
                        })
                        return false;
                    }
                }
                $rootScope.lodingbox = true;
                getDataService.data(
                    getApi.verfiy_customer,
                    'post', {
                        parameter: JSON.stringify({
                            party_type: $scope.customer_type,
                            org_name: $scope.org_name,
                            first_name: $scope.first_name,
                            last_name: $scope.last_name,
                            phone_number: $scope.phone,
                            phone_country_code: $scope.phone_country_code
                        })
                    },
                    function (response) {

                        if (response.flag == "Y") {
                            $rootScope.lodingbox = false;
                            swal({
                                title: 'Customer ' + '"' + $scope.org_name + $scope.first_name + ' ' + $scope.last_name + '"'+ ' with the same phone number has already existed. Do you want to continue?',
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonText:"Continue"
                            }, function () {
                                $scope.sumitdata(publicTemp);
                            })
                        }
                        else {
                            $scope.sumitdata(publicTemp);
                        }

                    });
            }
        }


        $scope.sumitdata = function(publicTemp){
            getDataService.data(
                getApi.createCustomer,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    cust_entity: JSON.stringify({
                        customer_type: $scope.customer_type,
                        org_name: $scope.org_name,
                        first_name: $scope.first_name,
                        last_name: $scope.last_name,
                        c_first_name: $scope.c_first_name,
                        c_last_name: $scope.c_last_name,
                        phone_country_code: $scope.phone_country_code,
                        phone_area_code: $scope.phone_area_code,
                        phone: $scope.phone,
                        email: $scope.email,
                        c_type: $scope.c_type,
                        c_name: $scope.c_name,
                        c_email: $scope.c_email,
                        c_phone_country_code: $scope.c_phone_country_code,
                        c_phone_area_code: $scope.c_phone_area_code,
                        c_phone: $scope.c_phone,
                        country: $scope.country,
                        state: $scope.state,
                        state_desc: $scope.s_name2,
                        address: $scope.address,
                        postal_code: $scope.postal_code,
                        city: $scope.city,
                        city_desc: $scope.city_desc,
                        province: $scope.province,
                        district: $scope.district,
                        county:$scope.county

                    })
                },
                function (response) {
                    if (response.Status == "S") {
                        //更新Recent items
                        menuData.data()
                        $rootScope.lodingbox = false;
                        $scope.customer_id = response.customer_id;
                        swal({
                            title: response.Message,
                            type: "success"
                        }, function () {
                            //publicTemp新建方式，处理数据并渲染
                            if (publicTemp) {
                                $scope.toParentData = {
                                    'customer_type': $scope.customer_type,
                                    'obj_name': $scope.obj_name,
                                    'email': $scope.email,
                                    'phone': $scope.phone,
                                    'address': $scope.address,
                                    'country_name': $scope.country_name,
                                    'province': $scope.province,
                                    'city': $scope.city,
                                    'district': $scope.district,
                                    'postal_code': '',
                                    'customer_id': $scope.customer_id,
                                    'cust_account_id': response.cust_account_id,
                                    'account_number': response.account_number

                                };
                                $scope.toParentDataStr = JSON.stringify($scope.toParentData);
                                $scope.$emit('to-parent', $scope.toParentDataStr);
                                ngDialog.closeAll();

                                return;
                            }
                            window.location.href = "index.html#/F_ID_CUST_SUMMARY"
                        });
                    }
                    else if (response.Status == "E") {
                        $rootScope.lodingbox = false;
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }
                    else {
                        $rootScope.lodingbox = false;
                        swal({
                            title: 'error',
                            type: "error"
                        })
                    }
                }
            )
        }
    });

