/**
 * Created by lingyin on 15/5/25.
 */
IndonesiaApp
    .controller('CustomerSummaryCtrl', function ($http, $rootScope, $scope,$base64, globals,getDataService,getApi,getDataService2,$timeout) {
        $("html,body").animate({scrollTop: $("html,body").offset().top}, 10);
        var ref=window.location.href;
        if(ref.indexOf('=')>-1){
            ref=ref.substring(ref.indexOf('=')+1);
            $scope.customer_name= $base64.urlsafe_decode(ref);
        }

        var profile = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile;

        getDataService2.data(
            getApi.get_country,
            'post',
            {

            },
            function (response) {
                $scope.countrys =response.data;
                $scope.country = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code;
                $scope.country_name = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.country_code
            }
        );

        $scope.user_id=JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id

        $scope.DoCtrl=true;
        $scope.DoCtrl2=false;

        $scope.user_id=JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id

        $scope.currentPage = 1;//默认显示第一页
        $scope.totalPage = 1;
        $scope.pageSize = 10;//默认条数
        $scope.pages = [];
        $scope.endPage = 1;
        $scope.showPrevNext = true//显示上一页下一页

        if(!$scope.customer_name){
            getDataService2.data(
                getApi.cmList,
                'post',
                {
                    'parameter': {
                        "page_index": 1,
                        "page_size": 10,
                        "country": profile.country_code,
                        "user_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id

                    }
                },
                function (response) {
                    $scope.summaryList = response.data;
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;
                    $scope.DoCtrl=true;
                    $scope.DoCtrl2=false
                }
            )
        }

         //分页
        $scope.DoCtrlPagingAct = function (page) {
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
                        "country":profile.country_code,
                        "user_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id
                    })
                },
                function (response) {
                    $scope.summaryList = response.data;
                    $scope.totalPage = response.pagecount;
                    $scope.DoCtrl=true
                    $scope.DoCtrl2=false
                }
            )
        };
        //查询
        $scope.DoCtrlPagingAct2 = function (page) {

            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.customer_name= $base64.urlsafe_decode(ref);

            }

            $scope.currentPage = page;

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
        };
        if($scope.customer_name){
            $scope.DoCtrlPagingAct2(1);

        }
        //监听回车事件
        $scope.enter = function(ev) {
            if (ev.keyCode == 13){
               $scope.DoCtrlPagingAct2(1);
            }
        }

        $scope.saveCustomerName=function(){

            var ref=window.location.href;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(0,ref.indexOf('=')+1);

                window.location.href=ref+$base64.urlsafe_encode($scope.customer_name);
            }else{
                window.location.href=ref+'?customer_name='+$base64.urlsafe_encode($scope.customer_name);
            }
        }

        //重置表单数据
        $scope.Rest=function(){
            $scope.customer_name='';
            $scope.customer_type='';
            $scope.phone='';
            $scope.postal_code='';
            //重置时将url的条件也重置，防止再次点击查询时number被赋值
            if(ref.indexOf('=') > -1){
                window.location.href = ref.substring(0,ref.indexOf('=')+1);
            }
            window.location.href = ref;
        }
    })