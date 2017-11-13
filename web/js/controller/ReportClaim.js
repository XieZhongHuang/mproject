/**
 * Created by maizhining on 2017/7/1.
 */

IndonesiaApp
    .controller('ReportCLAIM',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService, getApi, ngDialog, status, $filter){
        //get claim_type
        getDataService.data(getApi.getsrtypes, 'post', {
            'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
            'parameter': JSON.stringify({
                "object_type": 'C',
                "resp_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                "appl_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id
            })
            }, function (response) {
                $scope.ClaimType      =  response.data;
                $scope.claim_type =  response.default_type;
            })

        // get Claim Line Status
        getDataService.data(getApi.statusType, 'post', {
                'parameter': JSON.stringify({
                    "object_type": 'H'
                })
            },
            function (response) {
                $scope.claimLineStatusData = response.data;
            }
        )

        $scope.ClaimCtrlPagingAct = function(page){
            $http({
                url:getApi.srReportDate+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid,
                method:'post',
                data:$.param({
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "claim_month_f": $scope.Claim_date_from,
                        "claim_month_t": $scope.Claim_date_to,
                        "claim_type": $scope.claim_type,
                        "claim_status": $scope.claim_status,
                        "claim_number": $scope.claimNumber
                    }),
                    'objecttype' :"CLAIM"
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
        }




    });





