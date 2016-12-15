'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('ChartCtrl', function ($scope) {

      $scope.default = [
          ["Electrical Production", "Night and day", "Everyday", "24 hours"],
          ["Cost", "₡ 10000 - ₡ 20000.", "1) DIY Box Large: €649,99. The equivalent of 25 plant batteries. 2) DIY Box Home: €134,99. The equivalent of 5 plant batteries.", "None, you only can support with donations."],
          ["Charge", "One product has enought energy for a normal room without excess.", "One plant battery charges an smarth phone without problem while the plant baterry are working fine.", "It's very small only allows up to 2 to 3 charges of an smart phone per day with a power: 5.0V, 1.9A."]
      ];

      $scope.data = $scope.default;

      $scope.deleteColumn = function(column) {

          var columnIndex = -1;

          $scope.data.map(function(product) {

              if(product.indexOf(column) !== -1) {

                  columnIndex = product.indexOf(column);
              }

              if(columnIndex > 0) {

                  angular.element('table').find('th').each(function(index, header) {

                      if(index === columnIndex) {

                          angular.element(header).hide();
                      }
                  });

                  product.splice(columnIndex, 1);
              }

              return product;
          });

      };
  });
