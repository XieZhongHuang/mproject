/**
 * Created by fuguxu on 2016/8/12.
 */

IndonesiaApp
    .controller('ReportSrDetailCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService, getApi, ngDialog, status, $filter){
        /*** page init ***/
        var ref=window.location.href;

        if(ref.indexOf('=')>-1){
            ref=ref.substring(ref.indexOf('=')+1);
            $scope.serial_number= $base64.urlsafe_decode(ref)
        }

        $scope.noData=       false;
        $scope.currentPage =     1;
        $scope.totalPage =       0;
        $scope.pageSize =       10;
        $scope.pages =          [];
        $scope.endPage =         1;
        $scope.showPrevNext = true;



        //init time
        $scope.sr_date_from='';
        $scope.sr_date_to='';

        //sr_status
        $scope.getStatus = function(){
            getDataService.data(
                getApi.srReportStates,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "sr_type_id":$scope.type_id
                    })
                }
                , function (data) {
                    $scope.srReportStates = data.data;
                    console.log(data)
                })
        }

        $scope.getStatus();


        //sr_type
        getDataService.data(
            getApi.get_sr_initial,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)

            }
            , function (data) {
                $scope.srData = data.sr_type;

            })

        //选择不同srtype
        $scope.choiceSrType = function(id){
            if(id){
                $scope.type_id = parseInt(id)
            }else{
                $scope.type_id = ''
            }
            $scope.status_id='';
            $scope.getStatus();
        }

        //choice status
        $scope.choiceSrStatus = function(id){
            $scope.sr_status_id = parseInt(id);
            console.log($scope.sr_status_id)
        }

        $scope.submittedDateFrom=false;
        $scope.submittedDateTo=false;

        $scope.chargeDateFrom = function(date){
            if(date){
                $scope.submittedDateFrom=false;
            }
        }
        $scope.chargeDateTo = function(date){
            if(date){
                $scope.submittedDateTo=false;
            }
        }

        //download
        $scope.DoCtrlPagingAct= function(page){
            var ref=window.location.href;
            $scope.totalPage = page;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }

            if(!$scope.sr_date_from){
                $scope.submittedDateFrom = true;
                if(!$scope.sr_date_to){
                    $scope.submittedDateTo=true;
                }
                return;
            }

            if(!$scope.sr_date_to){
                $scope.submittedDateTo=true;
                return;
            }



            $http({
                url:getApi.srReportDate+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method:'post',
                data:$.param({
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "creation_date_from": $scope.sr_date_from,
                        "creation_date_to": $scope.sr_date_to,
                        "sr_type_id": $scope.type_id,
                        "sr_status_id": $scope.sr_status_id
                    }),
                    'objecttype' :"SR"
                }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(response){
                if(response.file_name=='No Data Found'){
                    swal({
                        title:response.file_name,
                        type:'warning'
                    })
                }else{

                    window.open(
                        response.url+'/filedown?filename='+ response.file_name +'&filetype=application/msexcel&downLoadType=REPORT'
                    )
                }

            })


            /*getDataService.data(
                getApi.srReportDate,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                            "creation_date_from": $scope.sr_date_from,
                            "creation_date_to": $scope.sr_date_to,
                            "sr_type_id": $scope.type_id,
                            "sr_status_id": ""
                    }),
                    'objecttype' :"SR"
                },
                function (response) {
                    window.open(
                        'https://iservicetest.midea.com:8081/rest/filedown?filename='+ response +'&filetype=application/msexcel&downLoadType=REPORT'
                    )
                }
            )*/
        }

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }



        //reset
        $scope.reset= function(){
            $scope.sr_date_from='';
            $scope.sr_date_to='';
            $scope.type_id='';
            $scope.status_id='';
        }

    }

);





