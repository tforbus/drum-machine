angular.module('drums.controllers', []);
angular.module('drums.directives', []);
angular.module('drums.factories', []);

var app = angular.module('drums', [
  'ngRoute',
  'drums.directives',
  'drums.factories',
  'drums.controllers'
]);

app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when('/', {
    controller: 'IndexCtrl',
    templateUrl: '/views/drums/index.html'
  });
}]);
