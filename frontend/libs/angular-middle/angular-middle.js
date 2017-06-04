'use strict';

angular.module('middle', [])
  .directive('middle', function () {
    return {
      template: '<div class="middle-wrapper" ng-transclude></div>',
      restrict: 'A',
      transclude: true,
      link: function postLink(scope, element, attrs) {
      }
    };
  });
