/**
 * Created by Administrator on 2016/4/13.
 */
IndonesiaApp
    .controller('CheckOrderCtrl', function ($scope, $stateParams, getDataService2, getApi, $rootScope,$base64) {

        $scope.is_show = false;

        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.endPage = 1;
        $scope.showPrevNext = true;
        $scope.orber_num = $base64.urlsafe_decode($stateParams.orderNumId);

        $scope.DoCtrlPagingAct = function (page) {
            getDataService2.data(getApi.detail, "POST",
                {
                    'parameter': {
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "lang": $rootScope.InitalData.profile.language,
                        "where": {
                            "header_id": parseInt($scope.orber_num)
                        }
                    }
                },
                function (response) {
                    $scope.order_Number = response.data.request_number;
                    $scope.description = response.data.description;
                    $scope.source_inventory = response.data.source_subinv;
                    $scope.destination_in = response.data.dest_subinv;
                    $scope.required_date = response.data.order_date;
                    $scope.status = response.data.header_status_name;
                    $scope.arr = response.data.lines;
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;
                })


        };

        $scope.DoCtrlPagingAct(1);

    });