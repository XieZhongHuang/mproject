/**
 * Created by fuguxu on 2016/9/6.
 */

IndonesiaApp
    .controller('homeInstallCtrl', function ($http, $scope, $timeout, menuData, $base64, getApi, $rootScope, getDataService) {
        //echarts
        $scope.option = {
            title: {
                text: 'SR RTAT'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Qty'],
                //orient:'',
                left:600,
                top:0,
                backgroundColor:'',
                width:50,
                height:100
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '1%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    position:'left',
                    //name:'SR QTY',
                    //min:'0',
                    //max:'580',
                    splitNumber:3
                }
            ],
            series : [
                {
                    name:'Qty',
                    type:'line',
                    //stack: '总量',
                    smooth:true,
                    /*areaStyle: {normal: {
                        color:'#48bbc2'
                    }},*/
                    itemStyle:{normal:{
                        color:'#48bbc2'
                    }},
                    lineStyle:{normal:{

                    }},
                    data:[]
                }/*,
                {
                    name:'Close',
                    type:'line',
                    //stack: '总量',
                    itemStyle:{normal:{
                        color:'#4a6aa0'
                    }},
                    smooth:true,
                    areaStyle: {normal: {
                        color:'#4a6aa0'
                    }},
                    lineStyle:{normal:{

                    }},
                    data:[]
                }*/
            ]
        };

        //获取元素
        $scope.getElementEcharts = function(){
            var myChart = echarts.init(document.getElementById('eChartsWarp'))
            myChart.setOption($scope.option)
        }

        //sr kpi
        getDataService.data(
            getApi.homepage,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (response) {
                $scope.homepage = response

                angular.forEach($scope.homepage.sr_day_z,function(v,k){
                    $scope.option.xAxis[0].data[k] = v.title;
                    $scope.option.series[0].data[k] = parseInt(v.rtat);
                    //$scope.option.series[1].data[k] = parseInt(v.qty_close);
                })
                $scope.getElementEcharts()

                /*$scope.srKpi = response.sr_month
                $scope.maxKpi=response.max_month_qty*/
                $scope.rtat = 0
                var number01 = 0;
                var maxNumber = [response.scr_rtat];
                var rtatfun = setInterval(function () {
                    if (number01 < maxNumber[0]) {
                        number01 += 1;
                        $('.rtat span').text(number01 + '%');
                    } else {
                        clearInterval(rtatfun)
                        $('.rtat span').text($scope.homepage.scr_rtat + '%');
                    }
                }, 20)
                $('#rtat').speedometer2({percentage: $scope.homepage.scr_rtat || 0});

                /*jQuery('.tooltips').tooltip();//toooltip icon
                jQuery('.popovers').popover();*/
                $scope.set_srkpi = function (a,b) {
                    $scope.maxKpi=b


                    if (a == "Month") {
                        //$scope.srKpi = $scope.homepage.sr_month

                        angular.forEach($scope.homepage.sr_month_z,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.rtat;
                            //$scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()
                    }
                    else if (a == 'Week') {
                        //$scope.srKpi = $scope.homepage.sr_week

                        angular.forEach($scope.homepage.sr_week_z,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.rtat;
                            //$scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()
                    }
                    else if (a == 'Day') {
                        //$scope.srKpi = $scope.homepage.sr_day

                        angular.forEach($scope.homepage.sr_day_z,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.rtat;
                            //$scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()
                    }

                }


            }
            ,
            'N'
        );

        //notification
        getDataService.data(
            getApi.notification,
            'POST',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (response) {
                $scope.notificationData = response.data;
            }
        );
    })

