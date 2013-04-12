'use strict';

angular.module('ngBoilerplate', [
  'templates-app',
  'templates-component',
  'ngBoilerplate.home',
  'ngBoilerplate.about'
])

.config(function myAppConfig($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/home' });
})

.run([ 'titleService', function run(titleService) {
  titleService.setSuffix(' | ngBoilerplate');
}])

.controller('AppCtrl', ['$scope', function AppCtrl($scope) {
  $scope.awesomeThings = [
    'HTML5',
    'CSS',
    'Some Stuff'
  ];
}]);

