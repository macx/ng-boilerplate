'use strict';

angular.module('ngBoilerplate', [
  'templates-app',
  'templates-component',
  'ngBoilerplate.home'
])

.config(function($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/home' });
})

.run([ 'titleService', function(titleService) {
  titleService.setSuffix(' | ngBoilerplate');
}])

.controller('AppCtrl', ['$scope', function($scope) {
  $scope.features = [
    'Angular',
    'Grunt',
    'SASS',
    'TDD, because it is the only way.',
    'Full Bower Integration'
  ];
}]);

