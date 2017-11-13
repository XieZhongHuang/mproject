/**
 * Created by lingyin on 15/10/15.
 */
IndonesiaApp

    .controller('NewQaCtrl', function ($scope, $base64, $rootScope, status, $http, $stateParams, getDataService, getApi, ngDialog) {
        $("html,body").animate({scrollTop: $("html,body").offset().top}, 10);
        $scope.sr_id = $base64.urlsafe_decode($stateParams.sr_id)
        $scope.item_id = $base64.urlsafe_decode($stateParams.item_id)
        $scope.sr_type_name = $base64.urlsafe_decode($stateParams.sr_type_name)
        getDataService.data(
            getApi.getQALOV,
            'POST',
            {
                'parameter': JSON.stringify({
                    "sr_id": parseInt($scope.sr_id)
                })
            },
            function (rtn) {
                $scope.CATEGORY_CODE=rtn.qa_lov.default_category_code
                $scope.CATEGORY_DESC=rtn.qa_lov.default_category_desc

            }
        )
        $scope.$watch('CATEGORY_CODE', function (n, o) {
            if (n !== o) {
                $scope.complaint_code = ''
                $scope.CONDITION_CODE=''
                $scope.CONDITION_DESC=''
                $scope.complaint_desc=''
                $scope.Symptom_code = ''
                $scope.Symptom_desc = ''
                $scope.Section_code = ''
                $scope.Section_desc = ''
                $scope.Defect_code = ''
                $scope.Defect_desc = ''
                $scope.Repair_code = ''
                $scope.Repair_desc = ''
                $scope.Date_of_Diagnostics = ''
            }
        })

        $scope.$watch('complaint_code', function (n, o) {
            if (n !== o) {
                $scope.Symptom_code = ''
                $scope.Symptom_desc = ''
                $scope.Section_code = ''
                $scope.Section_desc = ''
                $scope.Defect_code = ''
                $scope.Defect_desc = ''
                $scope.Repair_code = ''
                $scope.Repair_desc = ''
                $scope.Date_of_Diagnostics = ''
            }
        })
        $scope.$watch('Symptom_code', function (n, o) {
            if (n !== o) {
                $scope.Section_code = ''
                $scope.Section_desc = ''
                $scope.Defect_code = ''
                $scope.Defect_desc = ''
                $scope.Repair_code = ''
                $scope.Repair_desc = ''
                $scope.Date_of_Diagnostics = ''
            }
        })
        $scope.$watch('Section_code', function (n, o) {
            if (n !== o) {
                $scope.Defect_code = ''
                $scope.Defect_desc = ''
                $scope.Repair_code = ''
                $scope.Repair_desc = ''
                $scope.Date_of_Diagnostics = ''

            }
        })
        $scope.$watch('Defect_code', function (n, o) {
            if (n !== o) {
                $scope.Repair_code = ''
                $scope.Repair_desc = ''
                $scope.Date_of_Diagnostics = ''
            }
        })
        $scope.$watch('Repair_code', function (n, o) {
            if (n !== o) {
                $scope.Date_of_Diagnostics = ''

            }
        })

        //console.log($scope.sr_type_name)
        $scope.QaTitle = 'New QA'
        $scope.EngineerLov = function () {
            $scope.title = 'Diagnostic Engineer List'

            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/qa_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    $scope.Diagnostic_Engineer = angular.fromJson($rootScope.lov_data.radioValue).engineer_name

                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.Engineer = true
                                $scope.searchtype = [ {
                                    "value": "resource_name",
                                    "name": "Resource Name"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                $rootScope.lov_data = {};
                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.getQAEng,
                                        'POST',
                                        {
                                            'parameter': JSON.stringify({
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.vendor_id
                                            })
                                        },
                                        function (rtn) {
                                            $scope.lovData = rtn.engineer

                                        }
                                    )


                                })


                                $scope.choiceobj_name2=function(obj){
                                    $scope.obj_name2 = obj
                                }

                                //查询数据
                                $scope.DoCtrlPagingAct = function (page) {

                                    /*if ($scope.obj_select.value == null) {
                                        $scope.where = '';
                                    }

                                    else {
                                        var obj_name = $scope.obj_name2 == null ? '' : $scope.obj_name2;
                                        $scope.where = JSON.parse('{"' + $scope.obj_select.value + '":"' + obj_name + '"}');
                                    }*/

                                    getDataService.data(
                                        getApi.getQAEng,
                                        'POST',
                                        {
                                            'parameter': JSON.stringify({
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.vendor_id,
                                                //"where": $scope.where
                                                "resource_name":$scope.obj_name2
                                            })
                                        },
                                        function (rtn) {
                                            $scope.lovData = rtn.engineer

                                        }
                                    )

                                }

                            }
                        })
                    }
                })

        }

        $scope.qa_lov = function (obj) {
            status.data(
                function (data) {
                    if (data.status == "S") {
                        ngDialog.open({
                            className: "datatable-theme",
                            template: "dialog/qa_lov.html",
                            scope: $scope,
                            preCloseCallback: function (value) {
                                if (value == "2") {
                                    if (obj == 'Condition') {
                                        $scope.CONDITION_CODE = angular.fromJson($rootScope.lov_data.radioValue).CONDITION_CODE
                                        $scope.CONDITION_DESC = angular.fromJson($rootScope.lov_data.radioValue).CONDITION_DESC

                                    } else if (obj == 'Complaint') {
                                        $scope.complaint_code = angular.fromJson($rootScope.lov_data.radioValue).complaint_code
                                        $scope.complaint_desc = angular.fromJson($rootScope.lov_data.radioValue).complaint_desc
                                    }
                                    else if (obj == 'Symptom') {
                                        $scope.Symptom_code = angular.fromJson($rootScope.lov_data.radioValue).Symptom_code
                                        $scope.Symptom_desc = angular.fromJson($rootScope.lov_data.radioValue).Symptom_desc
                                    }
                                    else if (obj == 'Section') {
                                        $scope.Section_code = angular.fromJson($rootScope.lov_data.radioValue).Section_code
                                        $scope.Section_desc = angular.fromJson($rootScope.lov_data.radioValue).Section_desc

                                    } else if (obj == 'Defect') {
                                        $scope.Defect_code = angular.fromJson($rootScope.lov_data.radioValue).Defect_code
                                        $scope.Defect_desc = angular.fromJson($rootScope.lov_data.radioValue).Defect_desc
                                    } else if (obj == 'Repair') {
                                        $scope.Repair_code = angular.fromJson($rootScope.lov_data.radioValue).Repair_code
                                        $scope.Repair_desc = angular.fromJson($rootScope.lov_data.radioValue).Repair_desc

                                    }
                                    else if (obj == 'category_code') {
                                        $scope.CATEGORY_CODE = angular.fromJson($rootScope.lov_data.radioValue).CATEGORY_CODE
                                        $scope.CATEGORY_DESC = angular.fromJson($rootScope.lov_data.radioValue).CATEGORY_DESC

                                    }
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.Engineer =false
                                if (obj == 'Condition') {
                                    $scope.Condition = true;
                                    $scope.title = 'Condition List'
                                } else {
                                    $scope.Condition = false
                                }
                                if (obj == 'Complaint') {
                                    $scope.Complaint = true;
                                    $scope.title = 'Complaint List'
                                } else {
                                    $scope.Complaint = false
                                }
                                if (obj == 'Symptom') {
                                    $scope.Symptom = true;
                                    $scope.title = 'Symptom List'
                                } else {
                                    $scope.Symptom = false
                                }
                                if (obj == 'Section') {
                                    $scope.Section = true;
                                    $scope.title = 'Section List'
                                } else {
                                    $scope.Section = false
                                }
                                if (obj == 'Defect') {
                                    $scope.Defect = true;
                                    $scope.title = 'Defect List'
                                } else {
                                    $scope.Defect = false
                                }
                                if (obj == 'Repair') {
                                    $scope.Repair = true;
                                    $scope.title = 'Repair List'
                                } else {
                                    $scope.Repair = false
                                }
                                if (obj == 'category_code') {
                                    $scope.category_code = true;
                                    $scope.title = 'Category Code'
                                } else {
                                    $scope.category_code = false
                                }

                                $scope.reasonTable = true
                                $scope.showPrevNext = true;

                                $scope.searchtype = [{"value": "lookup_code", "name": "lookup code"}, {
                                    "value": "meaning",
                                    "name": "meaning"
                                }];
                                $scope.obj_select = {};
                                $scope.obj_select.value = $scope.searchtype[0].value;
                                $scope.seaTypeValue = $scope.searchtype[0].name;

                                $scope.searFuc = function (name) {
                                    $scope.seaTypeValue = name;
                                }
                                $rootScope.lov_data = {};

                                $scope.$on('ngDialog.opened', function () {
                                    $(".tableBodyScroll").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//初始化滚动条

                                    getDataService.data(
                                        getApi.getQALOV,
                                        'POST',
                                        {
                                            'parameter': JSON.stringify({
                                                "sr_id": parseInt($scope.sr_id),
                                                "Condition_code": $scope.CONDITION_CODE,
                                                "Category_code":$scope.CATEGORY_CODE,
                                                "Complaint_code": $scope.complaint_code,
                                                "Symptom_code": $scope.Symptom_code,
                                                "Section_code": $scope.Section_code,
                                                "Defect_code": $scope.Defect_code,
                                                "Repair_code": $scope.Repair_code
                                            })
                                        },
                                        function (rtn) {
                                            $scope.lovData = rtn.qa_lov

                                        }
                                    )


                                })


                            }
                        })
                    }
                })
        }
        //数据提交
        $scope.submitForm = function (valid) {
            valid.$dirty = false
            $scope.submitted = true
            if (valid.$valid) {
                $rootScope.lodingbox = true
                getDataService.data(
                    getApi.createQA,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        qa_entity: JSON.stringify({
                            "sr_id": parseInt($scope.sr_id),
                            "item_id": parseInt($scope.item_id),
                            "Condition_code": $scope.CONDITION_CODE,
                            "Condition_desc": $scope.CONDITION_DESC,
                            "Complaint": $scope.complaint_code,
                            "Complaint_desc":$scope.complaint_desc,
                            "Symptom": $scope.Symptom_code,
                            "Symptom_desc": $scope.Symptom_desc,
                            "Section": $scope.Section_code,
                            "Section_desc": $scope.Section_desc,
                            "Defect": $scope.Defect_code,
                            "Defect_desc": $scope.Defect_desc,
                            "Repair": $scope.Repair_code,
                            "Repair_desc": $scope.Repair_desc,
                            "Diagnostic_Comments": $scope.Diagnostic_Comments,
                            "Diagnostic_Engineer": $scope.Diagnostic_Engineer,
                            "Date_of_Diagnostics": $scope.Date_of_Diagnostics,
                            "Resolution_Comments": $scope.Resolution_Comments,
                            "sr_type": $scope.sr_type_name,
                            "category":$scope.CATEGORY_CODE
                        })
                    },
                    function (response) {
                        if (response.Status == "S") {
                            $rootScope.lodingbox = false

                            swal({
                                title: response.Message,
                                type: "success"

                            }, function () {
                                window.location.href = "index.html#/sr_update/1/" + $stateParams.sr_id

                            })
                        }
                        else if (response.Status == "E") {
                            $rootScope.lodingbox = false
                            swal({
                                title: response.Message,
                                type: "error"
                            })

                        }
                        else {
                            $rootScope.lodingbox = false
                            swal({
                                title: 'error',
                                type: "error"
                            })


                        }
                    }
                )
            }

        }

    })