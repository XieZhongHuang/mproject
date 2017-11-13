/**
 * Created by lingyin on 15/8/1.
 */
IndonesiaApp

    .filter('search_promise', function () {

        return function (obj,data) {
            angular.forEach(obj, function (a) {
                var b=[]
                if (a.name == data) {

                    b.push(a.name)

                }

            });
            return b

        }
    })
    .filter('datefilter', function () {
        return function (obj) {
            var b=obj.substring(11,13)
            return b

        }
    })
    .filter('urlFilter', function ($base64) {

        return function (data) {
              b = $base64.urlsafe_encode(data)
            return b
        }

    })
    //��ȡ�ļ�����
    .filter('getFileExt', function () {
        return function(input){
            if(input){
                var len = input.length;
                var dot = input.lastIndexOf(".");
                if (dot>=0) {
                    return input.substr(dot+1, len).toLowerCase();
                } else {
                    return "";
                }
            }else{
                return "";
            }
        }
    })
    //����ļ�����
    .filter('checkFileExt', function ($filter) {
        return function(input, allowExt){
            var fileExt = $filter('getFileExt')(input);
            if(fileExt){
                return allowExt.indexOf(fileExt) >= 0 ? true:false;
            }else{
                return false;
            }
        }
    })
    .filter('getCount',function(){
        return function(input,list){
            var count = 0;
            angular.forEach(list,function(v,k){
                v = v?v:0;
                if(isNaN(v))v=0;
                count = count+parseFloat(v);
            });
            return count.toFixed(2);
        }
    })
;