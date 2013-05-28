'use strict';

angular.module('ngBoilerplate.home', [
  'titleService'
])

.config(function($routeProvider) {
  $routeProvider.when('/home', {
    controller: 'HomeCtrl',
    templateUrl: 'app/home/home.tpl.html'
  });
})


.controller('HomeCtrl', function($scope, titleService) {
  titleService.setTitle('Home');
});
