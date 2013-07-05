'use strict';

describe('ngBoilerplate', function () {

  var module, deps, tester;

  var hasModule = function (m) {
    return deps.indexOf(m) >= 0;
  };

  beforeEach(function () {
    tester = new ngMidwayTester();
    tester.register('ngBoilerplate');

    module = angular.module('ngBoilerplate');
    deps = module.value('ngBoilerplate').requires;
  });

  it('should be registered', function () {
    expect(module).not.toEqual(null);
  });

  it('should have templates-app dependency', function () {
    expect(hasModule('templates-app')).toBe(true);
  });

  it('should have templates-common dependency', function () {
    expect(hasModule('templates-common')).toBe(true);
  });

  it('should have ngBoilerplate.home dependency', function () {
    expect(hasModule('ngBoilerplate.home')).toBe(true);
  });

  it('should have ui.state dependency', function () {
    expect(hasModule('ui.state')).toBe(true);
  });
});
