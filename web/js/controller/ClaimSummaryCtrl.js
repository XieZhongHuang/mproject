IndonesiaApp
    .controller('ClaimSummaryCtrl', function ($scope, $rootScope, $http, Upload,menuData, $base64, getDataService, getApi, ngDialog) {
        //init
        $scope.noData= false;
        $scope.currentPage = 1;
        $scope.totalPage =   1;
        $scope.pageSize =   10;
        $scope.pages =      [];
        $scope.endPage =     1;
        $scope.showPrevNext = true;

        //get statusType
        getDataService.data(
            getApi.statusType,
            'post',
            {
                'parameter': JSON.stringify({
                    "object_type":"H"
                })
            },
            function (response) {
                $scope.statusTypeData= response.data;
                $scope.claimStatus= "";

                //init request
                getDataService.data(
                    getApi.getclaimheader,
                    'post',
                    {
                        'parameter': JSON.stringify({
                            "page_index": 1,
                            "page_size":10,
                            "where":{
                                "claim_number":     $scope.claim_number,
                                "claim_status":     $scope.claimStatus,
                                "claim_submit_from":$scope.claim_submit_from,
                                "claim_submit_to":  $scope.claim_submit_to,
                                "vendor_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.vendor_id
                            }
                        })
                    },
                    function (response) {
                        $scope.searchClaimData = response.data;
                        $scope.totalPage =       response.pagecount;
                        $scope.endPage =         $scope.totalPage;
                    }
                )
            }
        )


        $scope.claimSearch = function (page) {
            getDataService.data(
                getApi.getclaimheader,
                'post',
                {
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size":10,
                        "where":{
                            "claim_number":     $scope.claim_number,
                            "claim_status":     $scope.claimStatus,
                            "claim_submit_from":$scope.claim_submit_from,
                            "claim_submit_to":  $scope.claim_submit_to,
                            "vendor_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.vendor_id
                        }
                    })
                },
                function (response) {
                    $scope.searchClaimData = response.data;
                    $scope.totalPage =       response.pagecount;
                    $scope.endPage =         $scope.totalPage;
                }
            )
        }
        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.claimSearch(1);
            }
        }
        //reset
        $scope.clearClaim= function(){
            $scope.claim_number="";
            $scope.claimStatus="";
            $scope.claim_submit_from="";
            $scope.claim_submit_to="";
        }


        //del selected_sr
        $scope.removeResData = function (index) {

            $scope.claim_id= $scope.searchClaimData[index].claim_id;
            sweetAlert({
                title: "Are you sure?",
                text: "You will not be able to recover this imaginary file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Delete",
                closeOnConfirm: true
            }, function(){
                getDataService.data(
                    getApi.deleteclaim,
                    'post',
                    {
                        'parameter': JSON.stringify({
                            "claim_id": $scope.claim_id
                        })
                    },
                    function (response) {
                        if(response.Status=="S"){
                            menuData.data(function(rtn){
                                if(rtn.data){location.reload()}
                            })
                            $scope.searchClaimData.remove(index);
                        }else{
                            swal({
                                title: 'Delete Fail',
                                type: "error"
                            })
                        }
                    }
                )
            });
        }

        Array.prototype.remove=function(dx)
        {
            if(isNaN(dx)||dx>this.length){return false;}
            for(var i=0,n=0;i<this.length;i++)
            {
                if(this[i]!=this[dx])
                {
                    this[n++]=this[i]
                }
            }
            this.length-=1;
            return this;
        }




    });