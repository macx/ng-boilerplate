'use strict';

describe('AppCtrl', function() {
  beforeEach(module('ngBoilerplate'));

  var AppCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of features to the scope', function() {
    expect(scope.features.length).toBe(5);
  });
});
