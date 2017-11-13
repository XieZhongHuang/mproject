/**
 * Created by Veket on 2015/9/10.
 */
IndonesiaApp
    .controller('NotificationUpdateCtrl', function ($http, $rootScope, $scope,Upload,$base64, globals,getDataService,getApi,$timeout,$stateParams,$filter) {
        var nid=0;

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
                    initReceiver();
                }
            );
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
                    loadInitData();
                }
            );
        };

        var setPageData=function(item){
            $scope.typeSelect=item.notification_type_code;
            $scope.title=item.title;
            $scope.status=item.status;
            if(item.status=="Published"){
                $('#publish-btn').attr('disabled',"true");
            }
            $scope.creation_date=item.creation_date;
            $scope.content=item.content;
            $scope.attachment=item.attachment;
            $scope.start_date=item.start_date;
            $scope.exp_date=item.end_date;
            for(var i=0;i<item.receive_list.length;i++){
                if(item.receive_list[i].sel=="true"){
                    item.receive_list[i].sel=true;
                }else{
                    item.receive_list[i].sel=false;
                }
            }
            $scope.receivers=item.receive_list;
        };

        var loadInitData=function(){
            getDataService.data(
                getApi.notification_detail,
                'post',
                {
                    profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                    parameter:JSON.stringify({"notification_id":nid})
                },
                function (rtn) {
                    setPageData(rtn);
                }
            );
        };

        var delUpload=function(fileId,fileName){//ɾ���Ѿ��ϴ���
            var deleteDB=function(){
                getDataService.data(
                    getApi.n_file_delete,
                    'post',
                    { parameter:JSON.stringify({"notification_id":nid,"file_id":fileId})},
                    function (rtn) {
                        if(rtn.Status=="S"){
                            swal({ title: rtn.Message, type: 'success'},function(){
                                var tempArr=[];
                                for(var i=0;i<$scope.attachment.length;i++){
                                    if($scope.attachment[i].file_id!=fileId){
                                        tempArr.push($scope.attachment[i]);
                                    }
                                }
                                $scope.attachment = tempArr;
                                $scope.$apply(function(){ $scope.attachment })
                            });
                        }else{
                            swal({ title: rtn.Message, type: 'error'});
                        }

                    }
                );
            };
            $http({
                url: getApi.file_delete+ 'jsessionid=' + JSON.parse(localStorage.getItem('AuthData')).jsessionid +"?file_name="+ fileName ,
                method: 'post',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).success(function(resp){
                if(resp.status=="S"){
                    deleteDB();
                }else{
                    swal({ title: resp.message, type: 'error'});
                }
            });
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
                            swal({ title: data.message, type: "success" });
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
                swal({title: 'Please choose a file', type: 'error' });
            }

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
                "notification_id":nid,
                "notification_type": $scope.typeSelect,
                "title": $scope.title,
                "status": $scope.status,
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
                    getApi.notification_update,
                    'post',
                    {
                        profile: JSON.stringify(JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile),
                        noti_entity: JSON.stringify(entity)
                    },
                    function (response) {
                        $rootScope.lodingbox = false;
                        if (response.Status == "S") {
                            swal({ title: response.Message, type: "success"}, function () {
                                window.location.href = "index.html#/nt_update/" + $base64.urlsafe_encode(nid);
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

        var publishClick=function(){
            var user_id=JSON.parse($base64.urlsafe_decode(localStorage.getItem('InitalData'))).profile.user_id;
            getDataService.data(
                getApi.notification_publish,
                'post',
                {
                    parameter:JSON.stringify({"notification_id":nid,"user_id":user_id})
                },
                function (rtn) {
                    if(rtn.Status=="S"){
                        swal({title: rtn.Message, type: "success"});
                        $('#publish-btn').attr('disabled',"true");
                        $scope.status="Published";
                    }else{
                        swal({title: rtn.Message, type: "error"});
                    }
                }
            );

        };

        var previewClick=function(){
            //$('#publish-btn').removeAttr('disabled');
            window.location.href = "index.html#/nt_preview/" + $base64.urlsafe_encode(nid);
        };

        var bindEvent=function(){
            $scope.delUpload=delUpload;
            $scope.submitForm=submitForm;
            $scope.validate=fileUploadValidate;
            $scope.del=fileDel;
            $scope.upload=fileUpload;
            $scope.checkAll=checkAll;
            $scope.changeAll=changeAll;
            $scope.publishClick=publishClick;
        };

        var initPage=function(){
            $scope.allSel=false;
            $scope.dowUrl=getApi.file_down;
            $scope.files_obj = [];
            $scope.nid =nid = parseInt($base64.urlsafe_decode($stateParams.n_id)) ||0;
            initType();
            bindEvent();
        };

        initPage();
    });