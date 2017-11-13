/**
 * Created by fuguxu on 2016/10/25.
 */

IndonesiaApp

    .controller('updateQaMzaCtrl', function ($scope, $base64,$timeout, $rootScope, status, $http, $stateParams, getDataService, getApi, ngDialog) {
        $("html,body").animate({scrollTop: $("html,body").offset().top}, 10);
        $scope.sr_id = $base64.urlsafe_decode($stateParams.sr_id)
        $scope.row_id = $base64.urlsafe_decode($stateParams.row_id)
        getDataService.data(
            getApi.getQAdetail,
            'POST',
            {
                'parameter': JSON.stringify({
                    "row_id":$scope.row_id
                })
            },
            function (rtn) {
                $timeout(function () {
                    $scope.qa_form.$dirty = false;
                }, 0);

                $scope.$watch('CATEGORY_CODE', function (n, o) {
                    if (n !== o) {
                        $scope.Subcategory_code = ''
                        $scope.Subcategory_desc = ''
                        $scope.Symptom_code = ''
                        $scope.Symptom_desc = ''
                        $scope.Reason_code = ''
                        $scope.Reason_desc = ''
                        $scope.Solution_code = ''
                        $scope.Solution_desc = ''
                    }
                })

                $scope.$watch('Subcategory_code', function (n, o) {
                    if (n !== o) {
                        $scope.Symptom_code = ''
                        $scope.Symptom_desc = ''
                        $scope.Reason_code = ''
                        $scope.Reason_desc = ''
                        $scope.Solution_code = ''
                        $scope.Solution_desc = ''
                    }
                })

                $scope.$watch('Symptom_code', function (n, o) {
                    if (n !== o) {
                        $scope.Reason_code = ''
                        $scope.Reason_desc = ''
                        $scope.Solution_code = ''
                        $scope.Solution_desc = ''
                    }
                })
                $scope.$watch('Reason_code', function (n, o) {
                    if (n !== o) {
                        $scope.Solution_code = ''
                        $scope.Solution_desc = ''
                    }
                })


                $scope.CATEGORY_CODE = rtn.cux_iris_prdocut_line;
                $scope.CATEGORY_DESC = rtn.cux_iris_prdocut_line_desc;
                $scope.Subcategory_code = rtn.cux_iris_product_subcategory;
                $scope.Subcategory_desc = rtn.cux_iris_product_subcategory_desc;
                $scope.Symptom_code = rtn.cux_iris_symptom;
                $scope.Symptom_desc=rtn.cux_iris_symptom_desc_en;
                $scope.Reason_code =rtn.cux_iris_reason ;
                $scope.Reason_desc =rtn.cux_iris_reason_desc_en;
                $scope.Solution_code =rtn.cux_iris_solution;
                $scope.Solution_desc=rtn.cux_iris_solution_desc_en;
                $scope.Diagnostic_Engineer = rtn.cux_diag_field_eng;
                $scope.Diagnostic_Comments=rtn.cux_diag_comments;
                $scope.Resolution_Comments=rtn.cux_res_comments;
            }
        )


        //console.log($scope.sr_type_name)
        $scope.QaTitle = 'Update QA'
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
                                                "vendor_id": JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.vendor_id,
                                                "sr_id": parseInt($scope.sr_id),
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code
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
                                                "sr_id": parseInt($scope.sr_id),
                                                "instance_code":JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.instance_code,
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
                                    if (obj == 'Symptom') {
                                        $scope.Symptom_code = angular.fromJson($rootScope.lov_data.radioValue).Symptom_code
                                        $scope.Symptom_desc = angular.fromJson($rootScope.lov_data.radioValue).Symptom_desc
                                    }
                                    else if (obj == 'Subcategory') {
                                        $scope.Subcategory_code = angular.fromJson($rootScope.lov_data.radioValue).Subcategory_CODE
                                        $scope.Subcategory_desc = angular.fromJson($rootScope.lov_data.radioValue).Subcategory_DESC
                                    }
                                    else if (obj == 'Reason') {
                                        $scope.Reason_code = angular.fromJson($rootScope.lov_data.radioValue).reason_code
                                        $scope.Reason_desc = angular.fromJson($rootScope.lov_data.radioValue).reason_desc

                                    } else if (obj == 'Solution') {
                                        $scope.Solution_code = angular.fromJson($rootScope.lov_data.radioValue).solution_code
                                        $scope.Solution_desc = angular.fromJson($rootScope.lov_data.radioValue).solution_desc
                                    }
                                    else if (obj == 'category_code') {
                                        $scope.CATEGORY_CODE = angular.fromJson($rootScope.lov_data.radioValue).CATEGORY_CODE
                                        $scope.CATEGORY_DESC = angular.fromJson($rootScope.lov_data.radioValue).CATEGORY_DESC

                                    }
                                }
                            },
                            controller: function ($scope, $rootScope) {
                                $scope.Engineer =false

                                if (obj == 'Subcategory') {
                                    $scope.Subcategory = true;
                                    $scope.title = 'Subcategory List'
                                } else {
                                    $scope.Subcategory = false
                                }
                                if (obj == 'Symptom') {
                                    $scope.Symptom = true;
                                    $scope.title = 'Symptom List'
                                } else {
                                    $scope.Symptom = false
                                }
                                if (obj == 'Reason') {
                                    $scope.Reason = true;
                                    $scope.title = 'Defect List'
                                } else {
                                    $scope.Reason = false
                                }
                                if (obj == 'Solution') {
                                    $scope.Solution = true;
                                    $scope.title = 'Solution List'
                                } else {
                                    $scope.Solution = false
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
                                                "prdocut_line": $scope.CATEGORY_CODE,
                                                "subcategory_code":$scope.Subcategory_code,
                                                "symptom_code": $scope.Symptom_code,
                                                "reason_code": $scope.Reason_code
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
                    getApi.updateQA,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        qa_entity: JSON.stringify({
                            "row_id":$scope.row_id,
                            "sr_id": parseInt($scope.sr_id),
                            "item_id": parseInt($scope.item_id),
                            "incident_type":$scope.sr_type_name,
                            "cux_iris_prdocut_line":$scope.CATEGORY_CODE,
                            "cux_iris_prdocut_line_desc":$scope.CATEGORY_DESC,
                            "cux_iris_product_subcategory":$scope.Subcategory_code,
                            "cux_iris_prod_subcategory_desc":$scope.Subcategory_desc,
                            "cux_iris_symptom":$scope.Symptom_code,
                            "cux_iris_symptom_desc_en":$scope.Symptom_desc,
                            "cux_iris_reason":$scope.Reason_code,
                            "cux_iris_reason_desc_en":$scope.Reason_desc,
                            "cux_iris_solution":$scope.Solution_code,
                            "cux_iris_solution_desc_en":$scope.Solution_desc,
                            "cux_diag_field_eng":$scope.Diagnostic_Engineer,
                            "cux_diag_comments":$scope.Diagnostic_Comments,
                            "cux_res_comments":$scope.Resolution_Comments
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