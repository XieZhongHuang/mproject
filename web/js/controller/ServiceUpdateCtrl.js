/**
 * Created by lingyin on 15/6/4.
 */
IndonesiaApp

    .controller('ServiceUpdateCtrl', function ($scope,$base64, $rootScope,$http,$location,$route,$state, $timeout,Upload,menuData,$stateParams, getDataService, getApi, ngDialog,status,AuthenticationService) {
        $scope.formData = {};


        $scope.instance_code=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code;

        //打印
        $scope.printurl = getApi.htmltopdfservlet;

        $scope.sr_select_fun=function(item) {
            var arr = _.filter($scope.srData.sr_type, function (num) {
                return num.type_id == item
            });
           try{$scope.sr_select_arr=arr[0].ib_require_flag}catch(e){}
        }

        $scope.instance_n_fun=function(value){
            if(value!=='') {
                $scope.instance_number_tips=true
            }
        }
        $scope.serial_n_fun=function(value){
            if(value!==''){
                $scope.serial_number_tips=true
            }
        }
        $scope.lot_n_fun=function(value){
            if(value!==''){
                $scope.lot_number_tips=true
            }
        }
        $scope.serial_fun_false=function(){ $scope.serial_number_tips=false}
        $scope.lot_fun_false=function(){ $scope.lot_number_tips=false}
        //页面初始化滚动
        $('.icon-remove-sign').on('click',function(){
            $scope.sr_form.$dirty=true

        })

        $(".upload-list").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化上传附件滚动条
        if($stateParams.scrollFlag=='1'){
            var scrollPlace=$('#scrollPlace').offset().top;

            $('html,body').animate({'scrollTop' : scrollPlace+'px'},100);
        }
        //监听Customer变化 清空客户信息
        $scope.customer_c=function(){
            $scope.account_number = ''
            $scope.email = ''
            $scope.address = ''
            $scope.phone = ''
        }
        $scope.Item_c=function(){
            $scope.category=''
            $scope.item_desc=''
            $scope.category_id=''
            $scope.category_set_id=''
            $scope.p_desc=''
            $scope.p_looup_code=''
            $scope.meaning=''
            $scope.looup_code=''


        }
        $scope.sr_id=$base64.urlsafe_decode($stateParams.sr_id)
        $scope.c_timezone= JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.c_timezone
        $scope.s_timezone= JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.s_timezone
        $scope.resp_id = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id
        $scope.dowUrl=getApi.file_down
        $scope.jsessionid= 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid
        $scope.CustomerType = 'PERSON'
        $scope.SUBMITTED=true
        $scope.IN_ERROR=true

        //CustomerTypeChange
        $scope.CustomerTypeChange=function(){
            //个人，组织切换时清空数据
            $scope.customer_name='';
            $scope.address='';
            $scope.email='';
            $scope.phone='';
            $scope.customer_id='';
        }

        $scope.removeInstallNumber = function(){
            $scope.inventory_item_id = '';
            $scope.instance_number = '';
            $scope.serial_number = '';
            $scope.lot_number='';
            $scope.formData.instance_number = '';
            $scope.formData.serial_number = '';
            $scope.formData.lot_number='';
            $scope.warranty_start_date = ''
            $scope.warranty_end_date =''
            $scope.instance_date =''
            $scope.instance_id='';
            $scope.contract_id='';
            $scope.contract_service_id='';
            $scope.item_desc='';
            $scope.category =''
            $scope.category_id=''
            $scope.item_number='';

        }

        $scope.removeItemRelative=function(){
            $scope.inventory_item_id = '';
            $scope.formData.instance_number = '';
            $scope.formData.serial_number = '';
            $scope.formData.lot_number='';
            $scope.instance_number = '';
            $scope.serial_number = '';
            $scope.lot_number='';
            $scope.warranty_start_date = ''
            $scope.warranty_end_date =''
            $scope.instance_date =''
        }


        getDataService.data(
            getApi.get_sr_initial,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            }
            , function (data) {

                $scope.srData = data
                $scope.sr_type_item = data.sr_type[0].type_id
                $scope.sr_type_name = data.sr_type[0].type_name
                $scope.urgency_id = data.urgency[0].urgency_id

                //
                //getDataService.data(
                //    getApi.get_sr_init_status,
                //    'post',
                //    {
                //        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                //        sr_type_id: $scope.sr_type_item
                //
                //
                //    }
                //    , function (resp) {
                //        $scope.status = resp.data;
                //
                //        if ( resp.data ) {
                //            $scope.statusSelect = resp.data[0].status_id;
                //        }



                        //初始化srinfo
                        getDataService.data(
                            getApi.sr_detail,
                            'post',
                            {
                                parameter: JSON.stringify({
                                    "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                                    "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                    "s_timezone": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.s_timezone,
                                    "c_timezone": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.c_timezone,
                                    "asp_resource_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.asp_resource_id),
                                    "resp_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id),
                                    "appl_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id),
                                    "menu_id":parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.menu_id)
                                })
                            }
                            ,
                            function (response) {
                                if(response.sr_info.trackable_flag == 'Y'){
                                    $scope.checkCurchase_date = false;
                                }else{
                                    $scope.checkCurchase_date = true;
                                }
                                $timeout(function () {
                                    $scope.sr_form.$dirty = false;
                                }, 0);


                                //监听Category model
                                $scope.$watch('category_id', function (newValue, oldValue) {

                                    if (newValue!== oldValue) {
                                        $scope.p_looup_code = ''
                                        $scope.p_desc = ''
                                        $scope.looup_code = ''
                                        $scope.meaning = ''
                                    }

                                })
                                //监听Item model
                                $scope.$watch('inventory_item_id', function (newValue, oldValue) {

                                    if (newValue!== oldValue) {
                                        $scope.p_looup_code = ''
                                        $scope.p_desc = ''
                                        $scope.looup_code = ''
                                        $scope.meaning = ''
                                    }
                                })
                                //初始化SR
                                $scope.sr_info = response.sr_info;
                                $scope.qadata=$scope.sr_info.qa;
                                $scope.sr_type_item = $scope.sr_info.incident_type_id
                                $scope.incident_status_id = $scope.sr_info.incident_status_id
                                $scope.init_status_id = $scope.sr_info.incident_status_id
                                $scope.status_name = $scope.sr_info.incident_status_name

                                $scope.formData.purchase_date = $scope.sr_info.purchase_date

                                $scope.sr_type($scope.sr_info.incident_type_id)

                                $scope.trackable_flag = $scope.sr_info.trackable_flag;
                                $scope.serial_number_control_code = $scope.sr_info.serial_number_control_code;
                                $scope.lot_control_code = $scope.sr_info.lot_control_code;

                                if($scope.trackable_flag=='N'){
                                    $scope.serial_number_control_code='Y';
                                    $scope.lot_control_code = 'N';
                                }else if($scope.trackable_flag=='Y'){
                                    if($scope.lot_control_code == 'N' && $scope.serial_number_control_code=='N'){
                                        $scope.serial_number_control_code='Y';
                                        $scope.lot_control_code = 'N'
                                    }else if($scope.lot_control_code == 'Y' && $scope.serial_number_control_code=='Y'){
                                        $scope.serial_number_control_code='Y';
                                        $scope.lot_control_code = 'N'
                                    }
                                }

                                $scope.group_name=$scope.sr_info.group_name;
                                $scope.group_id=$scope.sr_info.group_id;

                                $scope.urgency_id = $scope.sr_info.incident_urgency_id

                                $scope.resource_name = $scope.sr_info.resource_name
                                $scope.ups_tracking_number = $scope.sr_info.ups_tracking_number
                                $scope.resource_id = $scope.sr_info.incident_owner_id
                                $scope.close_date = $scope.sr_info.close_date

                                $scope.CustomerType = $scope.sr_info.customer_type
                                $scope.customer_name = $scope.sr_info.customer_name
                                $scope.customer_id = $scope.sr_info.customer_id
                                $scope.phone = $scope.sr_info.customer_phone
                                $scope.address = $scope.sr_info.customer_address
                                $scope.email = $scope.sr_info.customer_email
                                $scope.category = $scope.sr_info.category_name || ''
                                $scope.category_id = $scope.sr_info.category_id || ''

                                $scope.item_number = $scope.sr_info.item
                                $scope.inventory_item_id = $scope.sr_info.inventory_item_id
                                $scope.item_desc = $scope.sr_info.item_desc
                                $scope.summary = $scope.sr_info.summary
                                $scope.note = $scope.sr_info.note
                                $scope.p_desc = $scope.sr_info.problem_desc
                                $scope.p_looup_code = $scope.sr_info.problem_code
                                $scope.meaning = $scope.sr_info.resolution_desc
                                $scope.looup_code = $scope.sr_info.resolution_code
                                $scope.category_set_id=$scope.sr_info.category_set_id || ''
                                $scope.instance_id=$scope.sr_info.instance_id
                                $scope.instance_number=$scope.sr_info.instance_number || ''
                                $scope.warranty_start_date=$scope.sr_info.warranty_start_date
                                $scope.warranty_end_date=$scope.sr_info.warranty_end_date
                                $scope.formData.serial_number=$scope.sr_info.serial_number || ''
                                $scope.instance_date=$scope.sr_info.instance_date
                                $scope.severity_id=$scope.sr_info.severity_id
                                $scope.account_number=$scope.sr_info.account_number
                                $scope.cust_account_id=$scope.sr_info.cust_account_id
                                $scope.incident_date=$scope.sr_info.incident_date
                                $scope.formData.lot_number=$scope.sr_info.lot_number || ''
                                $scope.sr_select_fun($scope.sr_type_item)

                                if($scope.instance_number){
                                    $scope.srTrueFalse1=true
                                }else{
                                    $scope.srTrueFalse2=true
                                }
                                if($scope.formData.lot_number){
                                    $scope.serial_is=false
                                }


                                $(".qatableScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)",cursorwidth:6});//初始化滚动条,autohidemode:'hidden'

                                var $nicescroll = $('.nicescroll-rails');
                                for(var i = 0;i<$nicescroll.length-1;i++){
                                    $nicescroll.eq(i).css({display:'none'})
                                }


                                //statusLov
                                $scope.statusLov = function () {
                                    status.data(
                                        function(data){
                                            if(data.status=="S") {
                                                ngDialog.open({
                                                        className: "datatable-theme",
                                                        template: "dialog/sr_lov.html",
                                                        name:'status',
                                                        setOpenOnePerName:true,
                                                        scope: $scope,
                                                        preCloseCallback: function (value) {
                                                            if (value == "2") {
                                                                $scope.status_name = angular.fromJson($rootScope.lov_data.radioValue).status_name
                                                                $scope.incident_status_id = angular.fromJson($rootScope.lov_data.radioValue).status_id
                                                                $timeout(function () {
                                                                    $scope.sr_form.$dirty = true;
                                                                }, 0);
                                                            }
                                                        },
                                                        controller: function ($scope, $rootScope) {
                                                            $scope.title = "Status List"
                                                            $scope.is_status = true
                                                            $scope.totalPage = 1;
                                                            $rootScope.lov_data = {};
                                                            $scope.$on('ngDialog.opened', function () {
                                                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)",cursorwidth:6});//初始化滚动条

                                                                getDataService.data(
                                                                    getApi.sr_status,
                                                                    'post',
                                                                    {
                                                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                                        'parameter': JSON.stringify({
                                                                            "page_index": 1,
                                                                            "page_size": $scope.pageSize,
                                                                            "sr_type_id": $scope.sr_type_item,
                                                                            "sr_status_id": $scope.init_status_id,
                                                                            "lang": $rootScope.InitalData.profile.language
                                                                        })
                                                                    },

                                                                    function (response) {
                                                                        $scope.data = response.data;
                                                                    }
                                                                )
                                                            })


                                                        }
                                                    })

                                            }})
                                }
                                //task summary
                                $scope.tastSummary=response.sr_info.task
                               // $scope.chargeSummary=response.sr_info.charge


                            },
                            'N'
                        )
                    }
                   /* 'N'
                )
            },
            'N'*/

        )
        //charge summarry
        getDataService.data(
            getApi.charge_summary,
            'post',
            {

                'parameter': JSON.stringify({
                    "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                    "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                    "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                    "organization_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                    "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language
                })
            },

            function (response) {
                $scope.chargeSummary=response.charge
                localStorage.setItem('chargeSummary',JSON.stringify($scope.chargeSummary))
            },
            'N'
        )

        //submit_order
        $scope.charge_submit_order=function(){
            $scope.charge_loading=true
            getDataService.data(
                getApi.charge_submit_order,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "incident_id":parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                        "customer_id":parseInt($scope.customer_id),
                        "cust_account_id":parseInt($scope.cust_account_id)
                    })
                },
                function(data){
                    getDataService.data(
                        getApi.charge_summary,
                        'post',
                        {

                            'parameter': JSON.stringify({

                                "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                                "organization_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language
                            })
                        },

                        function (response) {
                            $scope.chargeSummary=response.charge


                        })
                    if(data.Status=='S'){
                        $scope.charge_loading=false
                        swal({
                            title: data.Message,
                            type: 'success'
                        })

                    }
                    else if(data.Status=='E'){
                        $scope.charge_loading=false
                        swal({
                            title: data.Message,
                            type: 'error'
                        })

                    }
                    else{
                        swal({
                            title: 'error',
                            type: 'error'
                        })

                    }

                })
 }

        //picking release
        $scope.charge_picking_release = function(){
            getDataService.data(
                getApi.picking_release,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "incident_id":parseInt($base64.urlsafe_decode($stateParams.sr_id))
                    })
                },
                function(data){
                    if(data.Status=='S'){
                        swal({
                            title: data.Message,
                            type: 'success'
                        })

                    }
                    else if(data.Status=='E'){
                        swal({
                            title: data.Message,
                            type: 'error'
                        })

                    }
                    else{
                        swal({
                            title: 'error',
                            type: 'error'
                        })

                    }

                })
        }

       //set sr_type
        $scope.sr_type = function (type_id) {

            getDataService.data(
                getApi.get_sr_init_status,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    sr_type_id: parseInt(type_id)
                }, function (resp) {
                    $scope.status = resp.data
                    $scope.statusSelect = resp.data[0].status_id
                   $scope.sr_type_obj= _.find($scope.srData.sr_type, function(num){
                       return num.type_id  == $scope.sr_type_item;
                   });
                    $scope.sr_type_name=$scope.sr_type_obj.type_name

                    angular.forEach($scope.srData.sr_type,function(v,k){
                        if(v.type_id ==type_id){
                            $scope.sn_required = v.sn_required
                        }
                    })

                }
            )
        }

        //customerInfo lov
        $scope.custInfo = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
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
                        $scope.account_number=angular.fromJson($rootScope.lov_data.radioValue).account_number
                        $scope.cust_account_id=angular.fromJson($rootScope.lov_data.radioValue).cust_account_id
                        $timeout(function () {
                            $scope.sr_form.$dirty = true;
                        }, 0);
                    }
                },
                controller: function ($scope, $rootScope) {
                    // $scope.obj_select = 'customer_name'
                    $scope.sr_cminfo_table = true
                    $scope.showPrevNext = true;
                    $scope.title = "Customer Information"
                    $scope.searchtype = [{"value": "customer_name", "name": "Name"}, {
                        "value": "phone",
                        "name": "Phone"
                    }];
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
                        //初始化
                        getDataService.data(
                            getApi.cmList,
                            'post',
                            {
                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                'parameter': JSON.stringify({
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "customer_name": $scope.obj_select,
                                    "customer_type": $scope.CustomerType,
                                    "phone": '',
                                    "query_type": "lov"
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
            })}})
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
                                console.log($scope.group_id)
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

       //Category lov
        $scope.categoryLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.category_id = angular.fromJson($rootScope.lov_data.radioValue).category_id
                                    $scope.category = angular.fromJson($rootScope.lov_data.radioValue).category
                                    $scope.category_set_id=angular.fromJson($rootScope.lov_data.radioValue).category_set_id
                                    $timeout(function () {
                                        $scope.sr_form.$dirty = true;
                                    }, 0);
                                }


                            },
                            controller: function ($scope, $rootScope) {

                                // $scope.obj_select = 'category'
                                $scope.Category = true
                                $scope.showPrevNext = true;
                                $scope.title = "Category List"
                                $scope.searchtype = [{"value": "category", "name": "category"}, {
                                    "value": "description",
                                    "name": "Description"
                                }];
                                $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//设置option默认值
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
                                            profile: $rootScope.InitalData.profile,
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
                                            profile:  $rootScope.InitalData.profile,
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
                    }})
        }

        //Problem Code Lov
        $scope.ProblemCodeLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/sr_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {
                        $scope.p_looup_code = angular.fromJson($rootScope.lov_data.radioValue).p_looup_code
                        $scope.p_meaning = angular.fromJson($rootScope.lov_data.radioValue).p_meaning
                        $scope.p_desc = angular.fromJson($rootScope.lov_data.radioValue).p_desc
                        $timeout(function () {
                            $scope.sr_form.$dirty = true;
                        }, 0);
                    }
                },
                controller: function ($scope, $rootScope) {
                    $scope.searchtype = [{"value": "lookup_code", "name": "Problem Code"}, {
                        "value": "meaning",
                        "name": "Meaning"
                    }];
                    $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//设置option默认值
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
                                profile: $rootScope.InitalData.profile,
                                'parameter': JSON.stringify({
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                    "category_id":parseInt($scope.category_id),
                                    "inventory_item_id":parseInt($scope.inventory_item_id),
                                    "sr_type_id":parseInt($scope.sr_type_item),
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
                            getApi.problem_code,
                            'post',
                            {
                                profile: $rootScope.InitalData.profile,
                                'parameter': JSON.stringify({
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                    "category_id":parseInt($scope.category_id),
                                    "inventory_item_id":parseInt($scope.inventory_item_id),
                                    "sr_type_id":parseInt($scope.sr_type_item),
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
            })}})
        }

       //Resolution Code lov
        $scope.ResoLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/sr_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {

                        $scope.looup_code = angular.fromJson($rootScope.lov_data.radioValue).r_looup_code
                        $scope.meaning = angular.fromJson($rootScope.lov_data.radioValue).meaning
                        $scope.desc = angular.fromJson($rootScope.lov_data.radioValue).desc
                        $timeout(function () {
                            $scope.sr_form.$dirty = true;
                        }, 0);


                    }
                },
                controller: function ($scope, $rootScope) {
                    $scope.searchtype = [{"value": "lookup_code", "name": "Resolution Code"}, {
                        "value": "meaning",
                        "name": "Meaning"
                    }];
                    $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//设置option默认值
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
                                profile: $rootScope.InitalData.profile,
                                'parameter': JSON.stringify({
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                    "category_id":parseInt($scope.category_id),
                                    "inventory_item_id":parseInt($scope.inventory_item_id),
                                    "sr_type_id":parseInt($scope.sr_type_item),
                                    "problem_code":parseInt($scope.p_looup_code),
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
                                profile: $rootScope.InitalData.profile,
                                'parameter': JSON.stringify({
                                    "page_index": page,
                                    "page_size": $scope.pageSize,
                                    "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                    "category_id":parseInt($scope.category_id),
                                    "inventory_item_id":parseInt($scope.inventory_item_id),
                                    "sr_type_id":parseInt($scope.sr_type_item),
                                    "problem_code":parseInt($scope.p_looup_code),
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
            })}})
        }

        //item lov
        $scope.itemLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.item_number = angular.fromJson($rootScope.lov_data.radioValue).item_number
                                    $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id
                                    $scope.item_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc.replace(/&quot;/,'"');

                                    $scope.category=angular.fromJson($rootScope.lov_data.radioValue).category_desc
                                    $scope.category_id=angular.fromJson($rootScope.lov_data.radioValue).item_category_id
                                    $scope.category_set_id=angular.fromJson($rootScope.lov_data.radioValue).item_category_set_id
                                    $timeout(function () {
                                        $scope.sr_form.$dirty = true;
                                    }, 0);

                                    $scope.trackable_flag = angular.fromJson($rootScope.lov_data.radioValue).trackable_flag;
                                    $scope.serial_number_control_code = angular.fromJson($rootScope.lov_data.radioValue).serial_number_control_code;
                                    $scope.lot_control_code = angular.fromJson($rootScope.lov_data.radioValue).lot_control_code;

                                    if($scope.trackable_flag=='N'){
                                        $scope.serial_number_control_code='Y';
                                        $scope.lot_control_code = 'N';
                                    }else if($scope.trackable_flag=='Y'){
                                        if($scope.lot_control_code == 'N' && $scope.serial_number_control_code=='N'){
                                            $scope.serial_number_control_code='Y';
                                            $scope.lot_control_code = 'N'
                                        }else if($scope.lot_control_code == 'Y' && $scope.serial_number_control_code=='Y'){
                                            $scope.serial_number_control_code='Y';
                                            $scope.lot_control_code = 'N'
                                        }
                                    }

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{"value": "item_number", "name": "Item Number"}, {
                                    "value": "item_desc",
                                    "name": "Item Desc"
                                }];
                                $scope.obj_select= {}; $scope.obj_select.value=$scope.searchtype[0].value; $scope.seaTypeValue=$scope.searchtype[0].name;  $scope.searFuc=function(name){     $scope.seaTypeValue=name; };//设置option默认值
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
                                            profile: $rootScope.InitalData.profile,
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "category_id":parseInt($scope.category_id),
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
                                            profile: $rootScope.InitalData.profile,
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "category_id":parseInt($scope.category_id),
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
                })}})
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
                                                    /*"sr_number": $scope.sr_info.incident_number || '',
                                                    "sr_type": parseInt($scope.sr_type_item) || '',
                                                    "sr_status": $scope.status_name || '',
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

        //Print lov
        $scope.PrintLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                            },
                            controller: function ($scope, $rootScope) {
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;

                                $scope.is_printDo = true;
                                $scope.title = "Print"







                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.charge_summary,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({

                                                "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                                                "organization_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                                "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                                "print_flag":"Y"
                                            })
                                        },

                                        function (response) {
                                            $scope.chargeSummaryPrint=response.charge

                                            angular.forEach($scope.chargeSummaryPrint,function(v,k){
                                                v.checked = true;
                                            })

                                            $scope.checkAll = true;
                                            $scope.choiceAll = function(all){
                                                if(all){
                                                    angular.forEach($scope.chargeSummaryPrint,function(v,k){
                                                        v.checked = true;
                                                    })
                                                }else{
                                                    angular.forEach($scope.chargeSummaryPrint,function(v,k){
                                                        v.checked = false;
                                                    })
                                                }
                                            }

                                        }
                                    )

                                    /*$scope.printIdWrap = [];
                                    $scope.choicePrint = function(item,checked,index){
                                        if(!checked){
                                            $scope.printIdWrap[index]={id:item.charge_line_id}
                                        }else{
                                            $scope.printIdWrap[index]=null;
                                        }
                                    }*/


                                    $scope.PrintDo = function(){
                                        $scope.printId = []
                                        angular.forEach($scope.chargeSummaryPrint,function(v,k){
                                            if(v.checked){
                                                $scope.printId.push({id: v.charge_line_id})
                                            }
                                        })

                                        getDataService.data(
                                            getApi.get_do_data_set,
                                            'post',
                                            {
                                                profile:  JSON.stringify($rootScope.InitalData.profile),
                                                'parameter': JSON.stringify({
                                                    "line_type":"CHARGE",
                                                    "lines":$scope.printId
                                                })
                                            },
                                            function (response) {

                                                if(response.Status=='S'){
                                                    $scope.batch_id = response.batch_id;
                                                    window.open($scope.printurl+'sr_id='+$scope.sr_id+'&batch_id='+$scope.batch_id+'&print_type=DO&client_timezone='+$scope.c_timezone+'&server_timezone='+$scope.s_timezone)
                                                }else{
                                                    swal({
                                                        title:response.Message,
                                                        type:"error"
                                                    })
                                                }
                                            }
                                        )
                                    }




                                })
                            }
                        })}})
        }

        //owner Lov
        $scope.ownerLov = function (page) {
            status.data(
                function(data){
                    if(data.status=="S"){
            ngDialog.open({
                className: "datatable-theme",
                template: "dialog/sr_lov.html",
                scope: $scope,
                preCloseCallback: function (value) {
                    if (value == "2") {
                        $scope.resource_id = angular.fromJson($rootScope.lov_data.radioValue).resource_id
                        $scope.resource_name = angular.fromJson($rootScope.lov_data.radioValue).resource_name
                        $timeout(function () {
                            $scope.sr_form.$dirty = true;
                        }, 0);
                    }
                },
                controller: function ($scope, $rootScope) {
                    $scope.searchtype = [{"value": "resource_type", "name": "resource_type"}, {
                        "value": "resource_name",
                        "name": "resource_name"
                    }];
                    $scope.$parent.obj_select = $scope.searchtype[1].value;//设置option默认值
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

                        getDataService.data(
                            getApi.owner,
                            'post',
                            {
                                profile: $rootScope.InitalData.profile,
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
                                profile: $rootScope.InitalData.profile,
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
            })}})
        }

       //Serial Lov
        $scope.serial_is=true
        $scope.SerialLov=function (searchName) {
            $scope.obj_select=searchName;
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/sr_lov.html?t="+Math.floor(Date.now() / 1000),
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.instance_id=angular.fromJson($rootScope.lov_data.radioValue).instance_id
                                    $scope.instance_number=angular.fromJson($rootScope.lov_data.radioValue).instance_number
                                    $scope.CustomerType=angular.fromJson($rootScope.lov_data.radioValue).party_type
                                    $scope.customer_id = angular.fromJson($rootScope.lov_data.radioValue).party_id
                                    $scope.customer_name=angular.fromJson($rootScope.lov_data.radioValue).customer_name
                                    $scope.address=angular.fromJson($rootScope.lov_data.radioValue).address
                                    $scope.email=angular.fromJson($rootScope.lov_data.radioValue).email
                                    $scope.phone=angular.fromJson($rootScope.lov_data.radioValue).phone
                                    $scope.category=angular.fromJson($rootScope.lov_data.radioValue).category_desc
                                    $scope.category_id=angular.fromJson($rootScope.lov_data.radioValue).item_category_id
                                    $scope.category_set_id=angular.fromJson($rootScope.lov_data.radioValue).item_category_set_id
                                    $scope.item_number=angular.fromJson($rootScope.lov_data.radioValue).item_number || ''
                                    $scope.inventory_item_id=angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id
                                    $scope.item_desc=angular.fromJson($rootScope.lov_data.radioValue).item_desc
                                    $scope.warranty_start_date=angular.fromJson($rootScope.lov_data.radioValue).warranty_start_date
                                    $scope.warranty_end_date=angular.fromJson($rootScope.lov_data.radioValue).warranty_end_date
                                    $scope.instance_id=angular.fromJson($rootScope.lov_data.radioValue).instance_id
                                    $scope.instance_date=angular.fromJson($rootScope.lov_data.radioValue).instance_date
                                    $scope.formData.serial_number=angular.fromJson($rootScope.lov_data.radioValue).serial_number
                                    $scope.formData.lot_number=angular.fromJson($rootScope.lov_data.radioValue).lot_number || ''
                                    $scope.contract_id=angular.fromJson($rootScope.lov_data.radioValue).contract_id
                                    $scope.contract_service_id=angular.fromJson($rootScope.lov_data.radioValue).contract_service_id
                                    $scope.account_number=angular.fromJson($rootScope.lov_data.radioValue).account_number
                                    $scope.cust_account_id=angular.fromJson($rootScope.lov_data.radioValue).cust_account_id

                                    if($scope.formData.serial_number){

                                    }else{
                                        $scope.serial_is=false
                                    }
                                    $timeout(function () {
                                        $scope.sr_form.$dirty = true;
                                    }, 0);
                                }
                            },
                            controller: function ($scope, $rootScope) {

                                $scope.searchtype = [{"value": "install_number", "name": "Instance Number"
                                }, {"value": "serial_number", "name": "Serial Number"}];
                                $scope.obj_select= {};

                                if(searchName=="serial_number"){
                                    $scope.obj_select.value=$scope.searchtype[1].value;
                                    $scope.seaTypeValue=$scope.searchtype[1].name;

                                }
                                else{
                                    $scope.obj_select.value=$scope.searchtype[0].value;
                                    $scope.seaTypeValue=$scope.searchtype[0].name;

                                }


                                $scope.searFuc=function(name){
                                    $scope.seaTypeValue=name;
                                }

                                $scope.is_Serial = true
                                $scope.showPrevNext = true;
                                searchName=="serial_number"?$scope.title = "Serial Number List":$scope.title = "Instance Number List"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({
                                        cursorcolor: "rgb(0, 122, 255)",
                                        cursoropacitymin:1
                                    });//初始化滚动条


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
                                                "organization_id": parseInt($rootScope.InitalData.profile.organization_id),
                                                "resp_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "customer_id":parseInt($scope.customer_id),
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
            valid.$dirty=false
            $scope.submitted = true
            console.log($scope.cust_account_id);
            console.log($scope.customer_id);
            if (valid.$valid) {

                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.sr_update,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        sr_entity: JSON.stringify({
                            "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                            "customer_id": parseInt($scope.customer_id),
                            "type_id": parseInt($scope.sr_type_item),
                            "status_id": parseInt($scope.incident_status_id),
                            "urgency_id": parseInt($scope.urgency_id),
                            "problem_code": $scope.p_looup_code,
                            "resolution_code": $scope.looup_code,
                            "owner_id": parseInt($scope.resource_id),
                            "group_id":parseInt($scope.group_id),
                            "inventory_item_id": parseInt($scope.inventory_item_id),
                            "category_id": parseInt($scope.category_id),
                            "category_set_id":parseInt($scope.category_set_id),
                            "summary": $scope.summary,
                            "close_date": "",
                            "note": $scope.note,
                            "attachment": $scope.files_obj,
                            "instance_id":parseInt($scope.instance_id),
                            "severity_id":parseInt($scope.severity_id),
                            "contract_id":parseInt($scope.contract_id),
                            "contract_service_id":$scope.contract_service_id,
                            "cust_account_id":parseInt($scope.cust_account_id),
                            "serial_number":$scope.formData.serial_number,
                            "lot_number":$scope.formData.lot_number,
                            "purchase_date":$scope.formData.purchase_date,
                            "ref_sr_num":$scope.ref_sr_num
                        })
                    },
                    function (response) {
                        //更新Recent items
                        menuData.data()
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false

                           $scope.init_status_id=$scope.incident_status_id


                            swal({
                                title:response.Message,
                                type:"success"

                            },function(){
                                location.reload()
                            })

                        }
                        else if (response.Status == "E") {

                            $rootScope.lodingbox = false
                            swal({
                                title:response.Message,
                                type:"error"

                            })
                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title:response.Message,
                                type:"error"

                            })


                        }
                    }
                )
            }else{

                $('html,body').animate({'scrollTop': $("input[name="+valid.$error.required[0].$name+"]").offset().top-150},500)

            }
        }
        //charge delete
        $scope.chargeDel=function(item){
            getDataService.data(
                getApi.charge_delete,
                'POST',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    charge_entity: JSON.stringify({
                        "charge_line_id":parseInt(item)

                    })
                },
                function(res) {
                    if (res.Status=='S') {

                        swal({
                            title:res.Message,
                            type:"success"

                        },
                            function(){
                                getDataService.data(
                                    getApi.charge_summary,
                                    'post',
                                    {

                                        'parameter': JSON.stringify({

                                            "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                                            "organization_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                            "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language
                                        })
                                    },

                                    function (response) {
                                        $scope.chargeSummary = response.charge

                                    })


                            }
                        )

                    }else{

                        swal({
                            title:res.Message,
                            type:"error"

                        })

                    }
                }






            )


        }

        //qa delete
        $scope.qaDel=function(row_id,index){
            getDataService.data(
                getApi.deleteQA,
                'POST',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    qa_entity: JSON.stringify({
                        "row_id":row_id,
                        "sr_id":parseInt($base64.urlsafe_decode($stateParams.sr_id))
                    })
                },
                function(res) {
                    if (res.Status=='S') {
                        swal({
                                title:res.Message,
                                type:"success"

                            },
                            function(){
                                $state.reload();
                            }
                        )

                    }else{

                        swal({
                            title:res.Message,
                            type:"error"

                        })

                    }
                }
            )
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
                ) && file.size < 2097152)
            {
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
        //删除文件
        $scope.files=$scope.rest_arr
        $scope.del=function(file){

            Array.prototype.remove=function(dx)
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

            }
            $scope.rest_arr=$scope.files.remove(file)
            $('.file_item'+file).hide()
        }

        $scope.files_obj = [];
        $scope.isremove=true;
        $scope.upload = function (files) {


            if (files && files.length) {
                $rootScope.lodingbox = true
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $scope.files = files
                    Upload.upload({
                        url: getApi.file_upload + 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid + '?filetype=' + file.type + '&filename='+file.name+'',
                        fields: {},
                        file: file
                    }).progress(function (evt) {

                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total)+'%';

                    }).success(function (data, status, headers, config) {
                        $rootScope.lodingbox = false
                        $scope.isremove=false;
                        $scope.item = {'filename': data.file, 'filetype': data.filetype,'original_name':data.original_name};
                        $scope.files_obj.push($scope.item)
                        swal({
                            title: data.message,
                            type: "success"
                        })

                        $scope.files = files
                        if (data.status == "L") {
                            swal({
                                title: 'Login timeout, please log in again',
                                type: 'error'
                            }, function () {
                                AuthenticationService.ClearCredentials();
                                window.location.href = "index.html#/login"

                            })
                        }
                    })
                        .error(function (data) {

                            alert(data)

                        })
                }
            }
            else{
                swal({
                    title: 'Please choose a file',
                    type: 'error'
                })

            }
        };



    });