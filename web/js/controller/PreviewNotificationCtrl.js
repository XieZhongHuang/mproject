/**
 * Created by Veket on 2015/9/11.
 */
IndonesiaApp.controller('PreviewNotificationCtrl',function($http, $rootScope, $scope,$base64, globals,getDataService,getApi,$timeout,$stateParams){
    var nid=0;

    var loadInitData=function(){
        getDataService.data(
            getApi.notification_detail,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                parameter:JSON.stringify({"notification_id":nid,"style":"view"})
            },
            function (item) {
                var content = item.content.replace(/\n/g, "<br>");
                content = content.replace(/\s/g, "&nbsp;");
                $scope.title=item.title;
                $scope.content=content;
                $scope.attachment=item.attachment;
            }
        );
    };

    var initPage=function(){
        $scope.dowUrl=getApi.file_down;
        nid = parseInt($base64.urlsafe_decode($stateParams.n_id)) ||0;
        loadInitData();
    };

    initPage();
});