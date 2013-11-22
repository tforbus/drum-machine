angular.module('drums.controllers', []);
angular.module('drums.directives', []);

var app = angular.module('drums', [
  'ngRoute',
  'drums.directives',
  'drums.controllers'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'IndexCtrl',
    templateUrl: '/views/drums/index.html'
  });
}]);
