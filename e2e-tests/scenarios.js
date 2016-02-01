'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /productFinder when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/productFinder");
  });


  describe('productFinder', function() {

    beforeEach(function() {
      browser.get('index.html#/productFinder');
    });

  });

});
