angular.module('directives', [])
    .directive('datetimepicker', function ($http, getApi, getDataService, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                select: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.on('change', function () {
                    element.next().focus()
                })
                var optionsObj = {};
                if(attrs.plugintype == 'month'){
                    optionsObj.timeFormat = '';
                    optionsObj.dateFormat = 'yy-mm';
                    optionsObj.changeMonth = true;
                    optionsObj.changeYear = true;
                    optionsObj.showButtonPanel = true;
                }else{
                    optionsObj.timeFormat = 'HH:mm:ss';
                    optionsObj.dateFormat = 'yy-mm-dd';
                }

                optionsObj.changeYear=true;
                //optionsObj.minDate = 0
                // optionsObj.hourMin= scope.hourMin
                //optionsObj.useLocalTimezone=true
                //optionsObj.timezone='GMT+7'
                var updateModel = function (dateTimeTxt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateTimeTxt);
                    });

                };
                optionsObj.onSelect = function (dateTimeTxt, picker) {
                    var myDate = new Date();
                    element.datepicker('hide', 1000)
                    if (picker.selectedDay == myDate.getDate()&&picker.selectedMonth==myDate.getMonth()&&picker.selectedYear==myDate.getFullYear()) {
                        getDataService.data(
                            getApi.get_date, 'POST', {profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile)}, function (rtn) {
                                element.datepicker('setDate', rtn);
                            }
                        )
                    }
                    updateModel(dateTimeTxt);
                    if (scope.select) {
                        scope.$apply(function () {
                            scope.select({date: dateTimeTxt});
                        });
                    }
                };

                element.datetimepicker(optionsObj);

            }
        };
    })
    .directive('datetimepickernosecond', function ($http, getApi, getDataService, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                select: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.on('change', function () {
                    element.next().focus()
                })
                var optionsObj = {};
                optionsObj.timeFormat = '';
                optionsObj.timeText = '';
                optionsObj.showHour = false;
                optionsObj.showMinute = false;
                optionsObj.showSecond = false;
                optionsObj.dateFormat = 'yy-mm-dd';
                //optionsObj.minDate=1;
                optionsObj.changeYear=true;
                //optionsObj.minDate = 0
                // optionsObj.hourMin= scope.hourMin
                //optionsObj.useLocalTimezone=true
                //optionsObj.timezone='GMT+7'
                var updateModel = function (dateTimeTxt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateTimeTxt);
                    });

                };
                optionsObj.onSelect = function (dateTimeTxt, picker) {
                    var myDate = new Date();
                    element.datepicker('hide', 1000)
                    if (picker.selectedDay == myDate.getDate()) {
                        getDataService.data(
                            getApi.get_date, 'POST', {profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile)}, function (rtn) {
                                element.datepicker('setDate', rtn);
                            }
                        )
                    }
                    updateModel(dateTimeTxt);
                    if (scope.select) {
                        scope.$apply(function () {
                            scope.select({date: dateTimeTxt});
                        });
                    }
                };

                element.datetimepicker(optionsObj);

            }
        };
    })

    .directive('datetimepickerdmy', function ($http, getApi, getDataService, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                select: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.on('change', function () {
                    element.next().focus()
                })
                var optionsObj = {};
                optionsObj.timeFormat = '';
                optionsObj.timeText = '';
                optionsObj.showHour = false;
                optionsObj.showMinute = false;
                optionsObj.showSecond = false;
                optionsObj.dateFormat = 'dd-M-y';
                optionsObj.changeYear=true;
                optionsObj.navigationAsDateFormat  =true;
                optionsObj.monthNamesShort = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
                //optionsObj.minDate = 0
                // optionsObj.hourMin= scope.hourMin
                //optionsObj.useLocalTimezone=true
                //optionsObj.timezone='GMT+7'
                var updateModel = function (dateTimeTxt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateTimeTxt);
                    });
                };
                optionsObj.onSelect = function (dateTimeTxt, picker) {

                    dateTimeTxt = dateTimeTxt.slice(0,10)
                    //var myDate = new Date();
                    element.datepicker('hide', 1000)
                    /*if (picker.selectedDay == myDate.getDate()) {
                        getDataService.data(
                            getApi.get_date, 'POST', {profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.InitalData)).profile)}, function (rtn) {
                                element.datepicker('setDate', rtn);
                            }
                        )
                    }*/
                    updateModel(dateTimeTxt);
                    if (scope.select) {
                        scope.$apply(function () {
                            scope.select({date: dateTimeTxt});
                        });
                    }
                };

                element.datetimepicker(optionsObj);

            }
        };
    })

    .directive('datetimepickerEnd', function ($http, getApi, getDataService, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                select: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.on('change', function () {
                    element.next().focus()
                })

                var optionsObj = {};
                if(attrs.plugintype == 'month'){
                    optionsObj.timeFormat = '';
                    optionsObj.dateFormat = 'yy-mm';
                    optionsObj.changeMonth = true;
                    optionsObj.changeYear = true;
                    optionsObj.showButtonPanel = true;
                }else{
                    optionsObj.timeFormat = 'HH:mm:ss';
                    optionsObj.dateFormat = 'yy-mm-dd';
                }
                optionsObj.changeYear=true;
                var updateModel = function (dateTimeTxt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateTimeTxt);
                    });

                };
                optionsObj.onSelect = function (dateTimeTxt, picker) {

                    element.datepicker('hide', 1000)
                    var endDate = dateTimeTxt.replace(dateTimeTxt.substring(11,19),"23:59:59");
                    element.datepicker('setDate', endDate);

                    updateModel(dateTimeTxt);
                    if (scope.select) {
                        scope.$apply(function () {
                            scope.select({date: dateTimeTxt});
                        });
                    }
                };

                element.datetimepicker(optionsObj);
            }
        };
    })

    .directive('datetimepicker2', function ($http, getApi, getDataService, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                select: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                if (!ngModel) return;
                element.on('change', function () {
                    element.next().focus()
                })

                var optionsObj = {};
                optionsObj.timeFormat = 'HH:mm:ss';
                optionsObj.dateFormat = 'yy-mm-dd';
                //optionsObj.minView= 'month';
                optionsObj.changeYear=true;
                var updateModel = function (dateTimeTxt) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateTimeTxt);
                    });
                };
                optionsObj.onSelect = function (dateTimeTxt, picker) {
                    element.datepicker('hide', 1000);
                    element.datepicker('setDate', dateTimeTxt);
                    updateModel(dateTimeTxt);
                    if (scope.select) {
                        scope.$apply(function () {
                            scope.select({date: dateTimeTxt});
                        });
                    }
                };

                if (attrs.options) {
                    var options = eval("(" + attrs.options + ")");
                    if (options.type == 'date') {
                        element.datepicker(optionsObj);
                    }
                } else {
                    element.datetimepicker(optionsObj);
                }

            }
        };
    })

    .directive('clearValue', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                element.parent().find('input:first').on(' change', function () {

                    scope.$apply(function () {
                        ngModel.$setViewValue('');
                    });
                });
            }
        }
    })

    .directive('clearContact', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function ($scope, element, attr, ngModel) {
                $scope.$watch('province', function () {

                    if ($scope.province != undefined) {
                        $scope.city = ''
                        $scope.district = ''
                    }
                })
                $scope.$watch('city', function () {
                    if ($scope.city != undefined) {
                        $scope.district = ''
                    }
                })
            }
        }
    })

    .directive('hrefReplace', function (getApi, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',

            link: function (scope, element, attr, ngModel) {
                var InitalData = JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData')))
                if (attr.hrefReplace == "F_ID_KB") {
                    element.parent().parent().html('<a href="' + getApi.Knowledge + '" target="_blank">'+'<span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-book"></i></span>'+'<span class="singleMenuList">Knowledge Base</span></a>')
/*
                    element.parent().parent().html('<a href="' + getApi.Knowledge + 'username=' + InitalData.profile.km_user + '&password=' + InitalData.profile.km_user_pw + '" target="_blank">Knowledge Base</a>')
*/

                }
                if (attr.hrefReplace == "F_ID_HOME_AGT_SVC_ADMIN") {
                    element.parent().parent().html('<a href="#F_ID_HOME_AGT_SVC_ADMIN"><span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-home"></i></span><span  class="singleMenuList">Home</span></a>')
                }
                if (attr.hrefReplace == "F_ID_HOME_AGT_WHS_ADMIN") {
                    element.parent().parent().html('<a href="#F_ID_HOME_AGT_WHS_ADMIN"><span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-home"></i></span><span  class="singleMenuList">Home</span></a>')
                }
                if (attr.hrefReplace == "F_ID_HOME_INSTALL_ADMIN") {
                    element.parent().parent().html('<a href="#F_ID_HOME_INSTALL_ADMIN"><span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-home"></i></span><span  class="singleMenuList">Home</span></a>')
                }
                if (attr.hrefReplace == "F_ID_HOME_ASP_PLUS_ADMIN") {
                    element.parent().parent().html('<a href="#F_ID_HOME_ASP_PLUS_ADMIN"><span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-home"></i></span><span  class="singleMenuList">Home</span></a>')
                }
                if (attr.hrefReplace == "F_ID_HOME_ASP_ADMIN") {
                    element.parent().parent().html('<a href="#F_ID_HOME_ASP_ADMIN"><span class="icon-menu-left"  style="margin-right: 7px;"><i  class="icon-home"></i></span><span  class="singleMenuList">Home</span></a>')
                }
            }
        }
    })

    .directive('mouseEnter', function (getApi, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',

            link: function (scope, element, attr, ngModel) {
                element.on('mouseenter',function(){
                    element.find('.menuWrapPosition').addClass('menuWrapPositionShow')
                })
            }
        }
    })

    .directive('leaveEnter', function (getApi, $base64) {
        return {
            restrict: 'A',
            require: '?ngModel',

            link: function (scope, element, attr, ngModel) {
                element.on('mouseleave',function(){
                    element.find('.menuWrapPosition').removeClass('menuWrapPositionShow')
                })
            }
        }
    })

    .directive('searchWhere', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                element.prev().on('click', function () {
                    scope.$apply(function () {
                        scope.searchWhere = ngModel.$modelValue;
                    });
                });
            }
        }
    })

    .directive('testDir', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                element.prop('type', attr.testDir)
            }
        }
    })


    .directive('slideToggle', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                if(localStorage.menuStatus&&attr.name ==JSON.parse(localStorage.menuStatus).id){
                    element.next('.menuWrapIn')[0].style.display = JSON.parse(localStorage.menuStatus).status
                    if(JSON.parse(localStorage.menuStatus).status=='block'){
                        element.find('.icon-angle-right').addClass('icon-angle-up');
                    }
                }else{
                    element.next('.menuWrapIn').slideUp();
                }

                element.bind('click', function () {
                    element.parent().siblings().children('.menuWrapIn').slideUp(300);
                    element.parent().siblings().children('a').children('.icon-angle-up').toggleClass('icon-angle-up');

                    element.next('.menuWrap').slideToggle(300,function(){
                        localStorage.menuStatus = JSON.stringify({id:attr.name,status:element.next('.menuWrap')[0].style.display})
                    });

                    element.find('span').toggleClass('icon-angle-up');
                });

            }
        }
    })

    .factory('select2Query', function ($timeout) {
        return {
            testAJAX: function () {
                var config = {
                    minimumInputLength: 1,
                    ajax: {
                        url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                        dataType: 'jsonp',
                        data: function (term) {
                            return {
                                q: term,
                                page_limit: 10,
                                apikey: "ju6z9mjyajq2djue3gbvv26t"
                            };
                        },
                        results: function (data, page) {
                            return {results: data.movies};
                        }
                    },
                    formatResult: function (data) {
                        return data.title;
                    },
                    formatSelection: function (data) {
                        return data.title;
                    }
                };

                return config;
            }
        }
    })

    .directive('select2', function (select2Query) {
        return {
            restrict: 'A',
            scope: {
                config: '=',
                ngModel: '=',
                select2Model: '='
            },
            link: function (scope, element, attrs) {

                // 初始化
                var tagName = element[0].tagName,
                    config = {
                        allowClear: false,
                        multiple: !!attrs.multiple,
                        minimumResultsForSearch: -1,
                        theme: "classic",
                        placeholder: attrs.placeholder || ''   // 修复不出现删除按钮的情况
                    };

                // 生成select
                if (tagName === 'SELECT') {
                    // 初始化
                    var $element = $(element);
                    delete config.multiple;

                    if(attrs.search){
                        config.minimumResultsForSearch=Number(attrs.search);
                    }
                    $element
                        .prepend('<option value=""></option>')
                        .val('')
                        .select2(config);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        setTimeout(function () {
                            $element.find('[value^="?"]').remove();    // 清除错误的数据
                            $element.select2('val', newVal);
                        }, 0);
                    }, true);
                    return false;
                }

                // 处理input
                if (tagName === 'INPUT') {
                    // 初始化
                    var $element = $(element);

                    // 获取内置配置
                    if (attrs.query) {
                        scope.config = select2Query[attrs.query]();
                    }

                    // 动态生成select2
                    scope.$watch('config', function () {
                        angular.extend(config, scope.config);
                        $element.select2('destroy').select2(config);
                    }, true);

                    // view - model
                    $element.on('change', function () {
                        scope.$apply(function () {
                            scope.select2Model = $element.select2('data');
                        });
                    });

                    // model - view
                    scope.$watch('select2Model', function (newVal) {
                        $element.select2('data', newVal);
                    }, true);

                    // model - view
                    scope.$watch('ngModel', function (newVal) {
                        // 跳过ajax方式以及多选情况
                        if (config.ajax || config.multiple) {
                            return false
                        }

                        $element.select2('val', newVal);
                    }, true);
                }
            }
        }
    })
    .directive('select3', function ($timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                ngModel: '='
            },
            link: function (scope, element, attr, ngModel) {
                element.parent().addClass('select3')
                element.parent().find('.icon-remove-sign').bind('click', function () {

                    scope.$apply(function () {
                        ngModel.$setViewValue('');
                        element.context.value = ''
                    })
                })

                scope.$watch('ngModel', function (n, o) {

                    if (typeof(n) == 'undefined' || n == '') {
                        element.parent().find('.icon-remove-sign').hide()

                    } else {
                        //element.focus()
                        element.parent().find('.icon-remove-sign').show()
                        ngModel.$setViewValue(n);

                    }

                })
            }
        }
    })
    .directive('notAllow', function () {
        return {
            restrict: 'AC',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                element.attr('readonly', 'readonly')
                element.addClass('notAllow')
                //element.parent().append('<i class="icon-minus-sign"></i>')
            }
        }
    })
    .directive('pagewrap', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                element.find('ul').addClass('pagination')
            }
        }
    })

    .directive('getValue', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                $(element).css('cursor', 'pointer');
                element.bind('dblclick', function () {
                    element.find('input').trigger('click');
                    scope.lov_data.radioValue = element.find('input').val();
                    $('.select').trigger('click');
                });

            }
        }
    })
    .directive('formtips', function () {
        return {
            restrict: 'AE',
            require: '?ngModel',
            scope: {
                ngShow: '='
            },
            template: '  <p class="red form-tips"  style="margin-left: {{w}}px !important; margin-top:-10px;"><i class="icon_error-circle_alt"></i><span class="ml5">{{title}}</span></p>',
            link: function (scope, element, attr, ngModel) {
                scope.w = element.parent().find('label').width()
                scope.title = attr.title
            }
        }
    })
    .directive('scrollBar', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                ngShow: '='
            },
            link: function (scope, element, attr, ngModel) {
                element.hover(function () {
                    var barW = parseInt(element.find('a:first').css('width')) - 30;
                    var barL = element.find('a:first').offset().left + 15;
                    $('.scroll-bar').css({'left': barL, 'width': barW});
                    $('.scroll-bar').addClass('show');
                }, function () {
                    $('.scroll-bar').removeClass('show');
                });
            }
        }
    })
    .directive('getCurrentvalue', function () {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attr, ngModel) {
                scope.getClaimData = function () {
                    //if (element.context.checked) {
                    //	scope.tempClaimLineData.push(JSON.parse(attr.ngTrueValue));
                    //} else {
                    //	scope.tempClaimLineData.pop();
                    //}
                }
            }
        }
    })

    .directive('backButton', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {
                element.bind('click', goBack);

                function goBack() {
                    history.back();
                    scope.$apply();
                }
            }
        }
    })
    .directive('warningForm', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attrs) {

                scope.$watch(attrs.name, function (newVal, oldVal) {
                    console.log(newVal);
                }, true);
            }
        }
    })


    .directive('addTable', function ($http, $compile) {
        var tpl = 'directives-tpls/add-table.html';

        return {
            restrict: 'A',
            replace: true,

            link: function (scope, element, attrs) {
                /*localStorage.nowTime=scope.nowTime.getTime()
                 scope.objIndex=localStorage.nowTime*/
                element.on('click', function () {
                    var nowTime = new Date()
                    var i = nowTime.getTime();
                    console.log(i);
                    var j = '<tr class="trtd"  item-part="" ng-model="a' + i + '"> ' +
                        '<input type="text" value="{transaction_type_id:{{item_number' + i + '}}"> ' +
                        '<td class="ted"><span class="icon-minus-sign red" ng-click="del()"></span></td>' +
                        ' <td> ' +
                        '<div class="ipt-item flexbox zz">' +
                        ' <div class="fex1 zz"> ' +
                        '<div class="flexbox zz">' +
                        '<i class="icon-search add-btn icon-color" ng-click="itemLov(1)"></i> ' +
                        '<input type="text" ng-model="item_number' + i + '" class=" bno form-control fex1 ng-isolate-scope ng-pristine ng-valid notAllow" select3=""not-allow="" readonly="readonly"> </div>' +
                        ' </div> ' +
                        '</div> ' +
                        '</td> ' +
                        '<td><input type="text" class="form-control fex1 notAllow bno" ng-model="item_desc"></td> ' +
                        '<td> ' +
                        '<select select2 class="form-control bno" ng-model="subinventory' + i + '" ng-change="subch()"> ' +
                        '<option value="{{item.subinventory_code}}" ng-repeat="item in inventory">{{item.subinventory_code}}</option> </option> </select>' +
                        ' </td>' +
                        ' <td>' +
                        '<p ng-bind="ohqty"></p>' +
                        '</td>' +
                        ' <td> ' +
                        '<select select2 class="form-control bno" ng-model="transtypeValue"> ' +
                        '<option value="{{item}}" ng-repeat="item in transtype">{{item.transaction_type_name}}</option> ' +
                        '</select>' +
                        ' </td> ' +
                        '<td>' +
                        '<input type="text" ng-bind="" class="form-control fex1 bno" ng-model="quantity"/>' +
                        '</td> ' +
                        '</tr>';

                    element.parents('#main-content').find('table').append($compile(j)(scope));


                    /*$http.get(tpl)
                     .then(function(response){


                     element.parents('#main-content').find('table').append($compile(

                     response.data



                     )(scope));
                     });


                     });*/

                })


            }
        }
    })


    .directive('itemPart', function ($http, $compile) {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {
                element.find('.icon-minus-sign').on('click', function () {
                    element.hide()

                })


            }
        }
    })


    .directive('toSearch', function ($base64) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs) {
                element.bind('click', function () {
                    //init
                    if (scope.keywords) {
                        var condition = scope.selectedSearch;
                        switch (condition) {
                            case 'Customer Name':
                                scope.customer_name = scope.keywords;
                                localStorage.customer_name = scope.customer_name;
                                window.location.href = "index.html#/F_ID_CUST_SUMMARY?customer_name=" + $base64.urlsafe_encode(scope.keywords);
                                $("#sub").trigger('click');
                                break;
                            case 'Service Request#':
                                scope.sr_number = scope.keywords;
                                localStorage.sr_number = scope.sr_number;
                                window.location.href = "index.html#/F_ID_SR_SEARCH?sr_number=" + $base64.urlsafe_encode(scope.keywords);
                                $("#sub").trigger('click');
                                break;
                            case 'Serial Number':
                                scope.serial_number = scope.keywords;
                                localStorage.serial_number = scope.serial_number;
                                window.location.href = "index.html#/F_ID_IB_SEARCH?serial_number=" + $base64.urlsafe_encode(scope.keywords);
                                $("#sub").trigger('click');
                                break;
                        }
                    }
                });
            }
        }
    })
    .directive('active', function () {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {
                element.find('label').on('click', function () {
                    element.find('label').removeClass('active')
                    $(this).addClass('active')

                })
            }
        }
    })

    .directive('srChart', function () {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {

                if (attrs.originalTitle == attrs.kpimax) {
                    var qty = 214
                } else if (attrs.originalTitle == '0') {

                    var qty = parseInt(attrs.originalTitle)
                }
                else {
                    var qty = 214 / parseInt(attrs.kpimax) * parseInt(attrs.originalTitle)

                }

                element.animate({height: "" + qty + "px"}, 400)
                $('.tooltips').tooltip();
            }
        }
    })
    .directive('speedMeter', function () {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {

                element.speedometer();

            }
        }
    })
    .directive('speedMeter2', function () {
        return {
            restrict: 'A',
            replace: true,
            link: function (scope, element, attrs) {

                element.speedometer2();

            }
        }
    })
    .directive('getFocus', function () {
        return {
            restrict: 'A',
            require: '?ngModel',

            replace: true,
            link: function (scope, element, attrs, ngModel) {

                element.on('change', function () {
                    element.focus()

                })


            }
        }
    })
    .directive('lovKeypress', function () {
        return {
            restrict: 'A',
            require: '?ngModel',

            replace: true,
            link: function (scope, element, attrs, ngModel) {

                element.bind('keypress', function (event) {
                    if (event.which === 13) {
                        element.parents('.search-box2').find('.icon-search').trigger('click');

                    }
                });


            }
        }
    })


    //搭配 type = number;
    .directive('validNum', function () {
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: link
        };

        function link(scope, element, attrs, ngModel) {
            ngModel.$viewChangeListeners.push(function (value) {
                if (ngModel.$modelValue < 0) {
                    ngModel.$setViewValue('');
                }
            })
        }
    })

    .directive('dragDrop', function () {
      return {
          restrict:'A',
          link: link
      };
        function link(scope, ele , attr) {


            var oBox = ele.parent()[0];
            var oBar = ele.find('.modal-header')[0];

            //drag-drop.js
            startDrag(oBar, oBox);
        }
    })

