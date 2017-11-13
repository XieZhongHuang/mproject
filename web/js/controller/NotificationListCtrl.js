/**
 * Created by fuguxu on 2016/10/19.
 */
IndonesiaApp
    .controller('NotificationListCtrl', function ($http, $rootScope, $scope,$base64, globals,getDataService,getApi,$timeout) {


        getDataService.data(
            getApi.notification,
            'POST',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (response) {
                $scope.notificationData = response.data;
                console.log($scope.notificationData)
            }
        )

    });