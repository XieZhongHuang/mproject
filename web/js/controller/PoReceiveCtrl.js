/**
 * Created by fuguxu on 2017/1/12.
 */

IndonesiaApp
    .controller('PoReceiveCtrl',function($scope, $state, $rootScope, $http, $base64,Upload,getDataService2,$timeout, getDataService, getApi, ngDialog, status, $filter,$stateParams){
        /*** page init ***/

        $scope.noData=       false;
        $scope.currentPage =     1;
        $scope.totalPage =       0;
        $scope.pageSize =       10;
        $scope.pages =          [];
        $scope.endPage =         1;
        $scope.showPrevNext = true;

        $scope.DoCtrlPagingAct=function(){
            if(!$scope.sr_number)return;
            getDataService.data(
                getApi.get_po_info,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "po_receive":"po_receive",
                        sr_num: $scope.sr_number||'',
                        sr_creation_date:$scope.creation_date||'',
                        po_num:$scope.po_number||''
                    })

                },
                function (response) {
                    $scope.pocharge = response.po_info.charge;
                }
            )
        }

        getDataService2.data(
            getApi.get_subinventory,
            'post',
            {
                "parameter":{
                    'transaction_type' :""
                }
            },
            function (response) {
                $scope.subinventory = response.data;
            }
        );

        $scope.getV1=function(subinventory_code,index){
            $scope.pocharge[index].location_code= '';
            $scope.pocharge[index].location_id= '';
            angular.forEach($scope.subinventory,function(v,k){
                if(subinventory_code== v.subinventory_code){
                    $scope.pocharge[index].locator_ctl= v.locator_ctl;
                }
            })
        }

        $scope.changeTobereceived=function(index,qty){
            if($scope.pocharge[index].Received_Qty + qty >$scope.pocharge[index].qty){
                $scope.pocharge[index].tobereceived = 0;
            }
        }


        //location lov
        $scope.locationLov = function (page,index) {
            if($scope.pocharge[index].locator_ctl=='Y'){
                status.data(
                    function (data) {
                        if (data.status == "S") {
                            ngDialog.open({
                                className: "datatable-theme",
                                template: "dialog/npr_lov.html",
                                scope: $scope,
                                preCloseCallback: function (value) {
                                    if (value == "2") {
                                        var responseData= JSON.parse($scope.lov_data.radioValue);
                                        $scope.pocharge[index].location_code= responseData.location_code;
                                        $scope.pocharge[index].location_id= responseData.location_id;
                                    }

                                },
                                controller: function ($scope, $rootScope) {
                                    $scope.searchtype = [{
                                        "value": "locator_code",
                                        "name": "Locator Code"
                                    }, {"value": "locator_desc", "name": "Locator Description"}];
                                    $scope.obj_select = {};
                                    $scope.obj_select.value = $scope.searchtype[0].value;
                                    $scope.seaTypeValue = $scope.searchtype[0].name;
                                    $scope.searFuc = function (name) {
                                        $scope.seaTypeValue = name;
                                    }

                                    $scope.Location = true
                                    $scope.showPrevNext = true;
                                    $scope.title = "Locator"
                                    $rootScope.lov_data = {};
                                    $scope.currentPage = 1;
                                    $scope.totalPage = 1;
                                    $scope.pageSize = 10;
                                    $scope.pages = [];
                                    $scope.endPage = 1;
                                    $scope.$on('ngDialog.opened', function () {

                                        $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                                        getDataService.data(
                                            getApi.location,
                                            'post',
                                            {
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index": page,
                                                    "page_size": $scope.pageSize,
                                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                                    "lang": $rootScope.InitalData.profile.language,
                                                    "where": {'subinventory_code':$scope.pocharge[index].subinventory_code}
                                                })

                                            },

                                            function (response) {
                                                console.log(response)
                                                $scope.myList = response.data;
                                                $scope.totalPage = response.pagecount;
                                                $scope.endPage = $scope.totalPage;
                                            }
                                        )
                                    })

                                    $scope.DoCtrlPagingAct = function (page) {
                                        if ($scope.obj_select.value == null) {
                                            $scope.where = '';
                                        }

                                        else {
                                            var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                            if(obj_name){
                                                $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                            }else{
                                                $scope.where={'subinventory_code':$scope.pocharge[index].subinventory_code}
                                            }

                                        }


                                        getDataService.data(
                                            getApi.location,
                                            'post',
                                            {
                                                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                                'parameter': JSON.stringify({
                                                    "page_index": page,
                                                    "page_size": $scope.pageSize,
                                                    "organization_id": $rootScope.InitalData.profile.organization_id,
                                                    "serial_number": 1,
                                                    "lang": $rootScope.InitalData.profile.language,
                                                    "where": $scope.where

                                                })
                                            },
                                            function (response) {
                                                $scope.myList = response.data;
                                                $scope.totalPage = response.pagecount;
                                                $scope.endPage = $scope.totalPage;
                                            }
                                        )
                                    };
                                }
                            })
                        }
                    })
            }else{

            }

        };

        $scope.checkedAll=false;
        $scope.choiceAll=function(checked){
            if(!checked){
                angular.forEach($scope.pocharge,function(v,k){
                    v.checked=true;
                })
            }else{
                angular.forEach($scope.pocharge,function(v,k){
                    v.checked=false;
                })
            }
        }


        //save
        $scope.submitPriceNewForm=function(){
            $scope.pocharge_temp = [];
            angular.forEach($scope.pocharge,function(v,k){
                v.quantity= v.qty;
                if(v.checked){
                    $scope.pocharge_temp.push(v);
                }
            })

            if($scope.pocharge_temp.length==0) {return}
            getDataService.data(
                getApi.receive_po,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "sr_num": $scope.sr_number,
                        "trans": $scope.pocharge_temp
                    })
                },

                function (response) {
                    if (response.Status == "S") {
                        swal({
                            title: response.Message,
                            type: "success"
                        },function(){
                            $scope.sr_number='';
                            $scope.creation_date='';
                            $scope.po_number='';
                            //添加之后重置，将页面数据清空。
                            $scope.pocharge = [];
                            $scope.$apply();
                        });
                    }else {
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }
                }
            )
        }


        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }

        //reset
        $scope.reset= function(){
            $scope.sr_number='';
            $scope.creation_date='';
            $scope.po_number='';
        }
    }

);






