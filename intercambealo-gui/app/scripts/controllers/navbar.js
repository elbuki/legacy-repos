'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('NavbarCtrl', function ($scope, $http, $location) {
    $scope.$on('$locationChangeSuccess', function() {

      if(!sessionStorage.authToken) {
        $scope.templateUrl = 'views/template/navbar.html';
        $scope.logout = null;
      } else {
        $scope.templateUrl = 'views/template/navbarlogged.html';
        $scope.logout = function() {
          $http({
            method: 'GET',
            headers: {
              'Authorization': sessionStorage.authToken
            },
            url: 'http://localhost:3000/session/logout'
          }).then(function() {
            delete sessionStorage.authToken;
            $location.path('/');
            $scope.templateUrl = 'views/template/navbar.html';
          }, function(error) {
            delete sessionStorage.authToken;
            $location.path('/');
            $scope.templateUrl = 'views/template/navbar.html';
          });
        };
      }

    });
  });
