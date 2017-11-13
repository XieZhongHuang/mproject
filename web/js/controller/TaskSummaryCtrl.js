/**
 * Created by lingyin on 15/6/23.
 */
IndonesiaApp
    .controller('TaskSummaryCtrl', function ($scope, $rootScope,$base64, $http, $stateParams, getDataService, getApi) {
        $scope.currentPage = 1;//默认显示第一页
        $scope.totalPage = 1;
        $scope.pageSize = 10;//默认条数
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.showPrevNext = true//显示上一页下一页

        $scope.task_number='';

        getDataService.data(
            getApi.task_summary,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify(
                    {
                        "page_index":$scope.currentPage,
                        "page_size": $scope.pageSize,
                        "where": {"task_filter": parseInt($scope.view_id),"task_number":$scope.task_number}
                    })
            },
            function (response) {
                $scope.taskSummary = response.task_list
                $scope.totalPage = response.pagecount;
                $scope.endPage = $scope.totalPage;

            }
        )
        $scope.DoCtrlPagingAct = function (page) {
            $scope.currentPage = page;
            getDataService.data(
                getApi.task_summary,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "where": {"task_filter": parseInt($scope.view_id),"task_number":$scope.task_number}
                    })
                },
                function (response) {
                    $scope.taskSummary = response.task_list
                    $scope.totalPage = response.pagecount;
                    if($scope.taskSummary.length==0){
                        $scope.notaskSummary = true
                    }else{
                        $scope.notaskSummary = false
                    }
                }
            )
        };
        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }

    })

