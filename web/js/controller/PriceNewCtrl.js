/**
 * Created by fuguxu on 2016/8/8.
 */
IndonesiaApp
    .controller('PriceNewCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService, getApi, ngDialog, status, $filter,$stateParams){
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

        getDataService.data(
            getApi.getHeader,
            'post',
            {
                'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify(

                )

            },
            function (response) {
                $scope.priceList=response.pricelist_header;
                if($stateParams.priceListHeaderId){
                    $scope.list_header_id=$stateParams.priceListHeaderId;
                    angular.forEach($scope.priceList,function(v,k){
                        if(v.list_header_id == $stateParams.priceListHeaderId){
                            $scope.description=v.description;
                            $scope.currency_code=v.currency_code;
                            $scope.start_date_active=v.start_date_active;
                            $scope.end_date_active=v.end_date_active;
                            $scope.org_name=v.org_name;
                        }

                    })
                }else{
                    $scope.list_header_id=$scope.priceList[0].list_header_id;
                    $scope.description=$scope.priceList[0].description;
                    $scope.currency_code=$scope.priceList[0].currency_code;
                    $scope.start_date_active=$scope.priceList[0].start_date_active;
                    $scope.end_date_active=$scope.priceList[0].end_date_active;
                    $scope.org_name=$scope.priceList[0].org_name;
                }

            }
        )
        //选择不同价格
        $scope.choicePriceList = function(id){
            angular.forEach( $scope.priceList,function(v,k){
                if(v.list_header_id==id){
                    $scope.description=v.description;
                    $scope.currency_code=v.currency_code;
                    $scope.start_date_active=v.start_date_active;
                    $scope.end_date_active=v.end_date_active;
                    $scope.org_name=v.org_name;
                }
            })

        }



       /* $scope.DoCtrlPagingAct= function(page){
            var ref=window.location.href;
            $scope.totalPage = page;
            if(ref.indexOf('=')>-1){
                ref=ref.substring(ref.indexOf('=')+1);
                $scope.serial_number= $base64.urlsafe_decode(ref)
            }

            getDataService.data(
                getApi.getSearchDate,
                'post',
                {
                    'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "page_index":      page,
                        "page_size":       $scope.pageSize,
                        "where":{
                            "list_header_id":  $scope.list_header_id,
                            "organization_id":  null,
                            "inventory_item_id":      $scope.inventory_item_id,
                            "inventory_item_desc":  $scope.price_desc
                        }
                    })
                },
                function (response) {
                    $scope.serachDate=response.data;
                    //console.log($scope.serachDate,response)
                }
            )
        }*/

        $scope.enter = function(ev) {

            if (ev.keyCode == 13){
                $scope.DoCtrlPagingAct(1);
            }
        }


        $scope.comparetime = function(time,index){
            if($scope.pricelistnumberwrap[index].time){
                if(new Date(time)-new Date($scope.pricelistnumberwrap[index].time)<0){
                    swal({
                        title: 'Start Date must start before End Date.',
                        type: "warning"
                    })
                    $scope.pricelistnumberwrap[index].close_date = '';
                    return
                }
            }
        }

        //itempricelov
        $scope.itempricelov = function (page,index) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/pricenewlist_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {

                                if (value == "2") {

                                    var myDate = new Date();
                                    var monthNamesShort = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                                    var year = myDate.getFullYear();
                                    var day = myDate.getDate();
                                    $scope.time = (day>10?day:'0'+day)+ '-'+ monthNamesShort[myDate.getMonth()] + '-' +year.toString().slice(2,4);

                                    $scope.pricelistnumberwrap[index] = angular.fromJson($rootScope.lov_data.radioValue);
                                    $scope.pricelistnumberwrap[index].time = $scope.time;


                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "item_num",
                                    "name": "Item Number"
                                }, {"value": "item_desc", "name": "Item Desc"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                ;//设置option默认值
                                $scope.new_price_item = true;
                                $scope.showPrevNext = true;
                                $scope.title = "PriceList"
                                $rootScope.lov_data = {};
                                $scope.currentPage = 1;//默认显示第一页
                                $scope.totalPage = 1;
                                $scope.pageSize = 10;//默认条数
                                $scope.pages = [];
                                $scope.endPage = 1;
                                $scope.$on('ngDialog.opened', function () {

                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.getItemDate,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "order_by":'SP',
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "category_id": parseInt($scope.category_id),
                                                //"where": $scope.where
                                                "where":{
                                                    "create_flag":"Y",
                                                    "list_header_id":  $scope.list_header_id
                                                }

                                            })
                                        },

                                        function (response) {
                                            $scope.new_price_data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                })

                                //查询、分页数据
                                $scope.DoCtrlPagingAct = function (page) {
                                    if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }

                                    getDataService.data(
                                        getApi.getItemDate,
                                        'post',
                                        {
                                            profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                                            'parameter': JSON.stringify({
                                                "page_index": page,
                                                "page_size": $scope.pageSize,
                                                "order_by":'SP',
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "category_id": parseInt($scope.category_id),
                                                "where": $scope.where

                                            })
                                        },
                                        function (response) {
                                            $scope.new_price_data = response.data;
                                            $scope.totalPage = response.pagecount;
                                            $scope.endPage = $scope.totalPage;
                                        }
                                    )
                                };
                            }
                        })
                    }
                })
        }






        //itemlov
        //$scope.itemLov = function (page) {
        //    status.data(
        //        function (data) {
        //            if (data.status == "S") {
        //                ngDialog.open({
        //                    className: "datatable-theme",
        //                    template:  "dialog/ib_lov.html",
        //                    scope: $scope,
        //                    controller: function ($scope, $rootScope) {
        //                        $rootScope.lov_data = {};
        //                        $scope.itemFlag= true;
        //                        $scope.title = "Item List";
        //                        $scope.searchtype = [{
        //                            "value": "item_number",
        //                            "name":  "Item Number"
        //                        }, {"value": "item_desc", "name": "Item Desc"}];
        //                        $scope.obj_select= {};
        //                        $scope.obj_select.value= $scope.searchtype[0].value;
        //                        $scope.seaTypeValue=     $scope.searchtype[0].name;
        //                        $scope.searFuc= function(name){
        //                            $scope.seaTypeValue=name;
        //                        }
        //                        $scope.showPrevNext = true;
        //                        $scope.currentPage =     page;
        //                        $scope.totalPage =       1;
        //                        $scope.pageSize =       10;
        //                        $scope.pages =          [];
        //                        $scope.endPage =         1;
        //                        $scope.$on('ngDialog.opened', function () {
        //                            $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//init scrollbar
        //                            getDataService.data(
        //                                getApi.sr_item,
        //                                'post',
        //                                {
        //                                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
        //                                    'parameter': JSON.stringify({
        //                                        "page_index":      page,
        //                                        "page_size":       $scope.pageSize,
        //                                        "organization_id": $rootScope.InitalData.profile.organization_id,
        //                                        "resp_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
        //                                        "appl_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
        //                                        "lang":            $rootScope.InitalData.profile.language,
        //                                        "category_id":     parseInt($scope.category_id),
        //                                        "where":           $scope.where
        //                                    })
        //                                },
        //                                function (response) {
        //                                    $scope.data =         response.data;
        //                                    $scope.totalPage =    response.pagecount;
        //                                    $scope.endPage =      $scope.totalPage;
        //                                }
        //                            )
        //                        });
        //
        //                        //query scrollbar
        //                        $scope.DoCtrlPagingAct = function (page) {
        //                            if ($scope.obj_select.value == null) {
        //                                $scope.where = '';
        //                            }
        //                            else {
        //                                var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
        //                                $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
        //                            }
        //                            getDataService.data(
        //                                getApi.sr_item,
        //                                'post',
        //                                {
        //                                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
        //                                    'parameter': JSON.stringify({
        //                                        "page_index":      page,
        //                                        "page_size":       $scope.pageSize,
        //                                        "organization_id": $rootScope.InitalData.profile.organization_id,
        //                                        "resp_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
        //                                        "appl_id":         JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
        //                                        "lang":            $rootScope.InitalData.profile.language,
        //                                        "category_id":     parseInt($scope.category_id),
        //                                        "where":           $scope.where
        //                                    })
        //                                },
        //                                function (response) {
        //                                    $scope.data =         response.data;
        //                                    $scope.totalPage =    response.pagecount;
        //                                    $scope.endPage =      $scope.totalPage;
        //                                }
        //                            )
        //                        };
        //                    },
        //                    preCloseCallback: function (value) {
        //                        if (value == "2") {
        //                            if($rootScope.lov_data.radioValue){
        //                                $scope.lovData= JSON.parse($rootScope.lov_data.radioValue);
        //                                $scope.item_number= $scope.lovData.item_number;
        //
        //                            }
        //                        }
        //                    }
        //                });
        //            }
        //        }
        //    )
        //};


        //add
        $scope.pricelistnumberwrap=[{}];
        $scope.addpricelist=function(){
            $scope.pricelistnumberwrap.push( {});
        }

        //remove
        $scope.removepricelist=function(index){
            $scope.pricelistnumberwrap.splice(index,1);
        }



        //save
        $scope.submitPriceNewForm=function(){

           $scope.pricelist_line_date = [];
            angular.forEach($scope.pricelistnumberwrap,function(v,k){
                if(v){
                    $scope.obj={};

                    $scope.obj.inventory_item_id = v.inventory_item_id;
                    $scope.obj.product_uom_code = v.uom_code;
                    $scope.obj.operand = v.newprice;
                    $scope.obj.start_active_date = v.time;
                    $scope.obj.end_active_date= v.close_date;

                    $scope.pricelist_line_date.push($scope.obj);
                }

            })
            console.log($scope.pricelist_line_date)

            getDataService.data(
                getApi.newPriceDate,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "list_header_id": parseInt($scope.list_header_id),
                        "pricelist_line": $scope.pricelist_line_date

                    })
                },

                function (response) {
                    if (response.Status == "S") {
                        swal({
                            title: response.Message,
                            type: "success"
                        })
                        $scope.pricelistnumberwrap=[{}];
                    }else {
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }

                }
            )
        }





        //$scope.queryObj = function (id) {
        //    $scope.instance_id =  id;
        //};
        //
        //$scope.goUpdateIB = function () {
        //    if ( !$scope.instance_id )
        //        return ;
        //    window.location.href="#/ib_update/"+$filter('urlFilter')($scope.instance_id);
        //};
        //
        //$scope.goExChangeIB = function () {
        //    if ( !$scope.instance_id )
        //        return;
        //    window.location.href="#/id_ex_change/"+$filter('urlFilter')($scope.instance_id);
        //
        //};

        //reset
        $scope.reset= function(){
            $scope.description='';
            $scope.currency_code='';
            $scope.start_date_active='';
            $scope.org_name='';
        }

    }

);






