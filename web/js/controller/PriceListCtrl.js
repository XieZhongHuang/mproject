/**
 * Created by fuguxu on 2016/8/8.
 */
IndonesiaApp
    .controller('PriceListCtrl',function($scope, $state, $rootScope, $http, $base64,Upload, getDataService,getDataService2, getApi, ngDialog, status, $filter){
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




        //自定义描述
        $scope.price_desc='';

        getDataService.data(
            getApi.getHeader,
            'post',
            {
                'profile': JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                'parameter': JSON.stringify(

                )

            },
            function (response) {
                $scope.priceFlag = response.F_ID_PRICE_M;
                if($scope.priceFlag=='Y'){
                    $scope.myStyle = {'backgroundColor': '#ededed'}
                }

                $scope.priceList=response.pricelist_header;
                console.log($scope.priceList)
                $scope.list_header_id=$scope.priceList[0].list_header_id;

                $scope.description=$scope.priceList[0].description;
                $scope.currency_code=$scope.priceList[0].currency_code;
                $scope.start_date_active=$scope.priceList[0].start_date_active;
                $scope.end_date_active=$scope.priceList[0].end_date_active;
                $scope.org_name=$scope.priceList[0].org_name;


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
            $scope.price_item='';
            $scope.inventory_item_id='';
            $scope.price_desc='';

        }


        //search
        $scope.DoCtrlPagingAct= function(page){
            //翻页的时候清空 只能保存当页数据
            $scope.pricelist_line = [];

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
                            "list_header_id":  parseInt($scope.list_header_id),
                            "organization_id":  null,
                            "inventory_item_id": $scope.inventory_item_id,
                            "inventory_item_desc":  $scope.price_desc
                        }
                    })
                },
                function (response) {
                    if(response.status=='S'){
                        $scope.serachDate=response.data;
                        $scope.totalPage = response.pagecount==0?1:response.pagecount;
                        $scope.endPage = $scope.totalPage;
                        //console.log($scope.serachDate,response)
                    }else if(response.status=='E'){
                        swal({
                            title: response.message,
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




        $scope.initsearchbutton=function(){
            $scope.totalPage = -1;
            $scope.serachDate = [];
        }


        $scope.comparetime = function(close_date,item,index){
            $scope.pricelist_line[index]=item;
            if(new Date(close_date)-new Date($scope.serachDate[index].start_date)<0){
                swal({
                    title: 'Start Date must start before End Date.',
                    type: "warning"
                })
                $scope.serachDate[index].close_date='';
                return
            }
        }


        //item lov
        $scope.itemlov = function (page) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/pricelist_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.price_item = angular.fromJson($rootScope.lov_data.radioValue).item_num;
                                    $scope.price_desc = angular.fromJson($rootScope.lov_data.radioValue).item_desc;
                                    $scope.inventory_item_id = angular.fromJson($rootScope.lov_data.radioValue).inventory_item_id

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.searchtype = [{
                                    "value": "item_num",
                                    "name":  "Item Number"
                                }, {"value": "item_desc", "name": "Item Desc"}];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                ;//设置option默认值
                                $scope.price_item = true
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
                                                "order_by":'SP'
                                                //"organization_id": $rootScope.InitalData.profile.organization_id,
                                                //"resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                //"appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                //"lang": $rootScope.InitalData.profile.language,
                                                //"category_id": parseInt($scope.category_id),
                                                //"where": $scope.where

                                            })
                                        },

                                        function (response) {
                                            $scope.data = response.data;
                                            console.log(response,$scope.data)
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
                                                "organization_id": $rootScope.InitalData.profile.organization_id,
                                                "resp_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.resp_id,
                                                "appl_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.appl_id,
                                                "lang": $rootScope.InitalData.profile.language,
                                                "category_id": parseInt($scope.category_id),
                                                "order_by":'SP',
                                                "where": $scope.where

                                            })
                                        },
                                        function (response) {
                                            $scope.data = response.data;
                                            console.log($scope.data);
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





        //save
        //$scope.pricelist_line = [];
        $scope.submitForm=function(){
            //console.log($scope.pricelist_line)
            $scope.pricelist_line_date = [];
            angular.forEach($scope.pricelist_line,function(v,k){
                if(v){
                    $scope.obj={};
                    $scope.obj.list_line_id = v.list_line_id;
                    $scope.obj.operand = parseFloat(v.unit_price);
                    $scope.obj.end_active_date= v.close_date;
                    $scope.obj.start_active_date= v.start_date;
                    $scope.pricelist_line_date.push($scope.obj);
                    if(!v.unit_price){
                        $scope.sumbitted=true;
                        /*swal({
                            title:'price not empty',
                            type:'error'
                        })
                        return false;*/
                    }
                }

            })

            console.log($scope.pricelist_line,$scope.pricelist_line_date)


            getDataService.data(
                getApi.upPriceDate,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    'parameter': JSON.stringify({
                        "list_header_id": $scope.list_header_id,
                        "pricelist_line": $scope.pricelist_line_date

                    })
                },

                function (response) {
                    if (response.Status == "S") {
                        swal({
                            title: response.Message,
                            type: "success"
                        })
                    }else if(response.Status == "E"){
                        swal({
                            title: response.Message,
                            type: "error"
                        })
                    }

                }
            )
        }




        //reset
        $scope.reset= function(){
            $scope.description='';
            $scope.currency_code='';
            $scope.start_date_active='';
            $scope.org_name='';
            $scope.price_desc = '';
            $scope.price_item = '';
        }

    }

);





