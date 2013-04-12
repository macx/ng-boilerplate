'use strict';

describe('titleService', function () {

  beforeEach(module('titleService'));

  it('should set a title without a suffix', inject(function (titleService) {

    var title = 'new title';
    titleService.setTitle(title);

    expect(titleService.getTitle()).toEqual(title);
  }));

  it('should allow specification a suffix', inject(function (titleService) {
    var suffix = ' :: new suffix';
    titleService.setSuffix(suffix);

    expect(titleService.getSuffix()).toEqual(suffix);
  }));

  it('should set the title, including the suffix', inject(function (titleService) {
    var title = 'New Title';
    var suffix = ' :: new suffix';

    titleService.setSuffix(suffix);
    titleService.setTitle(title);
    expect(titleService.getTitle()).toEqual(title + suffix);
  }));
});

