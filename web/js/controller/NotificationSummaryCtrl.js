/**
 * Created by Veket on 2015/9/9.
 */
/**
 * Created by lingyin on 15/5/25.
 */
IndonesiaApp
    .controller('NotificationSummaryCtrl', function ($http, $rootScope, $scope,$base64, globals,getDataService,getApi,$timeout) {

        var initType=function(){
            getDataService.data(
                getApi.notification_type,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                },
                function (rtn) {
                    var noti_type=[{type_code:"-1",type_name:"-- Please Choose --"}];
                    $scope.noti_type = noti_type.concat(rtn.noti_type);
                    $scope.typeSelect = "-1";
                }
            );
        };

        var getWhere=function(page){
            var typeSelect=$scope.typeSelect;
            var status=$scope.status;
            if(typeSelect=="-1")typeSelect="";
            if(status=="-1")status="";
            return {
                "page_index": page,
                "page_size": 10,
                "notification_type": typeSelect,
                "title": $scope.title,
                "status": status,
                "start_date": $scope.start_date,
                "end_date": $scope.end_date,
                "user_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id
            }
        };

        var validDate=function(){
            if($scope.start_date &&$scope.end_date&& $scope.start_date> $scope.end_date){
                swal({
                    title: 'CreationDateTo not earlier than CreationDateFrom',
                    type: "error"
                })
                return false;
            }else return true;
        };

        var queryData=function(page){
            if(!validDate()) return;
            getDataService.data(
                getApi.notification_summary,
                'post',
                {'parameter': JSON.stringify(getWhere(page))},
                function (response) {
                    $scope.summaryList = response.data;
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;
                    $scope.DoCtrl=true;
                    $scope.DoCtrl2=false;
                    $scope.emptyData=false;
                }
            );
        };

        //分页
        var DoCtrlPagingAct = function (page) {
            queryData(page);
        };

        var newClick=function(){
            window.location.href = "index.html#/F_ID_NOTIFICATION_NEW";
        };

        var editNotification=function(nid){
            window.location.href = "index.html#/nt_update/" + $base64.urlsafe_encode(nid);
        };

        var searchHandle=function(){
            queryData(1);
        };

        var bindEvent=function(){
            $scope.DoCtrlPagingAct=DoCtrlPagingAct;
            $scope.searchHandle=searchHandle;
        };

        var initPage=function(){
            $scope.type="";
            $scope.title="";
            $scope.status="-1";
            $scope.start_date="";
            $scope.end_date="";
            $scope.user_id=JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id;
            $scope.currentPage = 1;//默认显示第一页
            $scope.totalPage = 1;
            $scope.pageSize = 10;//默认条数
            $scope.pages = [];
            $scope.endPage = 1;
            $scope.showPrevNext = true;//显示上一页下一页
            bindEvent();
            queryData(1);
            initType();
        };

        initPage();
    });