'use strict';

describe('ngBoilerplate.home', function () {

  var module, deps, tester;

  var hasModule = function (m) {
    return deps.indexOf(m) >= 0;
  };

  beforeEach(function () {
    tester = new ngMidwayTester('ngBoilerplate.home');
    module = angular.module('ngBoilerplate.home');
    deps = module.value('ngBoilerplate.home').requires;
  });

  afterEach(function () {
    tester.destroy();
    tester = null;
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

  it('should have ui.state dependency', function () {
    expect(hasModule('ui.state')).toBe(true);
  });

  it('should have titleService dependency', function () {
    expect(hasModule('titleService')).toBe(true);
  });
});
