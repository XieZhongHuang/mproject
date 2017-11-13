/**
 * Created by lingyin on 15/6/23.
 */
IndonesiaApp
    .controller('NewTaskCtrl', function ($scope, $base64,$rootScope,$filter, $http, $stateParams, getDataService, getApi, ngDialog, status) {
        $("html,body").animate({scrollTop: $("html,body").offset().top},10);
//当前时间
        $scope.owner_id = JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.asp_resource_id
        $scope.owner_name = JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.asp_resource_name
        $scope.vendor_id=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.vendor_id
        $scope.instance_code=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code
        $scope.plan = function () {
            $scope.planfilter=$filter('datefilter')($scope.plan_start_date);

        }

        $scope.nowDate = new Date();
        $scope.year = $scope.nowDate.getFullYear();
        $scope.month = $scope.nowDate.getMonth()+1>=10?$scope.nowDate.getMonth()+1:'0'+($scope.nowDate.getMonth()+1);
        $scope.day = $scope.nowDate.getDate()>=10?$scope.nowDate.getDate():'0'+$scope.nowDate.getDate();
        $scope.hour = $scope.nowDate.getHours();
        $scope.minute = $scope.nowDate.getMinutes();
        $scope.second = $scope.nowDate.getSeconds();

        $scope.defaultDate = $scope.year+'-'+$scope.month+'-'+$scope.day+' '+$scope.hour+':'+$scope.minute+':'+$scope.second

        $scope.plan_start_date = $scope.defaultDate;
        $scope.plan_end_date = $scope.defaultDate;

        //task type
        getDataService.data(
            getApi.task_type,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (data) {
                $scope.task_type = data.task_type
                $scope.taskType = data.task_type[0].task_type_id

            },
            'N'
        )


        //priority
        getDataService.data(
            getApi.priority,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (data) {
                $scope.taskInit = data.task_priority
                $scope.priority_id = 3
            },
            'N'
        )
        //resource_type
        getDataService.data(
            getApi.task_resource_type,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            }
            ,
            function (data) {
                $scope.task_resource_type = data.task_resource
                if($scope.instance_code=='MSA'||$scope.instance_code=='MZA'||$scope.instance_code=='MVN'){
                    $scope.OwnerType = 'RS_GROUP';
                }else{
                    $scope.OwnerType = 'RS_SUPPLIER_CONTACT';
                }

                $scope.AssigneeType='RS_SUPPLIER_CONTACT'

            },
            'N'
        )
        //status
        getDataService.data(
            getApi.task_init_status,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (data) {
                $scope.status = data.task_status
                $scope.status_id = 10
            }
        )
        //owner lov
        $scope.OwnerLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/task_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                    $scope.owner_id = angular.fromJson($rootScope.lov_data.radioValue).group_id||angular.fromJson($rootScope.lov_data.radioValue).resource_id;
                                    $scope.owner_name = angular.fromJson($rootScope.lov_data.radioValue).group_name||angular.fromJson($rootScope.lov_data.radioValue).resource_name;
                                }
                            },
                            controller: function ($scope, $rootScope) {

                                if($scope.OwnerType=='RS_GROUP'){
                                    $scope.owner_table_group = true;
                                }else{
                                    $scope.owner_table_resource = true;
                                }

                                $scope.owner_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Owner List"
                                $scope.searchtype = [{"value": "resource_number", "name": "resource number"}, {
                                    "value": "resource_name",
                                    "name": "resource name"
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
                                    //初始化
                                    getDataService.data(
                                        getApi.task_resource,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "resource_type": $scope.OwnerType,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code,
                                                "object_code" :'O',
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
                                        getApi.task_resource,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "resource_type": $scope.OwnerType,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code,
                                                "object_code" :'O',
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
                }
            )


        }
        //assignee lov
        $scope.assigneeLov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/task_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                    $scope.assignee_id = angular.fromJson($rootScope.lov_data.radioValue).resource_id
                                    $scope.assignee_name = angular.fromJson($rootScope.lov_data.radioValue).resource_name
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                if($scope.AssigneeType=='RS_GROUP'){
                                    $scope.asignee_table_group = true;
                                }else{
                                    $scope.asignee_table_resource = true;
                                }

                                $scope.asignee_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Assignee List"
                                $scope.searchtype = [{"value": "resource_number", "name": "resource number"}, {
                                    "value": "resource_name",
                                    "name": "resource name"
                                }];
                                $scope.obj_select= {};
                                $scope.obj_select.value=$scope.searchtype[1].value;
                                $scope.seaTypeValue=$scope.searchtype[1].name;

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
                                        getApi.task_resource,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.vendor_id,
                                                "resource_type":$scope.AssigneeType,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code,
                                                "object_code" :'A',
                                                "group_id":$scope.owner_id,
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
                                        getApi.task_resource,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.vendor_id,
                                                "where": $scope.where,
                                                "resource_type":$scope.AssigneeType,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code,
                                                "object_code" :'A',
                                                "group_id":$scope.owner_id

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
                }
            )
        }
        //create task
        $scope.submitForm = function (valid) {
            //如果添加task的结束时间小于搜索页面传递过来的时间，并且国家为印尼时，提示。
            if($scope.actual_end_date&&$scope.actual_end_date < $base64.urlsafe_decode($stateParams.incident_date) && $scope.instance_code == 'MPI'){
                swal({
                    title:'Task Actual End Date should be later than SR Creation Date(Incident Date).',
                    type:"error"
                });
                $("input[name='actual_end_date']").addClass('redBor');
                return false;
            }

            valid.$dirty=false
            $scope.submitted = true
            if (valid.$valid) {
                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.create_task,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        task_entity: JSON.stringify({
                            "sr_id": parseInt($base64.urlsafe_decode($stateParams.sr_id)),
                            "task_type": parseInt($scope.taskType),
                            "task_status": parseInt($scope.status_id),
                            "task_priority": parseInt($scope.priority_id),
                            "task_name": $scope.task_name,
                            "task_desc": $scope.task_desc,
                            "owner_type": $scope.OwnerType,
                            "owner": parseInt($scope.owner_id),
                            "assignee_type": $scope.AssigneeType,
                            "assignee": parseInt($scope.assignee_id),
                            "plan_start_date": $scope.plan_start_date,
                            "plan_end_date": $scope.plan_end_date,
                            "schedule_start_date": $scope.schedule_start_date,
                            "schedule_end_date": $scope.schedule_end_date,
                            "actual_start_date": $scope.actual_start_date,
                            "actual_end_date": $scope.actual_end_date
                        })
                    },
                    function (response) {
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false

                            swal({
                                title: response.Message,
                                type: "success"

                            }, function () {
                                window.location.href = "index.html#/sr_update/2/" +$stateParams.sr_id
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
            else{

                $('html,body').animate({'scrollTop': $("input[name="+valid.$error.required[0].$name+"]").offset().top-150},500)

            }
        }


    })