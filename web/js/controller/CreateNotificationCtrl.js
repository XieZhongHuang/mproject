/**
 * Created by Veket on 2015/9/9.
 */
IndonesiaApp
    .controller('CreateNotificationCtrl', function ($http, $rootScope, $filter, $scope,Upload,$base64, globals,getDataService,getApi,AuthenticationService) {


        var initType=function(){
            getDataService.data(
                getApi.notification_type,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                },
                function (rtn) {
                    $scope.noti_type = rtn.noti_type;
                    $scope.typeSelect = rtn.noti_type[0].type_code;
                }
            );
        };

        var fileUploadValidate=function (file) {//�ļ��ϴ�У��
            var allowFileExt = ['doc','docx','xls','xlsx','ppt','pptx','txt','gif','jpg','jpeg','png','bmp','pdf'];
            if ( ! $filter('checkFileExt')(file.name, allowFileExt) ) {
                swal({ title: 'File type error', type: 'error' });
                return false;
            } else if(file.size > 5242880) {
                swal({title: "File size can't be more than 5 M",type: 'error'});
                return false;
            } else {
                return true;
            }
        };

        var fileDel=function(file){//�ļ�ɾ��
            Array.prototype.remove=function(dx)
            {
                if(isNaN(dx)||dx>this.length){return false;}
                for(var i=0,n=0;i<this.length;i++)
                {
                    if(this[i]!=this[dx])
                    {
                        this[n++]=this[i]
                    }
                }
                this.length-=1
            };
            $scope.rest_arr=$scope.files.remove(file);
            $('.file_item'+file).hide();
        };

        var fileUpload = function (files) {//�ļ��ϴ�
            if (files && files.length) {
                $rootScope.lodingbox = true;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    $scope.files = files;
                    Upload.upload({
                        url: getApi.file_upload + 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid + '?filetype=' + file.type + '&filename='+file.name+'',
                        fields: {},
                        file: file
                    }).progress(function (evt) {
                        $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total)+'%';
                    }).success(function (data, status, headers, config) {
                            if (data.status == "S") {
                                $scope.isremove = false;
                                $scope.item = {'filename': data.file, 'filetype': data.filetype,'original_name':data.original_name};
                                $scope.files_obj.push($scope.item);
                                $scope.files = files;
                                swal({
                                    title: data.message,
                                    type: "success"
                                })
                                $rootScope.lodingbox = false;
                            }
                            if (data.status == "L") {
                                swal({
                                    title: 'Login timeout, please log in again',
                                    type: 'error'
                                }, function () {
                                    AuthenticationService.ClearCredentials();
                                    window.location.href = "index.html#/login";
                                })
                            }
                        })

                }
            }
            else{
                swal({
                    title: 'Please choose a file',
                    type: 'error'
                })

            }

        };

        var initReceiver=function(){
            getDataService.data(
                getApi.notification_receive_list,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile)
                },
                function (rtn) {
                    var receivers = rtn.receive_list||[];
                    for(var i=0;i<receivers.length;i++){ receivers[i].sel=false;}
                    $scope.receivers = receivers;
                }
            );
        };

        var checkAll=function(allSel){//ȫѡ/��ѡ
            for(var i=0;i<$scope.receivers.length;i++){
                $scope.receivers[i].sel=allSel;
            };
        };

        var changeAll=function(){//����ı�ȫѡ��״̬
            var selAll=true;
            for(var i=0;i<$scope.receivers.length;i++){
                if(!$scope.receivers[i].sel){
                    selAll = false;
                }
            };
            $scope.allSel=selAll;
        };

        var getFormData=function(){
            var receiver_sel=[];
            for(var i=0;i<$scope.receivers.length;i++){
                if($scope.receivers[i].sel){
                    receiver_sel.push({"group_id":$scope.receivers[i].receive_group_id});
                }
            }

            return {
                "notification_type": $scope.typeSelect,
                "title": $scope.title,
                "status": "Draft",
                "creation_date": "",
                "start_date": $scope.start_date,
                "end_date": $scope.exp_date,
                "content": $scope.content,
                "attachment": $scope.files_obj,
                "receiver": receiver_sel
            };
        };

        var validContent=function(){
            if($scope.content.toString().length>2000){
                swal({title: 'Content must be less than 2000 characters', type: "error"});
                return false;
            }else{
                return true;
            }
        };

        var validDate=function(){
            if($scope.start_date &&$scope.exp_date&& $scope.start_date> $scope.exp_date){
                swal({
                    title: 'Expiration Date not earlier than Start Date',
                    type: "error"
                })
                return false;
            }else return true;
        };

        var submitForm=function(valid){//�ύ
            valid.$dirty=false;
            $scope.submitted = true;
            if (valid.$valid&&validContent()&&validDate()) {
                $rootScope.lodingbox = true;
                var entity=getFormData();
                getDataService.data(
                    getApi.notification_create,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        noti_entity: JSON.stringify(entity)
                    },
                    function (response) {
                        $rootScope.lodingbox = false;
                        if (response.Status == "S") {
                            swal({ title: response.Message, type: "success"}, function () {
                                window.location.href = "index.html#/nt_update/" + $base64.urlsafe_encode(response.Nid);
                            });
                        }
                        else if (response.Status == "E") {
                            swal({ title: response.Message, type: "error" })
                        }
                        else {
                            swal({title: 'error', type: "error"});
                        }
                    }
                )
            }
        };

        var bindEvent=function(){
            $scope.submitForm=submitForm;
            $scope.validate=fileUploadValidate;
            $scope.del=fileDel;
            $scope.upload=fileUpload;
            $scope.checkAll=checkAll;
            $scope.changeAll=changeAll;
        };

        var initPage=function(){
            initType();
            $scope.status="Draft";

            $(".upload-list").niceScroll({cursorcolor: "rgb(0, 122, 255)"});//��ʼ��������
            $scope.files=$scope.rest_arr=[];
            $scope.isremove = true;
            $scope.files_obj = [];

            $scope.allSel=false;
            initReceiver();
            bindEvent();
        };

        initPage();
    });