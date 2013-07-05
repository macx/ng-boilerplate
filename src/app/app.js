'use strict';

angular.module('ngBoilerplate', [
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ui.state'
])

.config(function myAppConfig ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise( '/home' );
})

.run(function run(titleService) {
  titleService.setSuffix(' | ngBoilerplate');
})

.controller('AppCtrl', function ($scope) {
  $scope.features = [
    'Angular',
    'Grunt',
    'SASS',
    'TDD, because it is the only way.',
    'Full Bower Integration'
  ];
});

