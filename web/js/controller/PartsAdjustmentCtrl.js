/**
 * Created by Augus on 2015/9/2.
 */
IndonesiaApp.controller('PartsAjustmentCtrl', function ($scope, $base64, $rootScope, $http, status, getDataService, ngDialog, getApi, $timeout, getDataService2) {
    //init
    $scope.lov_data={};
    $scope.arr=[];

    getDataService2.data(
        getApi.get_subinventory,
        'post',
        {
            "parameter":{
                'transaction_type' :""
            }
        },
        function (response) {
            $scope.inventory = response.data;
        }
    );

    getDataService.data(
        getApi.TransType,
        'post',
        {
            parameter: JSON.stringify({
                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code
            })
        },
        function (response) {
            $scope.transtype = response.data;
        }
    );
    $scope.partsDatas =[

    ];

    $scope.newItem = function(){
        var item = {
            'item_number':'',
            'item_desc':'',
            'transaction_type_name':'',
            'transaction_type_id': '',
            'transaction_source_id': '',
            'inventory_item_id':'',
            'subinventory_code': '',
            'quantity':'',
            'tranx_type':'',
            'uom':''
        }
        $scope.arr.push(item);

    }

    $scope.newItem();

    $scope.del = function(i){
        $scope.arr.splice(i,1);

    }



    //item lov
    $scope.itemLov = function (page,index) {
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

                                $scope.arr[index]= {'item_number':responseData.item_number,'item_desc':responseData.item_desc,'inventory_item_id':responseData.inventory_item_id,'uom':responseData.uom};
                                $scope.inventory_item_id= responseData.inventory_item_id;
                                $scope.uom= responseData.uom;
                                $scope.subch(index);
                            }
                            $timeout(function () {
                                $scope.partsForm.$dirty = true;
                            }, 0);
                        },
                        controller: function ($scope, $rootScope) {
                            $scope.searchtype = [{
                                "value": "item_number",
                                "name": "Item Number"
                            }, {"value": "item_desc", "name": "Item Desc"}];
                            $scope.obj_select = {};
                            $scope.obj_select.value = $scope.searchtype[0].value;
                            $scope.seaTypeValue = $scope.searchtype[0].name;



                            $scope.searFuc = function (name) {
                                $scope.seaTypeValue = name;
                            }

                            $scope.sr_item = true
                            $scope.showPrevNext = true;
                            $scope.title = "Item List"
                            $rootScope.lov_data = {};
                            $scope.currentPage = 1;
                            $scope.totalPage = 1;
                            $scope.pageSize = 10;
                            $scope.pages = [];
                            $scope.endPage = 1;
                            $scope.$on('ngDialog.opened', function () {

                                $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});

                                getDataService.data(
                                    getApi.ReceiveItemList,
                                    'post',
                                    {
                                        //profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
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
                                        $scope.data = response.data;
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
                                    $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                }

                                getDataService.data(
                                    getApi.ReceiveItemList,
                                    'post',
                                    {
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
                                        $scope.data = response.data;
                                        $scope.totalPage = response.pagecount;
                                        $scope.endPage = $scope.totalPage;
                                    }
                                )
                            };
                        }
                    })
                }
            })
    };

    //location lov
    $scope.locationLov = function (page,index) {
        if($scope.arr[index].locator_ctl == 'Y'){
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
                                    console.log(responseData)
                                    $scope.arr[index].location_code= responseData.location_code;
                                    $scope.arr[index].location_id= responseData.location_id;
                                    $scope.subch(index);
                                }
                                $timeout(function () {
                                    $scope.partsForm.$dirty = true;
                                }, 0);
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
                                            //profile: JSON.stringify(JSON.parse(localStorage.getItem('InitalData')).profile),
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "where": {'subinventory_code':$scope.arr[index].subinventory_code}
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
                                            $scope.where={'subinventory_code':$scope.arr[index].subinventory_code}
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

    $scope.getV=function(val,index,inventory){
        $scope.arr[index].subinventory_code=val[index].subinventory.subinventory_code;
        $scope.arr[index].locator_ctl=val[index].subinventory.locator_ctl;
        //$scope.subinventory_locator_ctl= inventory[index].locator_ctl;
        if($scope.arr[index].locator_ctl == 'N'){
            $scope.arr[index].location_code = '';
            $scope.arr[index].location_id = '';
            $scope.arr[index].qty = '';
        }
        $scope.subch(index);
    }

    $scope.getV1=function(val,index){
        //console.log(val);
        var valObj=JSON.parse(val[index].transaction);
        $scope.arr[index].transaction= valObj.transaction;
        $scope.arr[index].transaction_type_id=valObj.transaction_type_id;
        $scope.arr[index].transaction_source_id=valObj.transaction_source_type_id;
        $scope.arr[index].transaction_type_name=valObj.transaction_type_name;
    }

    $scope.getV2=function(val,index){
        $scope.arr[index].quantity= parseInt(val[index].quantity);

    }

    $scope.subch = function(obj) {
        if ($scope.inventory_item_id && $scope.arr[obj].subinventory) {
            getDataService2.data(
                getApi.get_item_onhand,
                'post',
                {
                    'parameter': {
                        "page_index": 1,
                        "page_size": 10,
                        "user_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id,
                        "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                        "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                        "organization_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                        "lang": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.language,

                            "item_id": parseInt($scope.inventory_item_id),
                            "subinventory_code": $scope.arr[obj].subinventory.subinventory_code || "",
                            'locator_id':$scope.arr[obj].location_id || ""

                    }
                },
                function (response) {
                    //if (response.data && response.data.length>0) {
                        $scope.arr[obj].qty=response.onhand;
                    //}else{
                    //    $scope.arr[obj].qty=0;
                    //}
                }
            );
        }
    }

    $scope.submitForm = function (valid) {

        var arr2=$scope.arr;
        valid.$dirty = false;
        $scope.submitted = true;
        if (valid.$valid) {
           /* for(var i=0;arr2.length>i;i++){
                delete(arr2[i].item_number);
                delete(arr2[i].$$hashKey);
                delete(arr2[i].item_desc);
                delete(arr2[i].qty);
                delete(arr2[i].subinventory);
                delete(arr2[i].transaction);
            }*/

            $rootScope.lodingbox = true;
            getDataService.data(
                getApi.ReceiveSp,
                'post', {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    trans_entity: JSON.stringify({
                        "trans": arr2
                    })
                },
                function (response) {
                    if (response.Status == "S") {
                        $rootScope.lodingbox = false;
                        swal({
                            title: response.Message,
                            type: "success"
                        }, function () {
                            window.location.reload();
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
    $scope.itemem = function () {
        $scope.item_number = '';
        $scope.inventory_item_id = '';
        $scope.item_desc = '';
    }


});
