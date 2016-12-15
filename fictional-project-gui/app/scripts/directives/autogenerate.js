'use strict';

/**
 * @ngdoc directive
 * @name intercambealoApp.directive:autoGenerate
 * @description
 * # autoGenerate
 */
angular.module('fictionalApp')
  .directive('autoGenerate', function ($timeout) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {

          function updateViewValue(value) {

            if(!isNaN(+element.html())) {

                $timeout(function() {
                    scope.updateCharts();
                }, 200);
            }
          }

          element.on('keyup', updateViewValue);
      }
    };
  });
