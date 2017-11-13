IndonesiaApp

    .controller('UpdateClaimCtrl', function ($scope, $rootScope, $http,$base64, $timeout,menuData, Upload, $stateParams, getDataService, getApi, ngDialog,status,AuthenticationService) {

        //add amount when line added
        $scope.instance_code = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code;
        $scope.addAmount= function(line){
            if(!$scope.amount_total) $scope.amount_total = 0;
            $scope.amount_total = parseFloat($scope.amount_total) + parseFloat(line.amount);
        };

        //execute this function where data changing
        $scope.markDataChanged = function(){
            $scope.dataChanged = true;
        };

        $scope.updateSuccessFunction = function(response){
            swal({
                title: response.Message,
                type: "success"
            }, function () {
                location.reload()
                getDataService.data(
                    getApi.getClaimLine,
                    'post',
                    {
                        'parameter': JSON.stringify({
                            "page_index":1,
                            "page_size":10,
                            "where":{
                                "claim_id":parseInt($scope.claim_id)
                            }
                        })
                    },
                    function (response) {

                        $scope.resData= response.data;
                    }
                )
            })

        }

        //init Claim Header
        $scope.claim_id = $base64.urlsafe_decode($stateParams.claim_id);
        getDataService.data(
            getApi.updateClaimheader,
            'post',
            {
                'parameter': JSON.stringify({
                    "claim_id": parseInt($scope.claim_id)
                })
            },
            function (response) {
                $scope.claimDetailData = response.data[0];
                $scope.claim_number = $scope.claimDetailData.claim_number;
                $scope.claim_default_type = $scope.claimDetailData.claim_status;
                $scope.claim_status_code = $scope.claimDetailData.claim_status_code;
                $scope.submited_date = $scope.claimDetailData.submited_date;
                $scope.approved_amount = $scope.claimDetailData.approved_amount;
                $scope.approved_date = $scope.approved_date;
                $scope.asp_comments = $scope.claimDetailData.comments;
                $scope.hq_ap_invoice = $scope.claimDetailData.hq_ap_invoice
                $scope.approved_date = $scope.claimDetailData.approved_date
                $scope.meterial_total = $scope.claimDetailData.meterial_total;
                $scope.labor_total = $scope.claimDetailData.labor_total;
                $scope.expense_total = $scope.claimDetailData.expense_total;
                $scope.approved_amount_total = $scope.claimDetailData.approved_amount_total;
                $scope.claim_type = $scope.claimDetailData.claim_type;
                $scope.invoice_amount = $scope.claimDetailData.invoice_amount;
                $scope.paid_amount = $scope.claimDetailData.paid_amount;
                $scope.amount_total = response.data[0].amount;
                //if no ENTERED，all button disabled
                if ($scope.claimDetailData.claim_status_code != 'ENTERED') {
                    $scope.disabledFlag = true;
                    $scope.aspComment = true;
                }
                $timeout(function () {
                    $scope.claim_form.$dirty = false;
                }, 0);
            },
            'N'
        )

        //init Claim line
        $
        $scope.currentPage = 1;
        $scope.totalPage = 1;
        $scope.pageSize = 10;
        $scope.endPage = 1;
        $scope.showPrevNext = true;
        $scope.claimSearch = function (page) {
            getDataService.data(
                getApi.getClaimLine,
                'post',
                {
                    'parameter': JSON.stringify({
                        "page_index": page,
                        "page_size": 10,
                        "where": {
                            "claim_id": parseInt($scope.claim_id)
                        }
                    })
                },
                function (response) {
                    $scope.resData = response.data;
                    $scope.totalPage = response.pagecount;
                    $scope.endPage = $scope.totalPage;
                    $scope.getAmount();

                    $timeout(function () {
                        $scope.claim_form.$dirty = false;
                    }, 0);
                },
                'N'
            )
        }

        $scope.getCount = function(val1,val2,val3,val4){
            val1 = val1?val1:0;
            val2 = val1?val2:0;
            val3 = val1?val3:0;
            val4 = val1?val4:0;
            return parseFloat(val1)+parseFloat(val2)+parseFloat(val3)+parseFloat(val4);
        }

        $scope.claimSearch(1)
        //get Amount total
        $scope.getAmount=function(){
            //$scope.amount_total=0;
            $scope.meterial_total=0;
            $scope.labor_total=0;
            $scope.expense_total=0;
            $scope.approved_amount_total=0;
            angular.forEach($scope.resData,function(value,key){
                //$scope.amount_total+=value.amount?parseInt(value.amount):0;
                $scope.meterial_total+=value.meterial?parseInt(value.meterial):0;
                $scope.labor_total+=value.labor?parseInt(value.labor):0;
                $scope.expense_total+=value.expense?parseInt(value.expense):0;
                $scope.approved_amount_total+=value.approved_amount?parseInt(value.approved_amount):0;
            });

        }

        //get sr_type
        getDataService.data(
            getApi.getsrtypes,
            'post',
            {
                'parameter': JSON.stringify({
                    "object_type":"S"
                })
            }
            , function (data) {
                $scope.srData = data.data;
            },
            'N'
        )

        // get Claim Line Status
        getDataService.data(
            getApi.statusType,
            'post',
            {
                'parameter': JSON.stringify({
                    "object_type": 'L'
                })
            },
            function (response) {
                $scope.claimLineStatusData = response.data;
            },
            'N'
        )

        $scope.addClaimLines = function (page) {
            var profile=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile
            $scope.user_id = profile.user_id;
            $scope.org_id = profile.org_id;
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/claim_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.showPrevNext = true;
                                $scope.title = "Claim Lines Available";
                                $rootScope.lov_data = {};
                                $scope.currentPage = page;
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.search={};

                                //init select
                                $scope.searFuc = function (name) {
                                    $scope.ClaimLineType = name;
                                }
                                $scope.searFuc2 = function (name) {
                                    $scope.SRTYPE = name;
                                }
                                $scope.$on('ngDialog.opened', function () {
                                    if($scope.resData){
                                        $scope.selected_sr_arr=[];
                                        angular.forEach($scope.resData,function(value,key){
                                            $scope.selected_sr_arr.push(value.sr_id);
                                        });
                                        $scope.selected_sr= $scope.selected_sr_arr.join(',');
                                    }
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
                                    getDataService.data(
                                        getApi.claimSummary,
                                        'post',
                                        {
                                            "profile":JSON.stringify(profile),
                                            'parameter': JSON.stringify({
                                                'asp_user_id': parseInt($scope.user_id),
                                                "page_index": page,
                                                "page_size": 10,
                                                "where":{
                                                    "incident_number": $scope.incident_number,
                                                    "claim_line_status": $scope.search.radioValue,
                                                    "org_id":$scope.org_id,
                                                    "claim_type": $scope.claim_type,
                                                    //"close_date_from":$scope.close_date_from+" 00:00:00",
                                                    //"close_date_to":$scope.close_date_to+" 00:00:00",
                                                    "incident_type_id": parseInt($scope.search.radioValue2),
                                                    "selected_sr": $scope.selected_sr
                                                }
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                })

                                //query page
                                $scope.DoCtrlPagingAct = function (page) {
                                    getDataService.data(
                                        getApi.claimSummary,
                                        'post',
                                        {
                                            profile: JSON.stringify(profile),
                                            'parameter': JSON.stringify({
                                                'asp_user_id': parseInt($scope.user_id),
                                                "page_index": page,
                                                "page_size": 10,
                                                "where":{
                                                    "incident_number":$scope.incident_number,
                                                    "claim_line_status":$scope.search.radioValue,
                                                    "org_id":$scope.org_id,
                                                    "claim_type": $scope.claim_type,
                                                    "close_date_from": $scope.close_date_from,
                                                    "close_date_to": $scope.close_date_to,
                                                    "incident_type_id": parseInt($scope.search.radioValue2),
                                                    "selected_sr": $scope.selected_sr
                                                }
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $("input[name='claimInput']").each(function(key,val){
                                        if($(this).is(':checked')){
                                            var line = JSON.parse($(val).attr('ng-true-value'));
                                            $scope.resData.push(line);
                                            $scope.addAmount(line);
                                            $scope.markDataChanged();
                                        }
                                    });
                                    $scope.getAmount();
                                    //update $dirty
                                    $timeout(function(){
                                        $scope.claim_form.$dirty = true;
                                    }, 0);
                                }
                            }
                        })
                    }
                }
            )
        }

        //del selected_sr
        $scope.removeResData = function (index) {
            $scope.delClaimlineId= $scope.resData[index].claim_line_id;
            if($scope.delClaimlineId){
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
                        getApi.deleteclaimline,
                        'post',
                        {
                            'parameter': JSON.stringify({
                                "claim_line_id": $scope.delClaimlineId
                            })
                        },
                        function (response) {
                            menuData.data()
                            if(response.Status=="S"){
                                location.reload()
                                $scope.resData.remove(index);
                                $scope.getAmount();
                            }else{
                                swal({
                                    title: 'Delete Fail',
                                    type: "error"
                                })
                            }
                        }
                    )
                });
            }else{
                $scope.resData.remove(index);
                $scope.getAmount();
            }
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


        //getApprove
        $scope.getApprove= function(page){
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/approve_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.sr_cminfo_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Approve History";
                                $rootScope.lov_data = {};
                                $scope.currentPage = page;
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init
                                    getDataService.data(
                                        getApi.getclaimappvhis,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": 1,
                                                "page_size": 10,
                                                "claim_id": parseInt($scope.claim_id)
                                            })
                                        },
                                        function (response) {
                                            $scope.approveData = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                })

                                //query page
                                $scope.DoCtrlPagingAct = function (page) {
                                    getDataService.data(
                                        getApi.getclaimappvhis,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "page_index": 1,
                                                "page_size": 10,
                                                "claim_id": parseInt($scope.claim_id),
                                            })
                                        },
                                        function (response) {
                                            $scope.data =      response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage =   $scope.totalPage;
                                        }
                                    )
                                };
                            }
                        })
                    }
                }
            )
        }


        //updateClaimSubmit
        $scope.claimUpdateSubmit=function(valid,successFunction){
            if($scope.resData && $scope.resData.length>0){
                $scope.updateClaimLineData=[];
                angular.forEach($scope.resData,function(value,key){
                    $scope.updateClaimLineData[key]={
                        "claim_line_id":parseInt(value.claim_line_id),
                        "incident_id":parseInt(value.sr_id),
                        "meterial":value.meterial?parseInt(value.meterial):0,
                        "labor":value.labor?parseInt(value.labor):0,
                        "expense":value.expense?parseInt(value.expense):0,
                        "amount":value.amount?parseInt(value.amount):0,
                        "approved_amount":value.approved_amount?parseInt(value.approved_amount):0,
                        "tax_m":value.tax_m?+value.tax_m:0,
                        "tax_l":value.tax_l?+value.tax_l:0,
                        "tax_e":value.tax_e?+value.tax_e:0
                    }
                    $scope.updateClaimLineData[key].amount = $scope.updateClaimLineData[key].amount+parseFloat(value.tax_m)+parseFloat(value.tax_l)+parseFloat(value.tax_e);
                });
                $scope.getAmount();
                getDataService.data(
                    getApi.updateclaim,
                    'post',
                    {
                        'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        'claim_entity': JSON.stringify({
                            "claim_id":parseInt($scope.claim_id),
                            "claim_status":$scope.claim_status_code,
                            "submited_date":$scope.submited_date,
                            "meterial":$scope.meterial_total?parseInt($scope.meterial_total):0,
                            "labor":$scope.labor_total?parseInt($scope.labor_total):0,
                            "expense":$scope.expense_total?parseInt($scope.expense_total):0,
                            "amount":$scope.amount_total?parseInt($scope.amount_total):0,
                            "approved_amount":$scope.approved_amount_total?parseInt($scope.approved_amount_total):0,
                            "comments":$scope.asp_comments,
                            "claim_type":$scope.claim_type,
                            "claim_line":$scope.updateClaimLineData
                        })
                    },
                    function (response) {
                        //更新Recent items
                        menuData.data()
                        if (response.Status == "S") {
                            if(!successFunction) successFunction = $scope.updateSuccessFunction;
                            successFunction(response);
                        }
                        else if (response.Status == "E") {
                            $rootScope.lodingbox = false
                            swal({
                                title: response.Message,
                                type: "error"
                            })
                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'update error',
                                type: "error"
                            })
                        }
                    }
                )
            }else{
                swal({
                    title: 'Can Not Save For No Claim lines!',
                    type: "error"
                })
            }
        }

        $scope.submitForApproval = function(){
            if($scope.dataChanged){
                $scope.dataChanged = false;
                $scope.claimUpdateSubmit(null,$scope.submitForApproval);
                return;
            }
            $scope.disabledFlag=true;
            $scope.claimLineData=[];
            $rootScope.lodingbox = true
            angular.forEach($scope.resData,function(value,key){
                $scope.claimLineData[key]={
                    "claim_line_id":parseInt(value.claim_line_id),
                    "amount":value.amount?parseInt(value.amount):0,
                    "comments":parseInt(value.comments),
                    "tax_m":value.tax_m?+value.tax_m:0,
                    "tax_l":value.tax_l?+value.tax_l:0,
                    "tax_e":value.tax_e?+value.tax_e:0
                }
            });
            getDataService.data(
                getApi.submitclaim,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'claim_entity': JSON.stringify({
                        "claim_id":parseInt($scope.claim_id),
                        "comments":$scope.asp_comments,
                        'amount': $scope.amount_total?parseInt($scope.amount_total):0,
                        "claim_line":$scope.claimLineData
                    })
                },
                function (response) {
                    if (response.Status == "S") {
                        $rootScope.lodingbox = false
                        $scope.claim_number=response.Message;
                        $scope.disabledFlag= true;
                        swal({
                            title: response.Message,
                            type: "success"
                        }, function () {
                            $rootScope.reload();
                        })
                    }
                    else if (response.Status == "E") {
                        $rootScope.lodingbox = false

                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }
                    else {
                        swal({
                            title: 'update error',
                            type: "error"
                        })
                    }
                },
                'N'
            )
        };

        //submitapprove
        $scope.approveSubmit=function(){
            //$scope.confirmToSubmit = false;
            //if($scope.dataChanged){
            //    sweetAlert({
            //        title: "Are you sure?",
            //        text: "Your data had been changed,don't save before submit for approval?",
            //        type: "warning",
            //        showCancelButton: true,
            //        confirmButtonColor: "#DD6B55",
            //        confirmButtonText: "Submit ",
            //        closeOnConfirm: true
            //    }, $scope.submitForApproval
            //    );
            //}else{
            //    $scope.submitForApproval();
            //}
            $scope.submitForApproval();
        };

        //show SR_number detail
        $scope.showDetail= function(index){
            $scope.sr_id= $scope.resData[index].sr_id;
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/show_sr_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.sr_cminfo_table = true;
                                $scope.showPrevNext = true;
                                $scope.title = "Sr Charge Detail";
                                $rootScope.lov_data = {};
                                $scope.currentPage = index;
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar

                                    getDataService.data(
                                        getApi.charge_summary,
                                        'post',
                                        {
                                            'parameter': JSON.stringify({
                                                "sr_id": parseInt($scope.sr_id),
                                                "organization_id":  JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                                                "language": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language
                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.charge;
                                        }
                                    )
                                });
                            }
                        })
                    }
                }
            )
        }
    });