'use strict';

angular.module('myApp.resultsView', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/results', {
    templateUrl: 'resultsView/resultsView.html',
    controller: 'resultsViewCtrl'
  });
}])

.controller('resultsViewCtrl',
  function($scope,$http,modelService) {
      console.log(modelService.get());
      $scope.actionStack = modelService.get().actionStack;
});