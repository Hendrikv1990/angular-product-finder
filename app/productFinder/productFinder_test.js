'use strict';

describe('myApp.productFinder module', function() {



  beforeEach(module('myApp.productFinder'));





  describe('productFinderCtrl', function(){

    var $httpBackend, $rootScope, createController;

    beforeEach(inject(function($injector) {
      // Set up the mock http service responses
      $httpBackend = $injector.get('$httpBackend');
      jasmine.getJSONFixtures().fixturesPath='base/app/data_test';
      // backend definition common for all tests
      $httpBackend.when('GET', '/data_test/test_data_productFinder.json')
          .respond(getJSONFixture('test_data_productFinder.json'));

      $httpBackend.when('GET', '/data_test/test_data_productFeed.json')
          .respond(getJSONFixture('test_data_productFeed.json'));

      // Get hold of a scope (i.e. the root scope)
      $rootScope = $injector.get('$rootScope');
      // The $controller service is used to create instances of controllers
      var $controller = $injector.get('$controller');

      createController = function() {
        return $controller('productFinderCtrl', {'$scope' : $rootScope });
      };
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should get data and currentSlide', function() {
      $httpBackend.expectGET('/data_test/test_data_productFinder.json');
      var controller = createController();
      $httpBackend.flush();
      expect($rootScope.currentSlide._id).toBe("1");
    });


  });
});