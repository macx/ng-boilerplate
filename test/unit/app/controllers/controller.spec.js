'use strict';

describe('AppCtrl', function () {
  describe('isCurrentUrl', function () {
    var AppCtrl, $scope;

    beforeEach(module('ngBoilerplate'));

    beforeEach(inject(function ($controller, $location, $rootScope) {
      $location = $location;
      $scope = $rootScope.$new();
      AppCtrl = $controller('AppCtrl', { $location: $location, $scope: $scope });
    }));

    it('should pass a dummy test', inject(function () {
      expect(AppCtrl).toBeTruthy();
    }));
  });
});
