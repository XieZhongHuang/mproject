/**
 * Created by lingyin on 15/5/14.
 */
IndonesiaApp
    .controller('appCtrl', function ($scope,$rootScope,$base64) {
        try{
        $rootScope.InitalData = JSON.parse($base64.urlsafe_decode(localStorage.InitalData));
        $scope.profile=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile;
        }catch(e){}
    })

//多语言
    .controller('TranslateController', function ($translate, $scope) {
        $scope.changeName = localStorage.getItem('langKey');
        switch ($scope.changeName) {
            case "English":
                $scope.countryFlagen = true;
                $scope.countryFlagba = false;
                break;
            case "Bahasa":
                $scope.countryFlagen = false;
                $scope.countryFlagba = true;
                break;
            default:
                $scope.countryFlagen = true;
                $scope.countryFlagba = false;
                break;
        }
        $scope.changeLanguage = function (langKey) {
            if (langKey == 'English') {
                $scope.countryFlagen = true;
                $scope.countryFlagba = false;
            }
            if (langKey == 'Bahasa') {
                $scope.countryFlagen = false;
                $scope.countryFlagba = true;
            }
            localStorage.setItem('langKey', langKey)
            $scope.changeName = localStorage.getItem('langKey')
            $translate.use(localStorage.getItem('langKey'));

        }
    })
    //头部
    .controller('headerCtrl', function ($http,$sce, $scope, $filter, $rootScope, $base64, $document, base64, $location, globals, getApi, getDataService, AuthenticationService, ngDialog) {
        $scope.lanData=lanData

        $rootScope.$on('ngDialog.closed', function (e, $dialog) {
           $('.emptyData').hide()
        });
        $location.search({})
        $rootScope.test = 'a'
        $rootScope.lodingbox = false
        $rootScope.reload = function () {
            window.location.reload()
        }
        $rootScope.AuthData = JSON.parse(localStorage.AuthData);
        $rootScope.InitalData.profile.username.split('_')[0].toLocaleLowerCase();
        $scope.instance_code=$rootScope.InitalData.profile.instance_code;
        if($rootScope.InitalData.profile.username.split('_')[0]=='ex'){$scope.ex_userName=true}else{$scope.ex_userName=false}
        //指责切换
        if (sessionStorage.resp_selectValue) {
            $scope.resp_id = parseInt(sessionStorage.resp_selectValue)
            $scope.resp_name = sessionStorage.resp_selectValue

        }
        else {
            $scope.resp_id = JSON.parse(localStorage.AuthData).responsibility[0].resp_id;
            $scope.resp_name = JSON.parse(localStorage.AuthData).responsibility[0].resp_name;

        }

        $scope.SetResp = function (resp_id, resp_name) {
            localStorage.setItem('resp_id', $scope.resp_id);
            getDataService.data(
                getApi.leftMenu,
                'post', {
                    user_id: JSON.parse(localStorage.getItem('AuthData')).user_id,
                    repl_id: resp_id,
                    jsessionid: JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                    lang_code: 'US'
                }
                , function (response) {
                    $location.path('/'+response.profile.home_page);
                    sessionStorage.resp_selectValue = resp_name;
                    $scope.resp_name = resp_name;
                    $rootScope.InitalData = response;

                    localStorage.setItem('InitalData', $base64.urlsafe_encode(JSON.stringify(response)));
                    if ($base64.urlsafe_decode(localStorage.getItem('InitalData'))) {
                        $rootScope.InitalData = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData')));
                    }
                })
        };
        //登出
        $scope.logout = function () {
            swal({
                title: "Exit Midea Portal?",
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: true
            }, function () {

                $http({
                    url: getApi.logout,
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                    .success(function (response) {
                        if (response) {
                            localStorage.removeItem('AuthData')
                            localStorage.removeItem('InitalData')
                            AuthenticationService.ClearCredentials();
                            sessionStorage.removeItem('jsessionid')

                            $location.path('/login');
                        }
                    })
            });
        }


        //联系我们
        $scope.contactUSLov=function(){
            ngDialog.open({
                className: "datatable-theme-contactUS",
                template: "dialog/contactUS_lov.html",
                controller:function($scope, $rootScope){
                    getDataService.data(
                        getApi.getContactUs,
                        'post',
                        {
                            profile:JSON.stringify($rootScope.InitalData.profile),
                            'parameter': JSON.stringify({

                            })
                        },
                        function (response) {
                            $scope.data=$sce.trustAsHtml( response.msg);
                        }
                    )
                }
            })
        }



        //Search Type
        $scope.searchType = ['Customer Name', 'Service Request#', 'Serial Number'];
        var refs = window.location.href;
        if (refs.indexOf('F_ID_CUST_SUMMARY') > -1) {
            $scope.selectedSearch = $scope.searchType[0];
        }
        else if (refs.indexOf('F_ID_SR_SEARCH') > -1) {
            $scope.selectedSearch = $scope.searchType[1];
        }
        else if (refs.indexOf('F_ID_IB_SEARCH') > -1) {
            $scope.selectedSearch = $scope.searchType[2];
        }
        else {
            $scope.selectedSearch = $scope.searchType[0];
        }

        $scope.getType = function (index) {
            $scope.selectedSearch = $scope.searchType[index];
            $scope.keywords = "";
        }

        //keypress
        $('input[name="keywords"]').bind('keypress', function (event) {
            if (event.which === 13) {
                $('#to-search').trigger('click');
                event.preventDefault();
            }
        });

        //notification
        getDataService.data(
            getApi.notification_receive_list,
            'POST',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify({

                })
            },
            function (response) {
                $scope.notificationData = response.data;

                $scope.notificationDatalength = response.count
            }
        );
        $scope.belltipsclick = function(){
            $('.tipslist').toggle()
        }
    })

    //左侧menu
    .controller('menuCtrl', function ($scope, $http, $location,getDataService, $base64, getApi, $rootScope) {
        $scope.Knowledge=getApi.Knowledge;
        $scope.SR = 'sr_update'
        if($location.path()=='/'+JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.home_page){
            getDataService.data(
                getApi.RecentItems,
                'POST',
                {'parameter': JSON.stringify({"user_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id})}
                , function (response) {
                    $scope.RecentItems = response.data
                }
            )

        }else{

        if(sessionStorage.getItem(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.username)) {
            $scope.getItm_obj=JSON.parse(sessionStorage.getItem(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.username))
            $scope.RecentItems =  $scope.getItm_obj
        }else {
            if (localStorage.getItem('InitalData')) {
                getDataService.data(
                    getApi.RecentItems,
                    'POST',
                    {'parameter': JSON.stringify({"user_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id})}
                    , function (response) {
                        $scope.RecentItems = response.data

                    }
                )
            }
        }
        }


        $(".tableBodyScroll").niceScroll({cursorcolor: '#ddd',autohidemode: 'hidden' });//initscrollbar
        $scope.menuWrap = true;
        $rootScope.navHide = false;
        $rootScope.mainToggle = function () {
            $rootScope.navHide = !$rootScope.navHide
            $rootScope.isFull = !$rootScope.isFull
            if ($rootScope.isFull) {
                $rootScope.isFixed = true
            } else {
                $rootScope.isFixed = false
            }
        }

        if(localStorage.pullSlideFlag==String(false)){
            $scope.pullActive=false

            setTimeout(function(){
                $('.menu-item').css({'width': '60px'});
                $('#pull-block').css({'left': '60px'});
                $('#portal-main,#main-content').css({'marginLeft': '70px'});
            },0)
        }else{
            $scope.pullActive = true;
        }

        $scope.pullSlideFlag = function(){
            $scope.pullActive = false;
            localStorage.pullSlideFlag = $scope.pullActive
        }

        $scope.pullMenu = function () {
            if ($scope.pullActive) {
                $('.menu-item').animate({'width': '60px'}, 300);
                $('#pull-block').animate({'left': '60px'}, 300);
                $('#portal-main,#main-content').animate({'marginLeft': '70px'}, 300);
                $scope.pullActive = false;
                localStorage.pullSlideFlag = $scope.pullActive
            } else {
                $('.menu-item').animate({'width': '200px'}, 300);
                $('#pull-block').animate({'left': '200px'}, 300);
                $('#portal-main,#main-content').animate({'marginLeft': '210px'}, 300);
                $scope.pullActive = true;
                localStorage.pullSlideFlag = $scope.pullActive
            }
        }

    })



