/**
 * Created by lingyin on 16/4/11.
 */

IndonesiaApp
    .controller('OrderListCtrl', function ($scope, $base64,$rootScope,$filter, $http, $stateParams, getDataService2, getApi, ngDialog, status) {
        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }
        $scope.currentPage = 1;
        $scope.totalPage =   1;
        $scope.pageSize =   10;
        $scope.showPrevNext = true;
        $scope.DoCtrlPagingAct=function(page){
            getDataService2.data(getApi.summaryh,'POST',{
                parameter:{
                    "page_index":page,"page_size": $scope.pageSize,"lang":$scope.profile.language,
                    "where":{"request_number":$scope.request_number,"date_fr":$scope.date_fr,"date_to":$scope.date_to}}
            },function(res){
                $scope.orderList=res.data
                $scope.totalPage =res.pagecount;
                $scope.endPage = $scope.totalPage;

            })


        }




    })
