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

function _transmitEventToChildren(parent,$event){
    for(var i = 0; i < parent.children.length ; ++i){
        var node = parent.children[i];
        var event = new MouseEvent("mouseover");
        console.log(node);
        node.dispatchEvent($event);
        _transmitEventToChildren(node);
    }
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
      $scope.productFeed = [];
      $scope.showProductFeed = false;
      $scope.productFeedContainerScrollOpts = {
          useBothWheelAxes:"true",
          suppressScrollX:"true"
      };
      $scope.animationSwap = "swap-animation-out";

      $scope.shouldDisplayInBreadcrumb = function(action){
          return findById($scope.slidesList,action.slideId).hasOwnProperty('breadcrumbDisplay') ? findById($scope.slidesList,action.slideId).breadcrumbDisplay : true;
      };

      $scope.getDisplayedActions = function(){
          return $scope.actionStack.filter(function(item){
                return $scope.shouldDisplayInBreadcrumb(item);
          });
      };

      $scope.previous = function(){
          var curAction = $scope.actionStack.pop();
          //TODO not ready for prime time
          /*$scope.animationSwap = "swap-animation-reverse";*/
          $scope.currentSlide = findById($scope.slidesList,curAction.slideId);
      }

      $scope.Math = Math;

      $scope.onProductFeedUpdate = function(){
        alert("update");
      };

      $http.get("data_test/test_data_productFinder_shoePassion.json")
          .then(function(response) {
              $scope.optionsList = response.data.optionsList;
              $scope.slidesList = response.data.slidesList;
              $scope.slidesPath = response.data.slidesPath;
              $scope.initialSlide = response.data.initialSlide;
              $scope.defaultPath = response.data.defaultPath;
              $scope.currentSlide = findById($scope.slidesList,$scope.initialSlide);
          });

      // TODO Remove when implementation is correct
      $http.get("data_test/test_data_productFeed.json")
          .then(function(response) {
              $scope.productList = response.data;
          });
      // END to be removed

      $scope.optionClicked = function(optionId){
          //Convert optionId to string since json is using strings
          optionId = "" + optionId;
          $scope.animationSwap += " swap-animation-out";
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
              /*angular.elem("div.slide-content").hasClass("animation-swap-reverse")*/
              $scope.currentSlide = getNextSlide($scope,optionId);
              //TODO send actionObject
              $scope.productFeed = getProducts(actionObject,$scope.productList);
              $scope.productFeedContainerUpdate = true;
              $scope.actionStack.push(actionObject);
          }


      };
});