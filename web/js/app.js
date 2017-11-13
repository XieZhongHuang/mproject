//Created by lingyin on 15/4/29.

var IndonesiaApp = angular.module('IndonesiaApp',
        ['ui.router',
            'ngRoute',
            'ngRequire',
            'pascalprecht.translate',
            'portal.Service',
            'angular-loading-bar',
            'ngAnimate',
            'ngDialog',
            'ab-base64',
            'brantwills.paging',
            'ngFileUpload',
            'directives',
            'ngSanitize',
            'dirtyForm',
            'angular-urlsafe-base64',
            'angularTrix'

        ])

        .config(function ($translateProvider, $httpProvider, $controllerProvider,$locationProvider,$routeProvider) {

        $locationProvider.hashPrefix(); // Removes index.html in URL
            IndonesiaApp._controller = IndonesiaApp.controller
            IndonesiaApp.controller = function (name, constructor) {
                $controllerProvider.register(name, constructor);
                return (this);
            }



            //多语言
            $translateProvider.useStaticFilesLoader({
                prefix: 'languages/',
                suffix: '.json?bust=1442282958057'
            })

            if (localStorage.getItem('langKey')) {
                $translateProvider.preferredLanguage(localStorage.getItem('langKey'));
            }

            else {
                $translateProvider.preferredLanguage('English');
                localStorage.setItem('langKey', 'English')
            }

        })
        .run(

        function ($rootScope, $location,getDataService,getApi,$base64,$templateCache) {
            $rootScope.$on('$locationChangeStart', function (event, next, current) {

                if ($location.path() !== '/login' && !sessionStorage.getItem('jsessionid')) {
                    $location.path('/login');
                }
                else if (sessionStorage.getItem('jsessionid') && $location.path() == '/login') {

                    //$location.path('/F_ID_HOME');
                    var homePage = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.home_page
                    $location.path('/'+homePage);
                }


            });

            $rootScope.$on('$stateChangeStart',function(e,toState,toparams,formState,formparams){
                console.log(toState)
                console.log(formState)
            })

        })

