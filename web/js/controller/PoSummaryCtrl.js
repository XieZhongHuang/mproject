/**
 * Created by fuguxu on 2017/1/11.
 */
IndonesiaApp
    .controller('PoSummaryCtrl', function ($scope, $sce, $rootScope, status, $location, $base64, $http, Upload, $stateParams, getDataService, getApi, ngDialog) {

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

        $scope.currentPage = 1;//默认显示第一页
        $scope.totalPage = 1;
        $scope.pageSize = 10;//默认条数
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.showPrevNext = true//显示上一页下一页

        //状态
        getDataService.data(
            getApi.get_po_states,
            'post',
            {
                profile: JSON.stringify(profile),
                'parameter': JSON.stringify({
                    //"incident_status_id":$scope.initalData.incident_status_id,
                    "update_flag":"N"
                })
            },

            function (response) {
                $scope.srStatus=response.data;
            }
        )

        $scope.changeStatus = function(status_id){
            angular.forEach($scope.srStatus,function(v,k){
                if(status_id== v.status_id){
                    $scope.sr_status= v.status_name;
                }
            })
        }

        //当前页数据
        $scope.DoCtrlPagingAct = function (page) {
            $scope.currentPage = page

            getDataService.data(
                getApi.get_po_list,
                'post',
                {
                    profile: JSON.stringify(profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": 10,
                        "query_type": $scope.query_type,
                        "where": {
                            "customer_id":profile.customer_id,
                            "sr_number": $scope.sr_number || '',
                            "sr_status": $scope.sr_status || '',
                            "po_number":$scope.po_number || '',
                            "inventory_item_id": parseInt($scope.inventory_item_id) || '',
                            "start_date": $scope.start_date || '',
                            "end_date": $scope.end_date || '',
                            "status_id":parseInt($scope.status_id) || ''
                        }
                    })
                },
                function (response) {
                    $scope.summaryList = response.data
                    $scope.totalPage = response.pagecount;
                    $scope.searchFlag = false;

                }
            )
        };


        $scope.enter = function (ev) {

            if (ev.keyCode == 13) {
                $scope.DoCtrlPagingAct(1);
            }
        }

        $scope.reset=function(){
            $scope.sr_number='';
            $scope.po_number='';
            $scope.sr_status='';
            $scope.status_id='';
            $scope.start_date='';
            $scope.end_date='';
        }


    })
