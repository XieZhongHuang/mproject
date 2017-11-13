/**
 * Created by fuguxu on 2016/9/24.
 */
IndonesiaApp
    .controller('LocatorCreateCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService,getDataService2, getApi, ngDialog, status, $filter,$stateParams){
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

        getDataService2.data(
            getApi.get_subinventory,
            'post',
            {
                "parameter":{
                    'create_locator_flag' :"Y",
                    "transaction_type":""
                }
            },
            function (response) {
                $scope.inventory = response.data;
            }
        );

        $scope.getV = function(obj,index){

            angular.forEach($scope.inventory,function(v,k){
                if(obj.subinventory_desc== v.subinventory_desc){
                    $scope.pricelistnumberwrap[index].item_desc = v.subinventory_desc
                    $scope.pricelistnumberwrap[index].subinventory_code = v.subinventory_code
                }
            })
            console.log(obj,index)
        }

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }


        function clone(myObj){
            if(typeof(myObj) != 'object') return myObj;
            if(myObj == null) return myObj;

            var myNewObj = new Object();

            for(var i in myObj)
                myNewObj[i] = clone(myObj[i]);

            return myNewObj;
        }

        //add
        $scope.pricelistnumberwrap=[{}];
        $scope.addpricelist=function(){
            $scope.submitted = false;
            $scope.length = parseInt($scope.pricelistnumberwrap.length-1);
            if($scope.length==-1){
                $scope.pricelistnumberwrap.push({});
            }else{
                var newObj = new Object();
                newObj.item_desc = $scope.pricelistnumberwrap[$scope.length].item_desc;
                newObj.subinventory_desc= $scope.pricelistnumberwrap[$scope.length].subinventory_desc;
                newObj.subinventory_code= $scope.pricelistnumberwrap[$scope.length].subinventory_code;

                $scope.pricelistnumberwrap.push(newObj);
            }
        }

        //remove
        $scope.removepricelist=function(index){
            $scope.pricelistnumberwrap.splice(index,1);
        }


        //判断locator不能一样

        /*$scope.chargeLocator = function(obj,item,location_code,index){
            console.log(obj,item,location_code)
            angular.forEach(obj,function(v,k){
                if(v!=item){
                    if(v.subinventory_code==item.subinventory_code){
                        if(location_code== v.location_code){
                            swal({
                                title: 'The locator has been existed.',
                                type: "warning"
                            })
                            return
                        }
                    }
                }

            })
        }*/


        //save
        $scope.submitForm=function(valid){
            valid.$dirty=false
            $scope.submitted = true
            if(!valid.$valid) return

            $scope.pricelist_line_date = [];
            angular.forEach($scope.pricelistnumberwrap,function(v,k){
                if(v){
                    $scope.obj={};

                    $scope.obj.subinv_code = v.subinventory_code;
                    $scope.obj.loc_name = v.location_code;
                    $scope.obj.loc_desc = v.location_desc;
                    /*$scope.obj.item_desc = v.item_desc;
                    $scope.obj.end_active_date= v.close_date;*/

                    $scope.pricelist_line_date.push($scope.obj);
                }

            })
            console.log($scope.pricelist_line_date)

            getDataService.data(
                getApi.create_locator,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "organization_id":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.organization_id,
                        "locators": $scope.pricelist_line_date
                    })
                },

                function (response) {
                    if (response.Status == "S") {
                        swal({
                            title: response.Message,
                            type: "success"
                        },function(){
                           location.reload();
                        })

                    }else {
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }

                }
            )
        }


    }

);






