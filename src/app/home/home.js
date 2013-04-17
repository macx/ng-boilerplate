'use strict';

angular.module('ngBoilerplate.home', [
  'titleService'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    controller: 'HomeCtrl',
    templateUrl: 'app/home/home.tpl.html'
  });
}])


.controller('HomeCtrl', ['$scope', 'titleService', function($scope, titleService) {
  titleService.setTitle('Home');
}]);
