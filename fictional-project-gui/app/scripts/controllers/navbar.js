'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('NavbarCtrl', function ($scope, $http, $location, $rootScope) {

    $scope.$on('$locationChangeSuccess', function() {

      if(!sessionStorage.user_id) {
        $scope.templateUrl = 'views/template/navbar.html';
        $scope.logout = null;
      } else {
        $scope.templateUrl = 'views/template/navbarlogged.html';
        $scope.logout = function() {
          $http({
            method: 'GET',
            headers: {
              'user_id': sessionStorage.user_id
            },
            url: 'http://localhost:8000/logout/' + sessionStorage.user_id
          }).then(function() {
            delete sessionStorage.user_id;
            $location.path('/');
            $rootScope.$broadcast('logout');
            $scope.templateUrl = 'views/template/navbar.html';
          }, function(error) {
            delete sessionStorage.user_id;
            $location.path('/');
            $scope.templateUrl = 'views/template/navbar.html';

            $('.alert-danger span')
                .html(error.data.message)
                .parent()
                .slideDown();

            setTimeout(function() {
              $('.alert-danger').slideUp();
            }, 5000);
          });
        };
      }

    });
  });
