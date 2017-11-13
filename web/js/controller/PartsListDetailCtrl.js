/**
 * Created by fuguxu on 2016/8/23.
 */

IndonesiaApp
    .controller('PartsListDetailCtrl', function ($http, $rootScope, $scope,$base64, globals,getDataService,getApi,getDataService2,$timeout,$stateParams,$sce) {
        $("html,body").animate({scrollTop: $("html,body").offset().top}, 10);
        var ref=window.location.href;
        if(ref.indexOf('=')>-1){
            ref=ref.substring(ref.indexOf('=')+1);
            $scope.customer_name= $base64.urlsafe_decode(ref);
        }

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

         $scope.currentPage = 1;//默认显示第一页
         $scope.totalPage = 1;
         $scope.pageSize = 10;//默认条数
         $scope.pages = [];
         $scope.endPage = 1;
         $scope.showPrevNext = true//显示上一页下一页
        $scope.PartsListId=$stateParams.PartsListId

        getDataService.data(
            getApi.topdf,
            'post',
            {
                productId:$scope.PartsListId,
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify({
                    //"where":{
                    "product_id":$scope.PartsListId
                    //}
                })
            },
            function (response) {
                var pdfViewId = response.data[0].displayFileDocId;
                var pdfurl = response.tsp_bom_url;
                $scope.myURL = $sce.trustAsResourceUrl(pdfurl+'?viewPage&docId='+pdfViewId); //URL 为全链接（$sce.trustAsResourceUrl("http://" + url)）
            }
        );



        getDataService.data(
            getApi.PLdetailh,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify({
                    //"where":{
                        "product_id":$scope.PartsListId
                    //}

                })
            },
            function (response) {
                $scope.PLdetaildate =response.data[0];
                $scope.item_num = $scope.PLdetaildate.item_num;
                $scope.cate_name = $scope.PLdetaildate.cate_name;
                $scope.sub_cate_name = $scope.PLdetaildate.sub_cate_name;
                $scope.brand = $scope.PLdetaildate.brand;
                $scope.model_desc_en = $scope.PLdetaildate.model_desc_en;
                $scope.model_desc_cn = $scope.PLdetaildate.model_desc_cn;

            }
        );

        //last sp list
        getDataService2.data(
            getApi.LastpartList,
            'post',
            {
                profile: JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile,
                'parameter': {
                    "page_index": $scope.currentPage,
                    "page_size": $scope.pageSize,
                    "where":{
                        "product_id":$scope.PartsListId
                    }

                }
            },
            function (response) {
                $scope.lastSpList = response.data;
                $scope.totalPage = response.pagecount;
            }
        );



        //分页
        $scope.DoCtrlPagingAct2 = function (page) {
            getDataService.data(
                getApi.LastpartList,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "where":{
                            "product_id":$scope.PartsListId
                        }
                    })
                },
                function (response) {
                    $scope.lastSpList = response.data;
                    $scope.totalPage = response.pagecount;
                }
            )
        };

        $scope.LastSparePartsList = 1;
        //切换
        $scope.tableswich =function(tableindex){
            $scope.LastSparePartsList = tableindex;
            if(tableindex==2){
                getDataService.data(
                    getApi.OrderList,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        'parameter': JSON.stringify({
                            "page_index": $scope.currentPage,
                            "page_size": $scope.pageSize,
                            "where":{
                                "product_id":$scope.PartsListId
                            }
                        })
                    },
                    function (response) {
                        $scope.orderList = response.data;
                        $scope.totalPage = response.pagecount;
                        if($scope.orderList.length>0){
                            getDataService.data(
                                getApi.OrderSpList,
                                'post',
                                {
                                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                    'parameter': JSON.stringify({
                                        "page_index": $scope.currentPageSp,
                                        "page_size": $scope.pageSizeSp,
                                        "where":{
                                            "ship_id":$scope.orderList[0].ship_id  //$scope.PartsListId
                                        }
                                    })
                                },
                                function (response) {
                                    $scope.orderSpList = response.data;
                                    $scope.totalPageSp = response.pagecount;
                                }
                            )
                        }
                    }
                )


            }
        }

        //每个行对应的SP List不同
        $scope.choiceRaidoItem = function(item){
            getDataService.data(
                getApi.OrderSpList,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": $scope.currentPageSp,
                        "page_size": $scope.pageSizeSp,
                        "where":{
                            "ship_id":item.ship_id  //$scope.PartsListId
                        }
                    })
                },
                function (response) {
                    $scope.orderSpList = response.data;
                    $scope.totalPageSp = response.pagecount;
                    $scope.ship_id = item.ship_id;
                }
            )
        }


        //order分页
        $scope.DoCtrlPagingActOrder = function(page){
            getDataService.data(
                getApi.OrderList,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "where":{
                            "product_id":$scope.PartsListId
                        }
                    })
                },
                function (response) {
                    $scope.orderList = response.data;
                    $scope.totalPage = response.pagecount;
                }
            )
        }


        $scope.currentPageSp = 1;//默认显示第一页
        $scope.totalPageSp = 1;
        $scope.pageSizeSp = 10;//默认条数
        $scope.pagesSp = [];
        $scope.endPageSp = 1;
        $scope.showPrevNext = true//显示上一页下一页

        //order sp list分页
        $scope.DoCtrlPagingActOrderSpList = function(page){
            getDataService.data(
                getApi.OrderSpList,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "where":{
                            "ship_id":$scope.ship_id ? $scope.ship_id:$scope.orderList[0].ship_id  //$scope.PartsListId
                        }
                    })
                },
                function (response) {
                    $scope.orderSpList = response.data;
                    $scope.totalPageSp = response.pagecount;
                }
            )
        }

        //查询
        /*$scope.DoCtrlPagingAct2 = function (page) {

            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.customer_name= $base64.urlsafe_decode(ref);

            }

            getDataService.data(
                getApi.cmList,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": $scope.pageSize,
                        "customer_name": $scope.customer_name,
                        "customer_type": $scope.customer_type,
                        "phone": $scope.phone,
                        "email":$scope.email,
                        "postal_code": $scope.postal_code,
                        "country":profile.country_code
                    })
                },
                function (response) {
                    $scope.summaryList = response.data
                    $scope.totalPage = response.pagecount;
                    $scope.DoCtrl=false;
                    $scope.DoCtrl2=true;

                }
            )
        };*/
       /* if($scope.customer_name){
            $scope.DoCtrlPagingAct2(1);

        }*/
        //监听回车事件
        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct2(1);
            }
        }

        /*$scope.saveCustomerName=function(){

            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(0,ref.indexOf('=')+1);

                window.location.href=ref+$base64.urlsafe_encode($scope.customer_name);
            }else{
                window.location.href=ref+'?customer_name='+$base64.urlsafe_encode($scope.customer_name);
            }
        }*/


    })