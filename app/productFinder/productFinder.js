'use strict';

angular.module('myApp.productFinder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/productFinder', {
    templateUrl: 'productFinder/productFinder.html',
    controller: 'ProductFinderCtrl'
  });
}])

.controller('ProductFinderCtrl', [function() {

}]);