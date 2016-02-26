'use strict';

function generateArgs(actionList){
    var ret = "";
    actionList.forEach(function(item){
        var attrs = item.attributes;
        attrs.forEach(function(attr){
            var key = Object.keys(attr)[0]
            ret += key.toLowerCase() + "=" + attr[key] + "&";
        });
    });
    return ret.substring(0,ret.length-1);
}

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
      console.log($scope.actionStack)
      var args = generateArgs($scope.actionStack);
      console.log("http://shoepassion.shopboostr.de/api/v0.1/get_products?" + args);
      $http.post("http://shoepassion.shopboostr.de/api/v0.1/get_products?" + args)
          .then(function(response){
              console.log(response);
              $scope.products = response.data;
          });
});