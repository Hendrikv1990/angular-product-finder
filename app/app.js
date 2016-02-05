'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
    'angular-perfect-scrollbar-2',
    'modelService',
    'ngAnimate',
    'angular-preload-image',
  'myApp.productFinder',
    'myApp.resultsView',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({redirectTo: '/productFinder'});
}]);
