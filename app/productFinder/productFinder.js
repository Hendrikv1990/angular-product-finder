'use strict';

function findById(arr,id){
  return arr.filter(function(item){
    return item._id == id;
  })[0];
}

function getNextSlide(scope,optionId){
  var currentPath = getCurrentPath(scope);
  return findById(scope.slidesList,currentPath.options["" + optionId]._id);
}

function getCurrentPath(scope){
    var currentPath = scope.slidesPath;
    scope.actionStack.forEach(function(item){
        currentPath = currentPath.options[item.option];
    });
    return currentPath;
}

function getProducts(actionObject,productList){
    return productList.filter(function(product){
        return actionObject.attributes.filter(function(attribute){
            return product.attributes.indexOf(attribute) != -1;
        }).length != 0;
    });
}

angular.module('myApp.productFinder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/productFinder', {
    templateUrl: 'productFinder/productFinder.html',
    controller: 'ProductFinderCtrl'
  });
}])

.controller('ProductFinderCtrl',
  function($scope,$http,modelService,$location) {

      $scope.actionStack = [];
      $scope.findById = findById;
      $scope.animationSwap = "";
      $scope.productFeed = [];

      $http.get("data_test/test_data_productFinder.json")
          .then(function(response) {
              $scope.optionsList = response.data.optionsList;
              $scope.slidesList = response.data.slidesList;
              $scope.slidesPath = response.data.slidesPath;
              $scope.initialSlide = response.data.initialSlide;
              $scope.currentSlide = findById($scope.slidesList,$scope.initialSlide);
          });

      // TODO Remove when implementation is correct
      $http.get("data_test/test_data_productFeed.json")
          .then(function(response) {
              $scope.productList = response.data;
              console.log($scope.productList);
          });
      // END to be removed

      $scope.optionClicked = function(optionId){
          //Convert optionId to string since json is using strings
          optionId = "" + optionId;
          $scope.animationSwap = " swap-animation-in";
          var oldSlideId = $scope.currentSlide._id;
          var actionObject = {"slideId" : oldSlideId,"option":"" + optionId, "attributes": findById($scope.optionsList,optionId).attributes};
          if(angular.equals(getCurrentPath($scope).options, {})){
              $scope.actionStack.push(actionObject);
              var data = modelService.get();
              data.actionStack = [];
              angular.copy($scope.actionStack,data.actionStack);
              modelService.set(data);
              $location.path("/results");
          } else {
              $scope.currentSlide = getNextSlide($scope,optionId);
              //TODO send actionObject
              $scope.productFeed = getProducts(actionObject,$scope.productList);
              console.log($scope.productFeed);
              $scope.actionStack.push(actionObject);
          }


      };
});