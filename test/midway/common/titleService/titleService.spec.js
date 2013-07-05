'use strict';

describe('titleService', function () {

  var module, deps, tester;

  beforeEach(function () {
    tester = new ngMidwayTester();
    tester.register('titleService');

    module = angular.module('titleService');
    deps = module.value('titleService').requires;
  });

  it('should be registered', function () {
    expect(module).not.toEqual(null);
  });

});
