/**
 * Created by lingyin on 15/5/25.
 */
IndonesiaApp
    .config(function ($stateProvider, $urlRouterProvider, pathProvider,$requireProvider,$compileProvider) {//$requireProvider是根据angular-require.min.js中定义服务名字来的

        $stateProvider
            //登录
            .state('/', {
                url: "/",
                views: {                          //views 多视图
                    '': {
                        templateUrl: "tpls/login.html",
                        resolve: {              //预加载
                            deps: $requireProvider.requireJS(['js/controller/loginCtrl'])
                        }
                    }
                }
            })

            .state('login', {
                url: "/login",
                views: {                          //views 多视图
                    '': {
                        templateUrl: "tpls/login.html",
                        resolve: {              //预加载
                            deps: $requireProvider.requireJS(['js/controller/loginCtrl'])
                        }
                    }
                }
            })


            //首页
            .state('F_ID_HOME_AGT_SVC_ADMIN', {
                url: "/F_ID_HOME_AGT_SVC_ADMIN",
                views: {
                    '': {
                        templateUrl: "tpls/home.html",
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,//可以在run运行块里进行全局验证，不用这里每个路由时验证
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_HOME_AGT_SVC_ADMIN'
                                    },
                                    function (response) {
                                        $rootScope.homeStatus=response.Status


                                    }
                                )

                            }

                        }
                    },
                    'main@F_ID_HOME_AGT_SVC_ADMIN': {
                        templateUrl: "tpls/index_main.html?t="+Math.floor(Date.now() / 1000)
                    }
                }
            })
            .state('F_ID_HOME_AGT_WHS_ADMIN', {
                url: "/F_ID_HOME_AGT_WHS_ADMIN",
                views: {
                    '': {
                        templateUrl: "tpls/home_whs.html",
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeWhsCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_HOME_AGT_WHS_ADMIN'
                                    },
                                    function (response) {
                                        $rootScope.homeStatus=response.Status


                                    }
                                )

                            }

                        }
                    },
                    'main@F_ID_HOME_AGT_WHS_ADMIN': {
                        templateUrl: "tpls/index_main_whs.html?t="+Math.floor(Date.now() / 1000)
                    }
                }
            })

            .state('F_ID_HOME_INSTALL_ADMIN', {
                url: "/F_ID_HOME_INSTALL_ADMIN",
                views: {
                    '': {
                        templateUrl: "tpls/home_install.html",
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeInstallCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_HOME_INSTALL_ADMIN'
                                    },
                                    function (response) {
                                        $rootScope.homeStatus=response.Status


                                    }
                                )

                            }

                        }
                    },
                    'main@F_ID_HOME_INSTALL_ADMIN': {
                        templateUrl: "tpls/index_main_install.html?t="+Math.floor(Date.now() / 1000)
                    }
                }
            })
            .state('F_ID_HOME_ASP_PLUS_ADMIN', {
                url: "/F_ID_HOME_ASP_PLUS_ADMIN",
                views: {
                    '': {
                        templateUrl: "tpls/home_plus.html",
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homePlusCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_HOME_ASP_PLUS_ADMIN'
                                    },
                                    function (response) {
                                        $rootScope.homeStatus=response.Status


                                    }
                                )

                            }

                        }
                    },
                    'main@F_ID_HOME_ASP_PLUS_ADMIN': {
                        templateUrl: "tpls/index_main_plus.html?t="+Math.floor(Date.now() / 1000)
                    }
                }
            })

            .state('F_ID_HOME_ASP_ADMIN', {
                url: "/F_ID_HOME_ASP_ADMIN",
                views: {
                    '': {
                        templateUrl: "tpls/home_asp.html",
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeAspCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_HOME_ASP_ADMIN'
                                    },
                                    function (response) {
                                        $rootScope.homeStatus=response.Status


                                    }
                                )

                            }

                        }
                    },
                    'main@F_ID_HOME_ASP_ADMIN': {
                        templateUrl: "tpls/index_main_asp.html?t="+Math.floor(Date.now() / 1000)
                    }
                }
            })
            //新建客户
            .state('F_ID_CUST_CREATE', {
                url: "/F_ID_CUST_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/create_customer.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateCustomerCtrl','js/controller/homeCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_CUST_CREATE'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }

                        }
                    }
                }
            })

            //客户列表
            .state('F_ID_CUST_SUMMARY', {
                url: "/F_ID_CUST_SUMMARY",
                views: {
                    '': {
                        templateUrl: "tpls/customer_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CustomerSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_CUST_SUMMARY'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }

                        }
                    }
                }
            })

            //客户信息编辑
            .state('UpdateCustomer', {
                url: "/UpdateCustomer/{party_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_customer.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/UpdateCustomerCtrl'])
                        }
                    }
                }
            })

            .state('F_ID_SR_CREATE', {
                url: "/F_ID_SR_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/new_service.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewServiceCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SR_CREATE'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            .state('F_ID_SR_SEARCH', {
                url: "/F_ID_SR_SEARCH",
                views: {
                    '': {
                        templateUrl: "tpls/service_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeCtrl','js/controller/ServiceSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SR_SEARCH'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('H_SR_SEARCH', {
                url: "/H_SR_SEARCH/{status_flag:.*}/{task_close_flag:.*}/{today_sr_flag:.*}/{start_date:.*}/{{end_date:.*}}",
                views: {
                    '': {
                        templateUrl: "tpls/service_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/homeCtrl','js/controller/ServiceSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SR_SEARCH'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //SR  edit
            .state('sr_update', {
                url: "/sr_update/{scrollFlag:.*}/{sr_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_service.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ServiceUpdateCtrl'])
                        }
                    }
                }
            })

            //new task
            .state('newTask', {
                url: "/newTask/{sr_id:.*}/{incident_date:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/new_task.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewTaskCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SR_CREATE_TASK'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //task update
            .state('task_update', {
                url: "/task_update/{task_id:.*}/{sr_id:.*}/{incident_date:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_task.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/TaskUpdateCtrl'])
                        }
                    }
                }
            })

            //task summary
            .state('F_ID_SR_SEARCH_TASK', {
                url: "/F_ID_SR_SEARCH_TASK",
                views: {
                    '': {
                        templateUrl: "tpls/task_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/TaskSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SR_SEARCH_TASK'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            // Create IB
            .state('F_ID_IB_CREATE', {
                url: "/F_ID_IB_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/create_ib.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateIBCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_IB_CREATE'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //IB Summary
            .state('F_ID_IB_SEARCH', {
                url: "/F_ID_IB_SEARCH",
                views: {
                    '': {
                        templateUrl: "tpls/ib_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/IbSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_IB_SEARCH'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //IB update
            .state('ib_update', {
                url: "/ib_update/{instance_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_ib.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/IbUpdateCtrl'])
                        }
                    }
                }
            })

            // IB exChange
            .state('id_exChange', {
                url: "/id_ex_change/{instance_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/ex_change_ib.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/IbExChangeCtrl'])
                        }
                    }
                }
            })

            //new charge
            .state('newCharge', {
                url: "/newCharge/{sr_id:.*}/{sr_type_id:.*}/{item:.*}/{instance_number:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/new_charge.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewChargeCtrl'])

                        }
                    }
                }
            })

            //charge update
            .state('charge_update', {
                url: "/charge_update/{charge_line_id:.*}/{sr_id:.*}/{sr_type_id:.*}/{instance_number:.*}/{status:.*}/{item:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_charge.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ChargeUpdateCtrl'])
                        }
                    }
                }
            })

            //claim new
            .state('F_ID_CLAIM_CREATE', {
                url: "/F_ID_CLAIM_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/newClaim.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewClaimCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_CLAIM_CREATE'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //claim summary
            .state('F_ID_CLAIM_SUMMARY', {
                url: "/F_ID_CLAIM_SUMMARY",
                views: {
                    '': {
                        templateUrl: "tpls/claim_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ClaimSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_CLAIM_SUMMARY'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //claim update
            .state('claim_update', {
                url: "/claim_update/{claim_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_claim.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/UpdateClaimCtrl'])
                        }
                    }
                }
            })
            //New Parts Requirement
            .state('F_ID_SP_CREATE', {
                url: "/F_ID_SP_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/new_parts_requirement.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewPartsRequirementCtrl'])
                        }
                    }
                }
            })
            //Parts Requirement Summary
            .state('F_ID_SP_SUMMARY', {
                url: "/F_ID_SP_SUMMARY",
                views: {
                    '': {
                        templateUrl: "tpls/parts_requirement_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsRequirementSummaryCtrl'])
                        }
                    }
                }
            })
            //Parts Transaction History
            .state('F_ID_SP_TRAN_HIS', {
                url: "/F_ID_SP_TRAN_HIS",
                views: {
                    '': {
                        templateUrl: "tpls/parts_transaction_history.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsTransactionHistoryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SP_TRAN_HIS'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            //Parts Onhand Inquiry
            .state('F_ID_SP_ONHAND', {
                url: "/F_ID_SP_ONHAND",
                views: {
                    '': {
                        templateUrl: "tpls/parts_onhand_inquiry.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsOnhandInquiryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_SP_ONHAND'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('F_ID_LOCATOR_VIEW', {
                url: "/F_ID_LOCATOR_VIEW",
                views: {
                    '': {
                        templateUrl: "tpls/locator.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/LocatorCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_LOCATOR_VIEW'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('F_ID_LOCATOR_M', {
                url: "/F_ID_LOCATOR_M",
                views: {
                    '': {
                        templateUrl: "tpls/locator_create.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/LocatorCreateCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_LOCATOR_M'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //Receiving Parts
            .state('F_ID_SP_RECEIVE', {
                url: "/F_ID_SP_RECEIVE",
                views: {
                    '': {
                        templateUrl: "tpls/receiving_parts.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReceivingPartsCtrl'])
                        }
                    }
                }
            })
            //Return Parts
            .state('return_parts', {
                url: "/return_parts",
                views: {
                    '': {
                        templateUrl: "tpls/return_parts.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReturnPartsCtrl'])
                        }
                    }
                }
            })
            //Parts On-hand
            .state('parts_onhand', {
                url: "/parts_onhand",
                views: {
                    '': {
                        templateUrl: "tpls/parts_on-hand.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsOnhandCtrl'])
                        }
                    }
                }
            })
            //Parts Cycle Couting
            .state('parts_cycle_couting', {
                url: "/parts_cycle_couting",
                views: {
                    '': {
                        templateUrl: "tpls/parts_cycle_couting.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsCycleCoutingCtrl'])
                        }
                    }
                }
            })
            //Parts Adjustment
            .state('F_ID_SP_ADJUST', {
                url: "/F_ID_SP_ADJUST",
                views: {
                    '': {
                        templateUrl: "tpls/parts_adjustment.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsAdjustmentCtrl'])
                        }
                    }
                }
            })
            //Parts Transfer
            .state('F_ID_SP_TRANSFER', {
                url: "/F_ID_SP_TRANSFER",
                views: {
                    '': {
                        templateUrl: "tpls/parts_transfer.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsTransferCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_NOTIFICATION_NEW', {
                url: "/F_ID_NOTIFICATION_NEW",
                views: {
                    '': {
                        templateUrl: "tpls/create_notification.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateNotificationCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_NOTIFICATION_NEW'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('nt_update', {
                url: "/nt_update/{n_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_notification.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NotificationUpdateCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_NOTIFICATION_SUMMARY', {
                url: "/F_ID_NOTIFICATION_SUMMARY",
                views: {
                    '': {
                        templateUrl: "tpls/notification_summary.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NotificationSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_NOTIFICATION_SUMMARY'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('F_ID_NOTIFICATION_LIST', {
                url: "/F_ID_NOTIFICATION_LIST",
                views: {
                    '': {
                        templateUrl: "tpls/notification_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NotificationListCtrl'])
                        }
                    }
                }
            })
            .state('nt_preview', {
                url: "/nt_preview/{n_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/preview_notification.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PreviewNotificationCtrl'])
                        }
                    }
                }
            })
            .state('new_qa', {
                url: "/new_qa/{sr_id:.*}/{item_id:.*}/{sr_type_name:.*}",

                views: {
                    '': {
                        templateUrl: "tpls/new_qa.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewQaCtrl'])
                        }
                    }
                }
            })
            .state('new_qa_mza', {
                url: "/new_qa_mza/{sr_id:.*}/{item_id:.*}/{sr_type_name:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/new_qa_mza.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/NewQaMzaCtrl'])
                        }
                    }
                }
            })
            .state('update_qa', {
                url: "/update_qa/{sr_id:.*}/{row_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_qa.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/updateQaCtrl'])
                        }
                    }
                }
            })
            .state('update_qa_mza', {
                url: "/update_qa_mza/{sr_id:.*}/{row_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_qa_mza.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/updateQaMzaCtrl'])
                        }
                    }
                }
            })

            //order
            .state('F_MET_CONSIGN_ORDER', {
                url: "/F_MET_CONSIGN_ORDER",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/order/create_order.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateOrderCtrl'])
                        }
                    }
                }
            })
            .state('CheckOrder', {
                url: "/CHECK_ORDER/{orderNumId:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/order/check_order.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CheckOrderCtrl'])
                        }
                    }
                }
            })
            .state('F_MET_CONSIGN_ORDER_SUMMARY', {
                url: "/F_MET_CONSIGN_ORDER_SUMMARY",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/order/order_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/OrderListCtrl'])
                        }
                    }
                }
            })
            .state('F_MET_CONSIGN_CONFIRM', {
                url: "/F_MET_CONSIGN_CONFIRM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/order/order_confirm.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/OrderConfirmCtrl'])
                        }
                    }
                }
            })
            .state('F_MET_CONSIGN_CONFIRM_SUMMY', {
                url: "/F_MET_CONSIGN_CONFIRM_SUMMY",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/order/order_con_sum.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/OrderConSumCtrl'])
                        }
                    }
                }
            })


            //Item
            .state('CREATE_ITEM', {
                url: "/CREATE_ITEM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/item/create_item.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateItemCtrl'])
                        }
                    }
                }
            })

            .state('SEARCH_ITEM', {
                url: "/SEARCH_ITEM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/item/search_item.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/SearchItemCtrl'])
                        }
                    }
                }
            })

            .state('UPDATE_ITEM', {
                url: "/UPDATE_ITEM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/item/update_item.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/UpdateItemCtrl'])
                        }
                    }
                }
            })

            //warranty BOM
            .state('CREATE_WARRANTY_BOM', {
                url: "/CREATE_WARRANTY_BOM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/warranty/create_warranty.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreateWarrantyCtrl'])
                        }
                    }
                }
            })

            .state('SEARCH_WARRANTY_BOM', {
                url: "/SEARCH_WARRANTY_BOM",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/warranty/warranty_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/WarrantyListCtrl'])
                        }
                    }
                }
            })

            .state('MAINTAIN_PRICE_LIST', {
                url: "/MAINTAIN_PRICE_LIST",
                views: {
                    '': {
                        templateUrl: "tpls/spareParts/warranty/mp_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/MPListCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_PRICE_VIEW', {
                url: "/F_ID_PRICE_VIEW",
                views: {
                    '': {
                        templateUrl: "tpls/price_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PriceListCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_PRICE_VIEW'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            .state('F_ID_PRICE_M', {
                url: "/F_ID_PRICE_M",
                views: {
                    '': {
                        templateUrl: "tpls/price_new.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PriceNewCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_PRICE_M'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('F_ID_NEW_PRICE1_MUEN', {
                url: "/F_ID_PRICE_M/{priceListHeaderId:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/price_new.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PriceNewCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_PRICE_M'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            //parts list
            .state('F_ID_SP_LIST', {
                url: "/F_ID_SP_LIST",
                views: {
                    '': {
                        templateUrl: "tpls/parts_list.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsListCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_SP_LIST_DETAIL', {
                url: "/F_ID_SP_LIST_DETAIL/{PartsListId:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/parts_list_detail.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PartsListDetailCtrl'])
                        }
                    }
                }
            })



            //report

            .state('F_ID_RPT_SR_DETAIL', {
                url: "/F_ID_RPT_SR_DETAIL",
                views: {
                    '': {
                        templateUrl: "tpls/report_sr_detail.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReportSrDetail'])
                        }
                    }
                }
            })
            .state('F_ID_RPT_INV_ONHAND', {
                url: "/F_ID_RPT_INV_ONHAND",
                views: {
                    '': {
                        templateUrl: "tpls/report_inv_onhand.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReportInvOnhandCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_RPT_INV_TRX', {
                url: "/F_ID_RPT_INV_TRX",
                views: {
                    '': {
                        templateUrl: "tpls/report_inv_transfer.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReportInvTransferCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_RPT_IB_DETAIL', {
                url: "/F_ID_RPT_IB_DETAIL",
                views: {
                    '': {
                        templateUrl: "tpls/report_ib_detail.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReportIbDetail'])
                        }
                    }
                }
            })
            .state('F_ID_RPT_CLAIM', {
                url: "/F_ID_RPT_CLAIM",
                views: {
                    '': {
                        templateUrl: "tpls/report_CLAIM.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/ReportClaim'])
                        }
                    }
                }
            })

            //PO

            .state('F_ID_PO_CREATE', {
                url: "/F_ID_PO_CREATE",
                views: {
                    '': {
                        templateUrl: "tpls/create_po.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/CreatePoCtrl'])
                        }
                    }
                }
            })
            .state('F_ID_PO_SEARCH', {
                url: "/F_ID_PO_SEARCH",
                views: {
                    '': {
                        templateUrl: "tpls/summary_po.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PoSummaryCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_PO_SEARCH'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })
            .state('F_ID_PO_RECEIVE', {
                url: "/F_ID_PO_RECEIVE",
                views: {
                    '': {
                        templateUrl: "tpls/receive_po.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PoReceiveCtrl']),
                            "check":function($location,$base64,$rootScope,$http,getDataService,getApi){
                                getDataService.data(
                                    getApi.validation_function,
                                    'post',
                                    {
                                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                        function_name: 'F_ID_PO_RECEIVE'
                                    },
                                    function (response) {
                                        if(response.Status=="E"){
                                            $location.path('/permission')

                                        }

                                    }
                                )

                            }
                        }
                    }
                }
            })

            .state('po_update', {
                url: "/po_update/{po_sn:.*}/{sr_id:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_po.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PoUpdateCtrl'])
                        }
                    }
                }
            })
            .state('po_address_update', {
                url: "/po_address_update/{address_flag:.*}/{update_flag:.*}",
                views: {
                    '': {
                        templateUrl: "tpls/update_po_address.html?t="+Math.floor(Date.now() / 1000),
                        resolve: {
                            deps: $requireProvider.requireJS(['js/controller/PoAddressUpdateCtrl'])
                        }
                    }
                }
            })

            //print
            .state('print', {
                url: "/print",
                views: {
                    '': {
                        templateUrl: "print/print.html"
                    }
                }
            })
            .state('permission', {
                url: "/permission",
                templateUrl: "tpls/permission.html"
            })
            .state('404', {
                url: "/404",
                templateUrl: "tpls/404.html"
            })
       /* $urlRouterProvider.otherwise('404');*/
        //默认视图
        $urlRouterProvider.when("", "login")
    })