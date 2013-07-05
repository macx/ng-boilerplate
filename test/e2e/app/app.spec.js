'use strict';

describe('ngBoilerplate', function () {

  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should navigate to /home when / is accessed', function () {
    browser().navigateTo('#/');
    //expect(browser().location().url()).toEqual('/home');
    expect(true).toBe(false);
  });
});
