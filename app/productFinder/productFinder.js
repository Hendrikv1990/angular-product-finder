'use strict';

function findById(arr,id){
  return arr.filter(function(item){
    return item._id == id;
  })[0];
}


function getNextSlide($scope,optionId){
  var currentPath = $scope.slidesPath;
  $scope.actionStack.forEach(function(item){
    currentPath = currentPath.options[item.option];
  });

  return findById($scope.slidesList,currentPath.options["" + optionId]._id);
}

angular.module('myApp.productFinder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/productFinder', {
    templateUrl: 'productFinder/productFinder.html',
    controller: 'ProductFinderCtrl'
  });
}])

.controller('ProductFinderCtrl',
  function($scope,$http) {
    $scope.actionStack = [];

    $scope.findById = findById;

    $http.get("data_test/test_data.json")
        .then(function(response) {
          $scope.optionsList = response.data.optionsList;
          $scope.slidesList = response.data.slidesList;
          $scope.slidesPath = response.data.slidesPath;
          $scope.initialSlide = response.data.initialSlide;
          $scope.currentSlide = findById($scope.slidesList,$scope.initialSlide);
      });

    $scope.optionClicked = function(optionId){
      var oldSlideId = $scope.currentSlide._id;
      $scope.currentSlide = getNextSlide($scope,optionId);
      $scope.actionStack.push({"slideId" : oldSlideId,"option":"" + optionId});
    };
});