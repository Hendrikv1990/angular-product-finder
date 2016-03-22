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

function generateURLArgs(actionList){
    var ret = "";
    actionList.forEach(function(item){
        var attrs = item.attributes;
        attrs.forEach(function(attr){
            var key = Object.keys(attr)[0];
            ret += key.toLowerCase() + "=" + encodeURI(attr[key]).replace("&","%26") + "&";
        });
    });
    return ret.substring(0,ret.length-1);
}

angular.module('myApp.productFinder', ['ngRoute','ngCookies'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/productFinder', {
    templateUrl: 'productFinder/productFinder.html',
    controller: 'ProductFinderCtrl'
  });
}])

.controller('ProductFinderCtrl',
  function($scope,$http,modelService,$location, $timeout, $cookies) {

      $scope.actionStack = [];
      $scope.findById = findById;
      $scope.productFeed = [];
      $scope.showProductFeed = false;
      $scope.productFeedContainerScrollOpts = {
          useBothWheelAxes:"true",
          suppressScrollX:"true"
      };
      $scope.endOfPath = false;
      $scope.endSlide = {_id:"THISISTHEEND",shortcut:"Produkte",text:"Unsere empfehlungen für sie"};
      $scope.productDisplayedLimit = 3;

      $scope.$watch("endOfPath",function(newVal){
         if(newVal){
             var args = generateURLArgs($scope.actionStack);
             console.log("http://shoepassion.shopboostr.de/api/v0.1/get_products?" + args);
             $http.post("http://shoepassion.shopboostr.de/api/v0.1/get_products?" + args)
                 .then(function(response){
                     console.log(response);
                     $scope.products = response.data;
                     $scope.productManager.showMoreProducts();
                 });
         }
      });

      var cookieManager = function(){
          var cookieKey = "sb-shoepassion";
          var valuesToStore = ["actionStack","currentSlide","endOfPath"];
          var putCookies = function(){
              var cookieObject = {};
              valuesToStore.forEach(function(item){
                 cookieObject[item] = $scope[item];
                  $cookies.putObject(cookieKey,cookieObject);
              });
          };
          var getCookies = function(){
              var cookieObject = $cookies.getObject(cookieKey);
              if(cookieObject){
                  valuesToStore.forEach(function(item){
                        if(item in cookieObject){
                            $scope[item] = cookieObject[item];
                        }
                  });
              }
              removeCookies();
          };
          var removeCookies = function(){
              $cookies.remove(cookieKey);
          }
          return {
              putCookies: putCookies,
              getCookies: getCookies,
              removeCookies: removeCookies
          }
      }();

      $scope.shouldDisplayInBreadcrumb = function(action){
          return findById($scope.slidesList,action.slideId).hasOwnProperty('breadcrumbHide') ? !findById($scope.slidesList,action.slideId).breadcrumbHide : true;
      };

      $scope.getDisplayedActions = function(){
          return $scope.actionStack.filter(function(item){
                return $scope.shouldDisplayInBreadcrumb(item);
          });
      };

      function changeSlideTo(slideId,reverse){
          if(reverse){
              $scope.animationSwap = "swap-animation-reverse";
              if($scope.endOfPath){
                  $scope.endOfPath = false;
                  $scope.products = [];
                  cookieManager.removeCookies();
                  $scope.productManager.reset();
              }
          }
          //FIXME might there be a better solution than timeout to wait for the class to be added?
          $timeout(function(){
              $scope.currentSlide = findById($scope.slidesList,slideId);
          },0);
      }

      $scope.previous = function(){
          var curAction = $scope.actionStack.pop();
          changeSlideTo(curAction.slideId,true);
      };

      $scope.gridController = {
          getNumberOfRow: function(collectionLength){
              return Math.ceil( collectionLength / 6);
          },
          getItemsPerLine: function(collectionLength){
              return Math.min( Math.round(collectionLength / this.getNumberOfRow(collectionLength)),6)
          },
          getItemSize: function(collectionLength){
              return Math.round( 12 / this.getItemsPerLine(collectionLength));
          },
          getItemOffSize: function(index, collectionLength){
              return index % this.getItemsPerLine(collectionLength)  == 0 ? ( 12 % Math.min(collectionLength,this.getItemsPerLine(collectionLength)))/2 : 0;
          }
      };

      $scope.onProductFeedUpdate = function(){
      };

      $scope.goBackToAction = function(action){
        $scope.actionStack = $scope.actionStack.slice(0,$scope.actionStack.indexOf(action));
        changeSlideTo(action.slideId,true);
      };

      $http.get("data_test/test_data_productFinder_vinc.json")
          .then(function(response) {
              $scope.optionsList = response.data.options;
              $scope.slidesList = response.data.slides;
              $scope.slidesList.push($scope.endSlide);
              $scope.slidesPath = response.data.path;
              $scope.initialSlide = $scope.slidesPath["_id"];
              $scope.defaultPath = response.data.defaultPath;
              $scope.defaultPath.push($scope.endSlide._id);
              $scope.currentSlide = findById($scope.slidesList,$scope.initialSlide);
              cookieManager.getCookies();
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
          $scope.animationSwap = " swap-animation";
          var oldSlideId = $scope.currentSlide._id;
          var actionObject = {"slideId" : oldSlideId,"option":"" + optionId, "attributes": findById($scope.optionsList,optionId).attributes};
          if(angular.equals(getCurrentPath($scope).options, {})){
              $scope.actionStack.push(actionObject);
              $scope.endOfPath = true;
              cookieManager.putCookies();

              /*
              var data = modelService.get();
              data.actionStack = [];
              angular.copy($scope.actionStack,data.actionStack);
              modelService.set(data);
              $location.path("/results");*/
          } else {
            //FIXME might there be a better solution than timeout to wait for the class to be added?
              $timeout(function(){
                  $scope.currentSlide = getNextSlide($scope,optionId);

                  //TODO send actionObject
                  $scope.productFeed = getProducts(actionObject,$scope.productList);
                  $scope.productFeedContainerUpdate = true;
                  $scope.actionStack.push(actionObject);
              },0);
          }
      };

      $scope.productManager = function(){
          var index = 0;
          var reset = function(){
              index = 0;
          };
          var hasMore = function(){
              if($scope.products){
                  return index <= $scope.products.length;
              } else {
                  return false;
              }
          };

          var showMore = function(){
              $scope.shownProducts = $scope.products.slice(index,index + $scope.productDisplayedLimit);
              index += $scope.productDisplayedLimit;
          };

          return {
              hasMoreProducts: hasMore,
              showMoreProducts: showMore,
              reset: reset
          };
      }();
});