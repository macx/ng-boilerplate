'use strict';
/* global element:true */

describe('ngBoilerplate.home', function () {

  beforeEach(function () {
    browser().navigateTo('/');
  });

  it('should have a location path /home', function () {
    browser().navigateTo('#/home');
    expect(browser().location().path()).toEqual('/home');
  });

  it('should should have a section element', function () {
    browser().navigateTo('#/home');
    expect(element('body').html()).toContain('section');
  });

  it('should have a welcome headline', function () {
    browser().navigateTo('#/home');
    expect(element('body').html()).toContain('h1');
  });

  it('should have a list', function () {
    browser().navigateTo('#/home');
    expect(element('body').html()).toContain('ul');
  });
});
