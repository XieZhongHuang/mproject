/**
 * Created by Augus on 2015/8/12.
 */
IndonesiaApp.
    controller('NewPartsRequirementCtrl', function ($http, $base64,$scope, getDataService, getApi) {
    $scope.Data = [{id: 'Open', text: 'Open'}, {id: 'PendingApproval', text: 'Pending Approval'}, {id: 'Approved', text: 'Approved'}, {id: 'Reject', text: 'Reject'}, {id: 'Close', text: 'Close'}];
        $scope.summaryList=[{
            requirement_no: "requirement_no",
            sp_status: "sp_status",
            original_sr: "original_sr",
            description: "description",
            account_number: "143440",
            total_amount: "21312",
            item: [{
            item_required: "item_required",
            quantity: "quantity",
            uom: "uom",
            description: "description",
            unit_price: "unit_price",
            amount: "amount"
            }]
        }];
        $scope.submitForm = function (valid,publicTemp) {
            $scope.submitted = true;
            if (valid.$valid) {
                $rootScope.lodingbox = true;
                getDataService.data(
                    getApi.createCustomer,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse(sessionStorage.getItem('InitalData')).profile),
                        cust_entity: JSON.stringify({
                            asp: $scope.asp,
                            address: $scope.address,
                            requirementno: $scope.requirementno,
                            needbydate: $scope.needbydate,
                            description: $scope.description,
                            totalamount: $scope.totalamount
                        })
                    },
                    function (response) {
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false;
                            $scope.customer_id=response.customer_id;
                            swal({
                                title: response.Message,
                                type: "success"
                            }, function (){
                                    $scope.requirement_no=response.requirement_no;
                                    $scope.sp_status=response.sp_status;
                                    $scope.original_sr= response.original_sr;
                                    $scope.description= response.description;
                                    $scope.account_number= response.account_number;
                                //publicTemp
                                if(publicTemp){
                                    $scope.toParentData={
                                        'customer_type': $scope.customer_type,
                                        'obj_name': $scope.obj_name,
                                        'email': $scope.email,
                                        'phone': $scope.phone,
                                        'address': $scope.address,
                                        'country_name': $scope.country_name,
                                        'province': $scope.province,
                                        'city': $scope.city,
                                        'district': $scope.district,
                                        'postal_code': $scope.postal_code,
                                        'customer_id': $scope.customer_id,
                                        'cust_account_id':response.cust_account_id,
                                        'account_number':response.account_number
                                    };
                                    $scope.toParentDataStr=JSON.stringify($scope.toParentData);
                                    $scope.$emit('to-parent', $scope.toParentDataStr);
                                    ngDialog.closeAll();
                                    return;
                                }
                                window.location.href = "index.html#/FUNCTIOIN_VIETNAME5"
                            });
                        }
                        else if (response.Status == "E") {
                            $rootScope.lodingbox = false;
                            swal({
                                title: response.Message,
                                type: "error"
                            })
                        }
                        else {
                            $rootScope.lodingbox = false;
                            swal({
                                title: 'error',
                                type: "error"
                            })
                        }
                    }
                )
            }
        }
    });