/**
 * Created by Administrator on 2016/4/11.
 */
IndonesiaApp
    .controller('OrderConSumCtrl', function ($scope, getApi, getApi, getDataService2) {
        $scope.enter = function (ev) {

            if (ev.keyCode == 13) {
                $scope.DoCtrlPagingAct(1);
            }
        }
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.showPrevNext = true;
        $scope.DoCtrlPagingAct = function (page) {

            $scope.where = {
                'confirm_flag': "Y",
                "request_number": $scope.request_number,
                "date_fr": $scope.date_fr,
                "date_to": $scope.date_to
            };


            getDataService2.data(getApi.summaryl, 'POST', {
                parameter: {
                    "page_index": page, "page_size": $scope.pageSize, "lang": $scope.profile.language,
                    "where": $scope.where
                }
            }, function (res) {
                $scope.orderList = res.data
                $scope.totalPage = res.pagecount;
                $scope.endPage = $scope.totalPage;

            })


        }


    });