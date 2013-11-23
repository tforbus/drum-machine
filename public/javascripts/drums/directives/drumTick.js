angular.module('drums.directives')

/**
 * Toggles the color and state of the drum tick.
 */
.directive('currentTick', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {model: '=ngModel'},
    link: function (scope, elem, attrs) {
      var index = attrs.tdIndex;
      if (scope.model.currentTick === index) {
        elem.addClass('current-tick');
        elem.siblings().removeClass('current-tick');
      }
    }
  };
});
