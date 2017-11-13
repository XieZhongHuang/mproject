/**
 * Created by lingyin on 15/5/14.
 */
IndonesiaApp
//登录认证
.controller('loginCtrl',function($scope,$http,$base64,$location,$timeout,menuData,$rootScope,AuthenticationService,globals,getDataService,getApi,ngDialog){

        $scope.lanData=lanData
        console.log(666);
        console.log(lanData);
        if(localStorage.username && localStorage.password){
        $scope.checked=true;
        $scope.isstroepwd=true;
        $scope.username=$base64.urlsafe_decode(localStorage.username);
        $scope.password=$base64.urlsafe_decode(localStorage.password);
        $scope.testDir= 'password';
    }


       $scope.toPsw= function($event){
        $event.target.type= 'password';
    }

    $scope.rememberpas= function(){
        if($scope.isstroepwd==false){
            localStorage.isstroepwd= false;
        }else {
            localStorage.isstroepwd = true;
        }

        if(!$scope.isstroepwd){
            localStorage.isstroepwd=false
        }
    }

    $scope.processForm=function() {

        AuthenticationService.Login(window.btoa($scope.username), window.btoa($scope.password), function (response) {
            if (response.status=="S") {
                $scope.jsessionid=response.jsessionid;
                localStorage.AuthData=JSON.stringify(response)
                if($scope.isstroepwd){
                    localStorage.username=$base64.urlsafe_encode($scope.username);
                    localStorage.password=$base64.urlsafe_encode($scope.password);
                }else{
                    localStorage.removeItem('username');
                    localStorage.removeItem('password');
                }
                //初始化请求
                if(response.responsibility.length>0){
                getDataService.data(
                    getApi.loginAuthData+'jsessionid='+response.jsessionid,
                    'post',{
                        user_id:response.user_id,
                        repl_id:response.responsibility[0].resp_id,
                        jsessionid:response.jsessionid,
                        lang_code:'US'
                    }
                    ,function(response){
                        AuthenticationService.SetCredentials($scope.jsessionid);
                        localStorage.removeItem('InitalData')
                        sessionStorage.removeItem('resp_selectValue')
                        sessionStorage.promise=JSON.stringify([{name:'F_ID_CUST_CREATE'},{name:"UpdateCustomer"}])
                        localStorage.setItem('InitalData',$base64.urlsafe_encode(JSON.stringify(response)))//缓存初始化数据到本地

                        $scope.homepageurl = response.profile.home_page;

                        if(localStorage.getItem('urlFlag')=='Y'){
                            $scope.historyUrl=localStorage.getItem('historyUrl');
                        }else{
                            $scope.historyUrl='/' + $scope.homepageurl;
                        }

                        if(getApi.is_profiles) {sessionStorage.InitalData = JSON.stringify(response)}
                        $rootScope.InitalData= JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData')));

                        $location.path($scope.historyUrl);
                        menuData.data()

                    })}
                else{
                    swal({
                        title:'You do not assign a valid repsonsibility',
                        type:"error"
                    })
                }
            }
            else if(response.status=="E"){
                for(var i=1; 4>=i; i++){
                    $('#login-wrap').animate({left:0},50);
                    $('#login-wrap').animate({left:-10},50);
                }
                $scope.username=response.message;
                $scope.isError=true;
                $timeout(function(){
                    $scope.username='';
                    $scope.isError=false;
                },1300)

            }
            else{


            }
        })
    }

});

