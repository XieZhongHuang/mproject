/**
 * Created by lingyin on 15/4/29.
 */

IndonesiaApp
    .controller('homeCtrl', function ($http, $scope, $timeout, menuData, $base64, getApi, $rootScope, getDataService) {
        //echarts
       /* $scope.option = {
            title: {
                text: 'SR QTY'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['Open','Close'],
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
                    name:'Open',
                    type:'line',
                    //stack: '总量',
                    smooth:true,
                    areaStyle: {normal: {
                        color:'#48bbc2'
                    }},
                    itemStyle:{normal:{
                        color:'#48bbc2'
                    }},
                    lineStyle:{normal:{

                    }},
                    data:[]
                },
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
                }
            ]
        };*/

        //获取元素
        /*$scope.getElementEcharts = function(){
            var myChart = echarts.init(document.getElementById('eChartsWarp'))
            myChart.setOption($scope.option)
        }*/

        //sr kpi
        getDataService.data(
            getApi.homepage,
            'post',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (response) {
                $scope.homepage = response

                /*angular.forEach($scope.homepage.sr_month,function(v,k){
                    $scope.option.xAxis[0].data[k] = v.title;
                    $scope.option.series[0].data[k] = parseInt(v.qty_open);
                    $scope.option.series[1].data[k] = parseInt(v.qty_close);
                })
                $scope.getElementEcharts()*/

                //$scope.srKpi = response.sr_month
                $scope.srDay = response.sr_day
                //$scope.maxKpi=response.max_month_qty
                $scope.rtat = 0

               /* var number01 = 0;
                var maxNumber = [response.rtat];
                var rtatfun = setInterval(function () {
                    if (number01 < maxNumber[0]) {
                        number01 += 1;
                        $('.rtat span').text(number01 + '%');
                    } else {
                        clearInterval(rtatfun)
                        $('.rtat span').text($scope.homepage.rtat + '%');
                    }
                }, 20)*/

                var number02 = 0;
                var maxNumber2 = [response.rrr_rtat];
                var rtatfun2 = setInterval(function () {
                    if (number02 < maxNumber2[0]) {
                        number02 +=1;
                        $('.rtat2 span').text(number02 + '%');
                    } else {
                        clearInterval(rtatfun2)
                        $('.rtat2 span').text($scope.homepage.rrr_rtat + '%');
                    }
                }, 20)

                var number03 = 0;
                var maxNumber3 = [response.scr_rtat];
                var rtatfun3 = setInterval(function () {
                    if (number03 < maxNumber3[0]) {
                        number03 += 1;
                        $('.rtat3 span').text(number03 + '%');
                    } else {
                        clearInterval(rtatfun3)
                        $('.rtat3 span').text($scope.homepage.scr_rtat + '%');
                    }
                }, 20)
                //$('#rtat').speedometer2({percentage: $scope.homepage.rtat || 0});
                $('#rtat2').speedometer({percentage: $scope.homepage.rrr_rtat || 0});
                $('#rtat3').speedometer2(
                    {
                        percentage: $scope.homepage.scr_rtat || 0
                    }
                );

                //jQuery('.tooltips').tooltip();//toooltip icon
                //jQuery('.popovers').popover();
                $scope.set_srkpi = function (a,b) {
                    $scope.maxKpi=b


                    if (a == "Month") {
                        //$scope.srKpi = $scope.homepage.sr_month

                        /*angular.forEach($scope.homepage.sr_month,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.qty_open;
                            $scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()*/
                        $scope.srDay = $scope.homepage.sr_month
                    }
                    else if (a == 'Week') {
                        //$scope.srKpi = $scope.homepage.sr_week

                        /*angular.forEach($scope.homepage.sr_week,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.qty_open;
                            $scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()*/
                        $scope.srDay = $scope.homepage.sr_week
                    }
                    else if (a == 'Day') {
                        //$scope.srKpi = $scope.homepage.sr_day

                        /*angular.forEach($scope.homepage.sr_day,function(v,k){
                            $scope.option.xAxis[0].data[k] = v.title;
                            $scope.option.series[0].data[k] = v.qty_open;
                            $scope.option.series[1].data[k] = v.qty_close;
                        })
                        $scope.getElementEcharts()*/
                        $scope.srDay = $scope.homepage.sr_day
                    }

                }


            }
            ,
            'N'
        );

        //notification
       /* getDataService.data(
            getApi.notification,
            'POST',
            {
                profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
            },
            function (response) {
                $scope.notificationData = response.data;
                console.log($scope.notificationData)
            }
        );*/
    })

