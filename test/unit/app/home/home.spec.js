'use strict';

describe('ngBoilerplate.home', function () {

  var HomeCtrl, scope;

  beforeEach(module('ngBoilerplate.home'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    HomeCtrl = $controller('HomeCtrl', {
      $scope: scope
    });
  }));

  it('should have a HomeCtrl', function () {
    expect(HomeCtrl).toBeDefined();
  });
});
