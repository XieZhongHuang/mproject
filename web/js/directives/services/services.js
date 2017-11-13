var portalService = angular.module('portal.Service', [])

//全局变量
    .factory('globals', function () {
        return {
            //'authdata': JSON.parse(localStorage.getItem('AuthData')),
            //'initaldata': JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData')))
            //'user_id': JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id
        }
    })

//控制器按需加载
    .provider('path', function () {
        this.value = ''
        this.$get = function () {
            var value = this.setPath;
            return {
                print: value
            }
        };
        this.setPath = function (path) {
            return function ($q, $rootScope) {
                var deferred = $q.defer();
                require(path, function (tt) {
                    $rootScope.$apply(function () {
                        deferred.resolve();
                    });
                    deferred.resolve();
                });
                return deferred.promise;
            }
        }
    })

    //$http
    .factory('getDataService', function ($http,$rootScope, $base64,$timeout,getApi, AuthenticationService, $location, ngDialog) {
        var service = {};
        service.data = function (path, method, params, callback, loading) {

            if(loading && loading==='N'){
                $rootScope.loadingFlag = false;
            }else{
                $rootScope.loadingFlag = true;
            }
            //$rootScope.loadingFlag = true;
            $rootScope.noData= false;
            $rootScope.emptyData= false;
            $rootScope.loadingbox= true;

            $http({
                url: path + 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method: method,
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (response) {
                    //loading-control
                    $rootScope.loadingFlag = false;
                    $rootScope.loadingbox = false;
                    if(response.data && response.data.length==0){
                        $rootScope.noData= true;
                        $rootScope.emptyData= true;
                    }
                    if(response.data && response.data.length>0){
                        $rootScope.noData= false;
                        $rootScope.emptyData= false;
                    }
                    if (response.status == "L") {

                        localStorage.setItem('urlFlag','Y')
                        localStorage.setItem('historyUrl',$location.path())
                        swal({
                            title:'Login timeout, please login again',
                            type:'error'
                        },function(){
                            AuthenticationService.ClearCredentials();
                            window.location.href="index.html#/login"
                        })
                    }
                    else{
                        callback(response);
                        localStorage.setItem('urlFlag','N')
                    }
                })
                .error(function(response){
                    //loading-control
                    $rootScope.loadingFlag = false;
                    //$rootScope.htmlFlag = true;
                    //fail(response);
                })


        }
        return service;
    })
    .factory('getDataService2', function ($http,$rootScope, $base64,$timeout,getApi, AuthenticationService, $location, ngDialog) {
        var service = {};

        service.data = function (path, method, params, callback, loading) {
            if(loading && loading==='N'){
                $rootScope.loadingFlag = false;
            }else{
                $rootScope.loadingFlag = true;
            }
          angular.forEach(params,function(val,key){
              if(typeof(params[key]==='object')){
                  params[key]=JSON.stringify(params[key])
              }

          })
            //$rootScope.loadingFlag = true;
            $rootScope.noData= false;
            $rootScope.emptyData= false;
            $rootScope.loadingbox= true;

            $http({
                url: path + 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method: method,
                dataType:"String",
                data:$.param( _.extend({profile:JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile)},params)),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (response) {
                    //loading-control
                    $rootScope.loadingFlag = false;
                    $rootScope.loadingbox = false;
                    if(response.data && response.data.length==0){
                        $rootScope.noData= true;
                        $rootScope.emptyData= true;
                    }
                    if(response.data && response.data.length>0){
                        $rootScope.noData= false;
                        $rootScope.emptyData= false;
                    }
                    if (response.status == "L") {

                        localStorage.setItem('urlFlag','Y')
                        localStorage.setItem('historyUrl',$location.path())
                        swal({
                            title:'Login timeout, please log in again',
                            type:'error'
                        },function(){
                            AuthenticationService.ClearCredentials();
                            window.location.href="index.html#/login"
                        })
                    }
                    else{
                        callback(response);
                        localStorage.setItem('urlFlag','N')
                    }
                })
                .error(function(response){
                    //loading-control
                    $rootScope.loadingFlag = false;
                    //$rootScope.htmlFlag = true;
                    //fail(response);
                })


        }
        return service;
    })
//判断jsessionid有效期
    .factory('status',function($http,getApi,AuthenticationService,$location){


        var service = {};
        service.data =function(callback) {

            $http({
                url: getApi.status+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method: 'post',
                data: '',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}

            })
                .success( function (response) {
                    if (response.status == "L") {
                        localStorage.setItem('urlFlag','Y')
                        localStorage.setItem('historyUrl',$location.path())
                        swal({
                            title:'Login timeout, please log in again',
                            type:'error'
                        },function(){
                            AuthenticationService.ClearCredentials();

                            window.location.href="index.html#/login"
                        })
                    }
                    else{
                        localStorage.setItem('urlFlag','N')
                        callback(response);
                    }
                })
        }
        return service
    })

    //Recent items
    .factory('menuData', function ($http,$base64,$rootScope, getApi,getDataService) {
        var service = {};
        service.data=function(callback) {
            if ($base64.urlsafe_decode(localStorage.getItem('InitalData'))) {
                getDataService.data(
                    getApi.RecentItems,
                    'POST',
                    {'parameter': JSON.stringify({"user_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id})}
                    , function (response) {

                        sessionStorage.RecentItems = JSON.stringify(response.data)
                        sessionStorage.setItem(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.username,JSON.stringify(response.data))
                        //$rootScope.RecentItems = response.data
                        try{callback(response)}catch(e){}
                    }
                )

            }
        }
        return service
    })
    //用户登录验证
    .factory('AuthenticationService', function ($http,$rootScope, getApi) {
        var service = {};
        service.Login = function (username, password, callback) {
            $http({
                url: getApi.login,
                method: "post",
                data: $.param({username: username, password: password}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (response) {
                    callback(response);
                })
                .error(function (response) {
                    callback(response);
                })
        }
        service.SetCredentials = function (jsess) {
            sessionStorage.setItem('jsessionid', jsess)

        }
        service.ClearCredentials = function () {

            sessionStorage.removeItem('jsessionid');

        };
        return service;

    })
