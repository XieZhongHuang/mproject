IndonesiaApp


    .controller('NewClaimCtrl', function ($scope, $rootScope, $http, Upload, $stateParams,menuData, $base64, getDataService, getDataService2, getApi, ngDialog, status) {
        /*** page init ***/
        //get Claim Head Status
        $scope.instance_code = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code;
        getDataService.data(
            getApi.statusType,
            'post',
            {
                'parameter': JSON.stringify({
                    "object_type": 'H'
                })
            },
            function (response) {
                $scope.claimTypeData      =  response.data;
                $scope.claim_default_type =  'ENTERED';
            },
            'N'
        )
        //get sr_type
        getDataService2.data(
            getApi.getsrtypes,
            'post',
            {
                'parameter': {
                    "object_type": 'S'
                }
            }
            , function (data) {
                $scope.srData = data.data;
            },
            'N'
        )
        //get claim_type
        getDataService2.data(
            getApi.getsrtypes,
            'post',
            {
                'parameter': {
                    "object_type": 'C',
                    "resp_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                    "appl_id":        JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id
                }
            }
            , function (response) {
                $scope.ClaimType      =  response.data;
                $scope.claim_type =  response.default_type;
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


        $scope.tempClaimLineData = [];
        $scope.resDataTemp = [];

        //add ClaimLines lov
        $scope.addClaimLines = function (page) {
            var profile=JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile
            $scope.user_id = profile.user_id;
            $scope.org_id = profile.org_id;
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template:  "dialog/claim_lov.html",
                            scope: $scope,
                            controller: function ($scope, $rootScope) {
                                $scope.showPrevNext = true;
                                $scope.title =       "Available Claim Lines";
                                $scope.currentPage = page;
                                $scope.totalPage =    1;
                                $scope.pageSize =    10;
                                $scope.pages =       [];
                                $scope.endPage =      1;
                                $scope.search=       {};

                                //init drawdown
                                $scope.searFuc = function (name) {
                                    if(name=="empty"){
                                        $scope.search.radioValue='';
                                        $scope.ClaimLineType = '';
                                    }else{
                                        $scope.ClaimLineType = name;
                                    }
                                }
                                $scope.searFuc2 = function (name) {
                                    if(name=="empty"){
                                        $scope.search.radioValue='';
                                        $scope.SRTYPE = '';
                                    }else{
                                        $scope.SRTYPE = name;
                                    }

                                }
                                $scope.$on('ngDialog.opened', function () {
                                    if ($scope.resData) {
                                        $scope.selected_sr_arr = [];
                                        angular.forEach($scope.resData, function (value, key) {
                                            $scope.selected_sr_arr.push(value.sr_id);
                                        });
                                        $scope.selected_sr = $scope.selected_sr_arr.join(',');
                                    }
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
                                    getDataService.data(
                                        getApi.claimSummary,
                                        'post',
                                        {
                                            profile: JSON.stringify(profile),
                                            'parameter': JSON.stringify({
                                                'asp_user_id': parseInt($scope.user_id),
                                                "page_index":  page,
                                                "page_size":   10,
                                                "where": {
                                                    "incident_number":   $scope.incident_number,
                                                    "claim_line_status": $scope.search.radioValue,
                                                    "org_id":$scope.org_id,
                                                    "claim_type":        $scope.claim_type,
                                                    "incident_type_id":  parseInt($scope.search.radioValue2),
                                                    "selected_sr":       $scope.selected_sr
                                                }
                                            })
                                        },
                                        function (response) {
                                            $scope.data =      response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage =   $scope.totalPage;
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
                                                "where": {
                                                    "incident_number":   $scope.incident_number,
                                                    "claim_line_status": $scope.search.radioValue,
                                                    "close_date_from": $scope.close_date_from,
                                                    "close_date_to": $scope.close_date_to,
                                                    "org_id":$scope.org_id,
                                                    "claim_type":        $scope.claim_type,
                                                    //"incident_type_id":  parseInt($scope.search.radioValue2),
                                                    "selected_sr":       $scope.selected_sr
                                                }
                                            })
                                        },
                                        function (response) {
                                            $scope.data =      response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage =   $scope.totalPage;
                                        }
                                    )
                                };
                            },
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    //$scope.resData= JSON.parse(localStorage.claimData);
                                    $("input[name='claimInput']").each(function(key,val){
                                        if($(this).is(':checked')){
                                            $scope.resDataTemp.push(JSON.parse($(val).attr('ng-true-value')));
                                        }
                                    });
                                    $scope.resData= $scope.resDataTemp;
                                }
                            }
                        });
                    }
                }
            )
        }

        //del array
        Array.prototype.remove = function (dx) {
            if (isNaN(dx) || dx > this.length) {
                return false;
            }
            for (var i = 0, n = 0; i < this.length; i++) {
                if (this[i] != this[dx]) {
                    this[n++] = this[i]
                }
            }
            this.length -= 1;
            return this;
        }

        //del selected_sr
        $scope.removeResData = function (index) {
            $scope.resData.remove(index);
        }

        $scope.submitForm = function (valid) {
            valid.$dirty=false
            $scope.submitted = true;
           if($scope.resData && $scope.resData.length>0){
               //get claim_line
               $scope.claimLineData = [];
               $scope.meterial_total = 0;
               $scope.labor_total = 0;
               $scope.expense_total = 0;
               $scope.amount_total = 0;
               $scope.approved_amount_total = 0;
               angular.forEach($scope.resData, function (value, key) {
                   $scope.claimLineData[key] = {
                       "incident_id":      parseInt(value.sr_id),
                       "meterial":         value.meterial?(+value.meterial):0,
                       "labor":            value.labor?(+value.labor):0,
                       "expense":          value.expense?(+value.expense):0,
                       "amount":           value.amount?(+value.amount):0,
                       "approved_amount":  value.approved_amount?(+value.approved_amount):0,
                       "tax_m":value.tax_m?+value.tax_m:0,
                       "tax_l":value.tax_l?+value.tax_l:0,
                       "tax_e":value.tax_e?+value.tax_e:0
                   }
                   $scope.amount_total += (+value.amount);
                   $scope.meterial_total += (+value.meterial);
                   $scope.labor_total += (+value.labor);
                   $scope.expense_total += (+value.expense);
                   $scope.approved_amount_total += (+value.approved_amount);
               });
               getDataService.data(
                   getApi.create_Claim,
                   'post',
                   {
                       profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                       claim_entity: JSON.stringify({
                           "claim_status": $scope.claim_default_type,
                           "submited_date": $scope.submited_date,
                           "meterial": $scope.meterial_total?(+$scope.meterial_total):0,
                           "labor": $scope.labor_total?(+$scope.labor_total):0,
                           "expense": $scope.expense_total?(+$scope.expense_total):0,
                           "amount": $scope.amount_total?(+$scope.amount_total):0,
                           "approved_amount":$scope.approved_amount_total?(+$scope.approved_amount_total):0,
                           "comments":     $scope.asp_comments,
                           "claim_type":   $scope.claim_type,
                           "invoice_num":$scope.invoice_num,
                           "claim_line":   $scope.claimLineData
                       })
                   },
                   function (response) {
                       //更新Recent items
                       menuData.data()
                       if (response.Status == "S") {
                           swal({
                               title: response.Message,
                               type:  "success"
                           }, function () {
                               //location.reload()
                               window.location.href = "index.html#/claim_update/" + $base64.urlsafe_encode(response.claim_id);
                           })
                       }
                       else if (response.Status == "E") {
                           swal({
                               title: response.Message,
                               type:  "error"
                           })
                       }
                       else {
                           swal({
                               title: 'Get Data Error',
                               type:  "error"
                           });
                       }
                   }
               )
           }else{
               swal({
                   title: 'Create Fail For No Claim Line!',
                   type:  "error"
               });
           }
        }
    });