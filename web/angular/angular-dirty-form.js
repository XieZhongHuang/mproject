var dirtyForm = angular.module('dirtyForm', []);

dirtyForm.constant('dirtyFormConfig', {

  message: 'Your data is not saved yet. If you choose to proceed, your data will be lost.',

  confirm: null
});

dirtyForm.run(function ($window, dirtyFormConfig) {

  dirtyFormConfig.confirm = dirtyFormConfig.confirm || function (message) {
    return $window.confirm(message);
  }

});

dirtyForm.directive('dirtyForm', function (dirtyFormLinkFn) {

  return {
    restrict: 'AE',
    require: '^form',
    link: dirtyFormLinkFn
  };

});

  dirtyForm.factory('dirtyFormLinkFn', function (dirtyFormConfig, $q, $location) {

    return function ($scope, $element, $attrs, $form) {

      var forceChange = false,
          resolving = false;


      $scope.$on('$stateChangeStart', function (event, next, current) {

        if($location.path()=='/login'){

        }
        else{

          if (resolving) {
            // Already resolving an async confirm.
            event.preventDefault();
          } else if ($form.$dirty && !forceChange) {

            var message = $attrs.dirtyForm || dirtyFormConfig.message;

              /**
               * anthor：limalin
               * date：2017.04.13
               * 判断浏览器的confirm的弹出框间隙实践如果小于10毫秒
               * 由于人为无法这么快速的操作，判定为浏览器禁用了confirm
               * 自动返回false，这时程序判断自动跳转页面无需组织该事件。
               */
              var startTime = new Date().getTime();
              var p = dirtyFormConfig.confirm(message);
              var endTime = new Date().getTime();
              if((endTime-startTime) < 10){
                  p = true;
              }


              if (p !== true) {

              // Either a promise or false result.
              // Postpone location change


              event.preventDefault();

              resolving = true;

              var resolve = function (v) {
                if (v) {
                  $location.$parse(next);
                  forceChange = true;
                }
              };

              $q.when(p)
                  .then(resolve)['catch'](function () {
                resolve(false);
              })['finally'](function () {
                resolving = false;
              });
            }
          }
        }

      });
    }


  });
