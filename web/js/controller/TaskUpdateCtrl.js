/**
 * Created by lingyin on 15/6/26.
 */
IndonesiaApp
    .controller('TaskUpdateCtrl', function ($scope, $rootScope, $http,$base64, $timeout,$stateParams, getDataService, getApi, ngDialog, status, $state) {
        $("html,body").animate({scrollTop: $("html,body").offset().top},10);

        var instance_code= JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code;
        $scope.schedule_start_date = ''
        $scope.actual_start_date =''
        $scope.schedule_end_date = ''
        $scope.actual_end_date = ''

        //lov清空数据时改变form$dirty
        $('.icon-remove-sign').on('click',function(){
            $scope.task_form.$dirty=true
        })
        $scope.remove = function(name){
            $scope[name]=''
        }
            getDataService.data(
                getApi.task_type,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                }

                ,function(data){
                    $scope.task_type=data.task_type

                })
            getDataService.data(
                getApi.priority,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                },function(data){
                    $scope.taskInit=data.task_priority
                })
            getDataService.data(
                getApi.task_resource_type,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                }
                ,
                function (data) {
                    $scope.task_resource_type = data.task_resource

                }
            )


        //初使化数据
        $timeout(function() {
            getDataService.data(
                getApi.task_detail,
                'post',
                {
                    'parameter': JSON.stringify({
                        "task_id": parseInt($base64.urlsafe_decode($stateParams.task_id)),
                        "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                        "s_timezone": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.s_timezone,
                        "c_timezone": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.c_timezone,
                        "resp_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id),
                        "appl_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id),
                        "menu_id": parseInt(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.menu_id)
                    })

                }, function (data) {
                    $timeout(function () {
                        $scope.task_form.$dirty = false;
                    }, 0);
                    $scope.AssigneeType = data.task_info.asignee_type_code
                    $scope.task_info = data.task_info
                    $scope.owner_id = data.task_info.owner_id
                    $scope.asignee_id = data.task_info.asignee_id
                    $scope.asignee_name = data.task_info.asignee
                    $scope.task_status_id = data.task_info.task_status_id
                    $scope.task_status_name = data.task_info.task_status
                    $scope.task_status = data.task_info.task_status
                    $scope.incident_status_id = data.task_info.task_status_id
                    $scope.Subject = data.task_info.task_name
                    $scope.task_desc = data.task_info.task_desc
                    $scope.plan_start_date = data.task_info.plan_start_date
                    $scope.schedule_start_date = data.task_info.schedule_start_date
                    $scope.actual_start_date = data.task_info.actual_start_date
                    $scope.plan_end_date = data.task_info.plan_end_date
                    $scope.schedule_end_date = data.task_info.schedule_end_date
                    $scope.actual_end_date = data.task_info.actual_end_date
                    $scope.task_type_id = data.task_info.task_type_id
                    $scope.priority_id = data.task_info.task_priority_id
                    $scope.taskType = data.task_info.task_type_id
                    $scope.OwnerType = data.task_info.owner_type_code
                    $scope.owner =data.task_info.owner
                    $scope.owner_type_code = data.task_info.owner_type_code



                })
        },1000)

        //statusLov
        $scope.statusLov = function () {
            status.data(
                function(data){
                    if(data.status=="S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/task_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.incident_status_id = angular.fromJson($rootScope.lov_data.radioValue).task_status_id
                                    $scope.task_status_name = angular.fromJson($rootScope.lov_data.radioValue).task_status_name
                                    $timeout(function () {
                                        $scope.task_form.$dirty = true;
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
                                        getApi.task_status,
                                        'post',
                                        {

                                            'parameter': JSON.stringify({

                                                "task_status_id": $scope.task_status_id,
                                                "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,
                                                "repl_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id
                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.task_status;
                                        }
                                    )
                                })


                            }
                        })
                    }})
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
                                    if($scope.AssigneeType=='RS_GROUP'){
                                        $scope.asignee_name = angular.fromJson($rootScope.lov_data.radioValue).group_name
                                        $scope.asignee_id = angular.fromJson($rootScope.lov_data.radioValue).group_id

                                    }else{
                                        $scope.asignee_name = angular.fromJson($rootScope.lov_data.radioValue).resource_name
                                        $scope.asignee_id = angular.fromJson($rootScope.lov_data.radioValue).resource_id
                                    }
                                    $timeout(function () {
                                        $scope.task_form.$dirty = true;
                                    }, 0);
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
                                $scope.searchtype = [ {
                                    "value": "resource_name",
                                    "name": "Resource Name"
                                },{"value": "resource_number", "name": "Resource Number"}];
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
                                            console.log(response)
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

        $scope.assigneeRemove  =function(){
            $scope.asignee_name='';
            $scope.asignee_id='';
        }

        //OwnerLov lov
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
                                    if($scope.owner_type_code=='RS_GROUP'){
                                        $scope.owner = angular.fromJson($rootScope.lov_data.radioValue).group_name
                                        $scope.owner_id = angular.fromJson($rootScope.lov_data.radioValue).group_id

                                    }else{
                                        $scope.owner = angular.fromJson($rootScope.lov_data.radioValue).resource_name
                                        $scope.owner_id = angular.fromJson($rootScope.lov_data.radioValue).resource_id
                                    }
                                    $timeout(function () {
                                        $scope.task_form.$dirty = true;
                                    }, 0);

                                }
                            },
                            controller: function ($scope, $rootScope) {

                                if($scope.owner_type_code=='RS_GROUP'){
                                    $scope.owner_table_group = true;
                                }else{
                                    $scope.owner_table_resource = true;
                                }

                                $scope.owner_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Owner List"
                                $scope.searchtype = [
                                    {"value": "owner_name", "name": "owner name"}
                                ];
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
                                        getApi.task_resource,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.vendor_id,
                                                "resource_type":$scope.OwnerType,
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

                                   /* if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }*/


                                    $scope.where=''
                                    if($scope.task_info.owner_type_code=='RS_GROUP'){
                                        $scope.where = {group_name:$scope.obj_name2};
                                    }else{
                                        $scope.where = {resource_name:$scope.obj_name2};
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
                                                "resource_type":$scope.OwnerType,
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile.instance_code,
                                                "object_code" :'O'

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


        $scope.resetClass=function(obj){
            if(obj==1){
                $("input[name='plan_end_date']").removeClass('redBor');
            }
            if(obj==2){
                $("input[name='schedule_end_date']").removeClass('redBor');
            }
            if(obj==3){
                $("input[name='actual_end_date']").removeClass('redBor');
            }
        }

//task update
        $scope.submitForm = function (valid) {

            if($scope.schedule_start_date && $scope.schedule_end_date && $scope.schedule_start_date>$scope.schedule_end_date){
                swal({
                    title:'The schedule end date must be greater than the schedule start date!',
                    type:"error"
                });
                $("input[name='schedule_end_date']").addClass('redBor');
                return false;
            }
            if($scope.plan_start_date && $scope.plan_end_date && $scope.plan_start_date>$scope.plan_end_date){
                swal({
                    title:'The plan end date must be greater than the plan start date!',
                    type:"error"
                });
                $("input[name='plan_end_date']").addClass('redBor');
                return false;
            }
            if($scope.actual_start_date && $scope.actual_end_date && $scope.actual_start_date>$scope.actual_end_date){
                swal({
                    title:'The actual end date must be greater than the actual start date!',
                    type:"error"
                });
                $("input[name='actual_end_date']").addClass('redBor');
                return false;
            }

            //如果添加task的结束时间小于搜索页面传递过来的时间，并且国家为印尼时，提示。
            if($scope.actual_end_date&&$scope.actual_end_date < $base64.urlsafe_decode($stateParams.incident_date) && instance_code == 'MPI'){
                swal({
                    title:'Task Actual End Date should be later than SR Creation Date(Incident Date).',
                    type:"error"
                });
                $("input[name='actual_end_date']").addClass('redBor');
                return false;
            }


            valid.$dirty=false
            $scope.submitted = true
            console.log(valid)
            if (valid.$valid) {
                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.task_update,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        task_entity: JSON.stringify({
                            "task_id":parseInt($base64.urlsafe_decode($stateParams.task_id)),
                            "task_type":parseInt($scope.taskType),
                            "task_status":parseInt($scope.incident_status_id),
                            "task_priority":parseInt($scope.priority_id),
                            "task_name":$scope.Subject,
                            "task_desc":$scope.task_desc,
                            "owner_type":$scope.OwnerType,
                            "owner":parseInt($scope.owner_id),
                            "assignee_type":$scope.AssigneeType,
                            "assignee":parseInt($scope.asignee_id),
                            "plan_start_date":$scope.plan_start_date,
                            "plan_end_date":$scope.plan_end_date,
                            "schedule_start_date":$scope.schedule_start_date,
                            "schedule_end_date":$scope.schedule_end_date,
                            "actual_start_date":$scope.actual_start_date,
                            "actual_end_date":$scope.actual_end_date
                        })
                    },
                    function (response) {
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false;
                            $scope.task_status_id = $scope.incident_status_id;
                            swal({
                                title:response.Message,
                                type:"success"

                            })
                            window.location.href = "index.html#/task_update/"+$stateParams.task_id+"/"+ $stateParams.sr_id+"/"+$stateParams.incident_date;
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
                                title:response.Message ? response.Message : 'error',
                                type:"error"
                            })
                        }
                    }
                )
            }
        }


        $scope.returnBack = function () {
            window.location.href = "index.html#/sr_update/1/" + $stateParams.sr_id;
        };

        $scope.Cancel = function () {
            window.location.href = "index.html#/task_update/"+$stateParams.task_id+"/"+ $stateParams.sr_id+"/"+$stateParams.incident_date;
        }
    })

