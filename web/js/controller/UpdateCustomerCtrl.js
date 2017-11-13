/**
 * Created by lingyin on 15/5/26.
 */
IndonesiaApp
    .controller('UpdateCustomerCtrl', function ($scope, globals, $rootScope, $base64, menuData,$stateParams, $http, getDataService, getApi, ngDialog, status, $timeout) {
        //Create Prenferences

        $scope.instance_code = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code;

        $scope.PrenfArr = [];

        $scope.Contact_Method_C = function (value, key) {
            $scope.PrenfArr[key].contact_monthed_code = value;
            if(value=='PHONE'){
                getDataService.data(
                    getApi.get_phone_country_code,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        parameter: JSON.stringify({"country_code": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code})
                    },
                    function (response) {
                        $scope.PrenfArr[key].country_code = response.phone_country_code;
                    }
                );
            }else{
                $scope.PrenfArr[key].country_code=''
            }

        }
        $scope.country_code_C=function(value,key){
            $scope.PrenfArr[key].country_code = value
        }
        $scope.point_value_C=function(value,key){
            $scope.PrenfArr[key].contact_point_value = value;
        }
        $scope.checkbox_C=function(value,key){
            value=true ? $scope.PrenfArr[key].active_flag ='I': $scope.PrenfArr[key].active_flag='A'
        }
        $scope.newItem = function () {
            var item = {
                active_flag: "A",
                contact_monthed_code: "",
                contact_point_value:"",
                contact_point_id: "",
                country_code: "",
                contact_method_disabled:false,
                validEmail:true
            }
            $scope.PrenfArr.push(item);
        }

        //lov清空数据时改变form$dirty
        $('.icon-remove-sign').on('click', function () {
            $scope.updateForm.$dirty = true

        })

        $scope.cmTable = true//判断datatable类型
        $scope.clearDesc = function () {
            $scope.addressCode_desc = ''
        }
        $scope.clearAddr_code = function () {
            $scope.postal_code = ''
        }

        $scope.params = $stateParams

        $scope.cmDetail_F=function() {
            getDataService.data(
                getApi.cmDetail,
                'post',
                {
                    parameter: JSON.stringify({
                        "party_id": parseInt($base64.urlsafe_decode($stateParams.party_id)),
                        "user_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id),
                        "country_code": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code,
                        "resp_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id),
                        "appl_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id),
                        "menu_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.menu_id)
                    })
                }
                ,
                function (response) {
                    $timeout(function () {
                        $scope.updateForm.$dirty = false;
                    }, 0);

                    $scope.cmDetail = response
                    $scope.country_name = response.country_name;
                    $scope.country = response.country;
                    $scope.state = response.state;
                    $scope.province = response.province
                    $scope.district = response.district
                    $scope.addressCode_name = response.postal_code
                    $scope.addressCode_desc = response.postal_desc
                    $scope.postal_code = response.postal_code
                    $scope.phone_country_code = response.phone_country_code
                    $scope.phone_area_code = response.phone_area_code
                    $scope.phone = response.phone
                    $scope.first_name = response.first_name
                    $scope.last_name = response.last_name
                    $scope.party_name = response.party_name
                    $scope.c_name = response.c_name
                    $scope.c_first_name = response.c_first_name
                    $scope.c_last_name = response.c_last_name
                    $scope.c_phone_country_code = response.c_phone_country_code
                    $scope.PrenfArr = $scope.cmDetail.contact_point;
                    if($scope.PrenfArr.length>0){
                        angular.forEach($scope.PrenfArr,function(v,k){
                            v.contact_method_disabled=true;
                            v.validEmail=true;
                        })
                    }
                    $scope.county = response.county;
                    $scope.s_thai = response.state_desc;
                    $scope.city = response.city;
                    $scope.city_desc = response.city_desc;
                    $scope.$watch('province', function (newValue, oldValue) {

                        if (newValue !== oldValue) {
                            $scope.city = ""
                            $scope.district = ""

                        }
                    })
                    $scope.$watch('city', function (newValue, oldValue) {

                        if (newValue !== oldValue) {
                            $scope.district = ""
                        }

                    })

                },
                'N'
            )
        }
        $scope.cmDetail_F()

        $scope.changeFirstName=function(firstname){
            $scope.first_name = firstname
        }

        $scope.changeLastName=function(lastname){
            $scope.last_name = lastname
        }

        $scope.changeName=function(name){
            $scope.party_name=name;
        }

        //邮箱验证
        var reg = /^[.a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-]+(.[a-zA-Z0-9_\-]+){0,}$/
        $scope.changeEmail=function(value,code,index){
            $scope.PrenfArr[index].contact_point_value = value;
            if(code=='EMAIL'){
                $scope.PrenfArr[index].validEmail = reg.test(value)
            }
        }

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
                                    $scope.country = angular.fromJson($rootScope.lov_data.radioValue).country_code
                                    $scope.country_name = angular.fromJson($rootScope.lov_data.radioValue).country_name
                                    $timeout(function () {
                                        $scope.updateForm.$dirty = true;
                                    }, 0);
                                    $scope.$watch('countryName', function () {
                                        $scope.cmDetail.state = ''
                                        $scope.cmDetail.state_name = ''
                                    })

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.showPrevNext = true;
                                $scope.title = "Country List"
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
                                                //"obj_code": $scope.obj_select,
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
                                                "obj_code": $scope.obj_select,
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
        //初始化国家
        $scope.country = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code
        $scope.c_name2 = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country

        //字段显示与必填控制
        getDataService.data(
            getApi.get_address_style,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                parameter:JSON.stringify({"country_code": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code})
            },
            function (response) {
                $scope.addressInfo = response;
            }
        );

        //province lov
        $scope.province_lov = function (page) {
            if ( $scope.country_name ) {
                switch ($scope.country_name) {
                    case 'Indonesia': $scope.address_province = 'MPI_PROVINCE';
                        break;
                    case 'South Africa': $scope.address_province = 'CUX_MZA_PROVINCE';// (iservicetest)CUX_CS_ZA_PROVINCE
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
                                        $scope.updateForm.$dirty = true;
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
                                                "address_type": $scope.address_province,
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
                    case 'Indonesia': $scope.cityParams = 'MPI_CITY';
                        break;
                    case 'South Africa': $scope.cityParams = 'CUX_MZA_CITY';//CUX_CS_ZA_DISTRICT
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
                                    $scope.lov_data= JSON.parse($scope.lov_data.radioValue);
                                    $scope.city = $scope.lov_data.obj_name;
                                    $scope.city_desc = $scope.lov_data.obj_desc;
                                    $scope.cmDetail.postal_code=$scope.lov_data.postal_code;
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

                                if ( $scope.country_name == 'Thailand') {
                                    $scope.cityType = 1;
                                    $scope.searchtype = [{"value": "obj_code", "name": "English"}, {
                                        "value": "obj_name",
                                        "name": "Thai"
                                    }];
                                }
                                else if ($scope.country_name == 'Indonesia') {
                                    $scope.cityType = 2;
                                    $scope.searchtype = [{"value": "name", "name": "Name"}];
                                }

                                else if ($scope.country_name == 'South Africa') {
                                    $scope.cityType = 3;
                                    $scope.searchtype = [{"value": "obj_code", "name": "Name"}, {
                                        "value": "obj_name",
                                        "name": "Description"
                                    }];
                                }
                                $scope.obj_select= {};
                                $scope.obj_select.value=$scope.searchtype[0].value;
                                $scope.seaTypeValue=$scope.searchtype[0].name;

                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
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
                                                "state":$scope.state,
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
                                                "state":$scope.state,
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
                                    $scope.district = angular.fromJson($rootScope.lov_data.radioValue).obj_name
                                    $scope.postal_code = angular.fromJson($rootScope.lov_data.radioValue).postal_code
                                    $timeout(function () {
                                        $scope.updateForm.$dirty = true;
                                    }, 0);
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
                                                "city": $scope.cmDetail.city,
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
                            template: "dialog/datatable.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                                if (value == "2") {
                                    var lov_data = angular.fromJson( $scope.lov_data.radioValue);
                                    if ( $scope.state != lov_data.obj_code){
                                        $scope.state = lov_data.obj_code;
                                        $scope.s_thai = lov_data.obj_name;

                                        $scope.city = "";
                                        $scope.city_desc = "";
                                    }

                                    $timeout(function () {
                                        $scope.updateForm.$dirty = true;
                                    }, 0);

                                }

                            },
                            controller: function ($scope, $rootScope) {
                                if($scope.instance_code=='MAC'){
                                    $scope.state_table = true;
                                    $scope.searchtype = [{"value": "obj_code", "name": "State"},{"value": "obj_name", "name": "Description"}];
                                }else{
                                    $scope.searchtype = [{"value": "obj_code", "name": "English"},{"value": "obj_name", "name": "Thai"}];
                                }

                                $scope.showPrevNext = true;
                                $scope.title = "State List"

                                $scope.obj_select= {};
                                $scope.obj_select.value=$scope.searchtype[0].value;
                                $scope.seaTypeValue=$scope.searchtype[0].name;
                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
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
                                                "where":  $scope.where
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
        //address code lov
        $scope.addressCode = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/customer_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.addressCode_name = angular.fromJson($rootScope.lov_data.radioValue).addressCode_name
                                    $scope.addressCode_desc = angular.fromJson($rootScope.lov_data.radioValue).addressCode_desc
                                    $timeout(function () {
                                        $scope.updateForm.$dirty = true;
                                    }, 0);

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.showPrevNext = true;
                                $scope.address_code = true;
                                $scope.title = "addressCode List"
                                $scope.searchtype = [{
                                    "value": "name", "name": "Name"
                                }, {"value": "desc", "name": "Description"}];
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
                                        getApi.address_code,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "province": $scope.province,
                                                "city": $scope.cmDetail.city,
                                                "district": $scope.district,
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

                                //当前页数据
                                $scope.DoCtrlPagingAct = function (page) {
                                    if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }

                                    getDataService.data(
                                        getApi.address_code,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "province": $scope.province,
                                                "city": $scope.city,
                                                "district": $scope.district,
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



        //update
        $scope.submitForm = function (valid) {

            if($scope.PrenfArr.length>0){
                for(var i=0;$scope.PrenfArr.length>i;i++){
                    if(!$scope.PrenfArr[i].validEmail){
                        return false
                    }
                }
            }

            valid.$dirty = false
            $scope.submitted = true
            if (valid.$valid) {
                for(var i=0;$scope.PrenfArr.length>i;i++){
                 delete($scope.PrenfArr[i].contact_monthed_desc);
                    delete($scope.PrenfArr[i].$$hashKey);
                    if($scope.instance_code=='MPI'){
                        if($scope.PrenfArr[i].contact_monthed_code=='PHONE'){
                            if($scope.PrenfArr[i].contact_point_value.length<7){
                                swal({
                                    title:  "Phone number must be greater than 6 digits.",
                                    type: "error"
                                })
                                return false;
                            }
                        }
                    }

                 }
                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.cmUpdate,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        'cust_entity': JSON.stringify({
                            customer_type: $scope.cmDetail.customer_type,
                            party_id: parseInt($scope.cmDetail.party_id),
                            party_name: $scope.cmDetail.party_name,
                            phone_country_code: $scope.phone_country_code,
                            phone_area_code: $scope.phone_area_code,
                            phone: $scope.cmDetail.phone,
                            email: $scope.cmDetail.email,
                            c_type: $scope.cmDetail.c_type,
                            c_party_id: parseInt($scope.cmDetail.c_party_id),
                            org_name: $scope.party_name,
                            first_name: $scope.first_name,
                            last_name: $scope.last_name,
                            c_first_name: $scope.c_first_name,
                            c_last_name: $scope.c_last_name,
                            c_email: $scope.cmDetail.c_email,
                            c_phone_country_code: $scope.c_phone_country_code,
                            c_phone_area_code: $scope.c_phone_country_code,
                            c_phone: $scope.cmDetail.c_phone,
                            location_id: parseInt($scope.cmDetail.location_id),
                            country: $scope.country,
                            state: $scope.state,
                            state_desc:$scope.s_thai,
                            address: $scope.cmDetail.address,
                            postal_code: $scope.cmDetail.postal_code,
                            city: $scope.city,
                            city_desc: $scope.city_desc,
                            province: $scope.province,
                            district: $scope.district,
                            contact_point:$scope.PrenfArr,
                            county:$scope.county
                        })
                    },
                    function (response) {
                        //更新Recent items
                        menuData.data()
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'Update successfully',
                                type: "success"

                            },function(){
                                location.reload()
                                $scope.cmDetail_F()
                            })


                        } else if (response.Status == "E") {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'Failed to update',
                                type: "error"

                            })

                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'Failed to update',
                                type: "error"

                            })


                        }
                    }
                )
            }

        }

    })