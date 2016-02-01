'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.productFinder',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/productFinder'});
}])

    .directive('bgImg', [function () {
      return {
        'restrict': 'A',
        'scope': true,
        'link': function ($scope, element, attrs) {

          $scope.setBg = function (srcImg) {

            if (!!!srcImg) {

              element[0].style.backgroundImage =  'url(' + attrs.bgSrc + ') ';

            } else {

              element[0].style.backgroundImage =  'url(' + srcImg + ') ';
            }

            element[0].style.backgroundRepeat = attrs.bgRepeat;
            element[0].style.backgroundSize = attrs.bgSize;
            element[0].style.backgroundAttachment = attrs.bgAttachment;
          };

          $scope.setBg();
        }
      };

    }]);
