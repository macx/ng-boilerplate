'use strict';

describe('titleService', function () {

  var module, deps, tester;

  beforeEach(function () {
    tester = new ngMidwayTester('titleService');
    module = angular.module('titleService');
    deps = module.value('titleService').requires;
  });

  afterEach(function () {
    tester.destroy();
    tester = null;
  });

  it('should be registered', function () {
    expect(module).not.toEqual(null);
  });

});
