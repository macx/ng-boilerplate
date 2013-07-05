'use strict';

describe('ngBoilerplate', function () {

  var AppCtrl, scope;

  beforeEach(module('ngBoilerplate'));

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should have an AppCtrl', function () {
    expect(AppCtrl).toBeDefined();
  });

  describe('AppCtrl', function () {

    it('should attach a list of features to scope', function () {
      expect(scope.features.length).toBe(5);
    });
  });
});
