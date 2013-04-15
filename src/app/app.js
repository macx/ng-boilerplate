'use strict';

angular.module('ngBoilerplate', [
  'templates-app',
  'templates-component',
  'ngBoilerplate.home'
])

.config(function myAppConfig($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/home' });
})

.run([ 'titleService', function run(titleService) {
  titleService.setSuffix(' | ngBoilerplate');
}])

.controller('AppCtrl', ['$scope', function AppCtrl($scope) {
  $scope.features = [
    'Angular',
    'Grunt',
    'SASS',
    'TDD, because it is the only way.',
    'Full Bower Integration'
  ];
}]);

