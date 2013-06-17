'use strict';

angular.module('titleService', [])

/**
 * @ngdoc object
 * @name titleService.titleService
 *
 * @description
 * A simple title service to set the title of an HTML document at runtime.
 */
.factory('titleService', function($document) {
  var suffix, title;

  var titleService = {
    /**
     * @ngdoc function
     * @name titleService.titleService#setSuffix
     * @methodOf titleService.titleService
     *
     * @description
     * Use `setSuffix()` to set a title suffix which get appended on the html document
     * title.
     *
     * @param {string} s Suffix as string
     *
     * @example
     * <pre>
     *  angular.module('myApp', ['titleService']).run(function (titleService) {
     *    titleService.setSuffix(' | ngBoilerplate');
     *  });
     * </pre>
     */
    setSuffix: function setSuffix(s) {
      suffix = s;
    },
    /**
     * @ngdoc function
     * @name titleService.titleService#getSuffix
     * @methodOf titleService.titleService
     *
     * @description
     * Returns configured suffix which has been set with  `setSuffix()`.
     *
     * @returns {string}  Configured suffix.
     *
     * @example
     * <pre>
     *  angular.module('myApp', ['titleService']).run(function (titleService) {
     *    // set suffix
     *    titleService.setSuffix(' | ngBoilerplate');
     *
     *    // get suffix
     *    titleService.getSuffix();
     *  });
     * </pre>
     */
    getSuffix: function getSuffix() {
      return suffix;
    },

    /**
     * @ngdoc function
     * @name titleService.titleService#setTitle
     * @methodOf titleService.titleService
     *
     * @description
     * Let you set a title for a specific view on a specific controller.
     *
     * @param {string} t Title prefix.
     *
     * @example
     * <pre>
     *  angular.module('myApp', ['titleService']);
     *
     *  angular.module('Ctrl', function (titleService) {
     *    titleService.setTitle('home');
     *  });
     * </pre>
     */
    setTitle: function setTitle(t) {
      if (angular.isDefined(suffix)) {
        title = t + suffix;
      } else {
        title = t;
      }

      $document.prop('title', title);
    },

    /**
     * @ngdoc function
     * @name titleService.titleService#getTitle
     * @methodOf titleService.titleService
     *
     * @description
     * Returns currently configured HTML document title.
     *
     * @returns {string} Configured HTML document title.
     *
     * @example
     * <pre>
     *  angular.module('myApp', ['titleService']);
     *
     *  angular.module('Ctrl', function (titleService) {
     *    titleService.setTitle('home');
     *
     *    // get title
     *    titleService.getTitle();
     *  });
     * </pre>
     */
    getTitle: function getTitle() {
      return $document.prop('title');
    }
  };

  return titleService;
});

