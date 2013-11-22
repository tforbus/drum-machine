angular.module('drums.controllers', []);

var app = angular.module('drums', [
  'ngRoute',
  'drums.controllers'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'IndexCtrl',
    templateUrl: '/views/drums/index.html'
  });
}]);
