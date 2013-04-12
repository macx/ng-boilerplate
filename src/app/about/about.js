'use strict';

angular.module('ngBoilerplate.about', [
  'titleService'
])

.config(['$routeProvider', function config($routeProvider) {
  $routeProvider.when('/about', {
    controller: 'AboutCtrl',
    templateUrl: 'app/about/about.tpl.html'
  });
}])

.controller('AboutCtrl', ['$scope', 'titleService', function AboutCtrl($scope, titleService) {
  titleService.setTitle('What is It?');

  // This is simple a demo for UI Boostrap.
  $scope.dropdownDemoItems = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third'
  ];
}])

;
