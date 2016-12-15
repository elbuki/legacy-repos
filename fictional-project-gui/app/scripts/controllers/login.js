'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

    if(sessionStorage.token) {
      $location.path('/dashboard');
    }

    $scope.authenticate = function() {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/login',
        data: {
          email: $('#email').val(),
          password: $('#password').val()
        }
      }).then(function(response) {

        sessionStorage.user_id = response.data._id;
        $('.alert-danger').slideUp();
        $location.path('/dashboard');
    }, function(error) {

        if(error.status === 401) {

            var errorMessage = 'Wrong user and password combination.';
        }

        $('.alert-danger span').html(errorMessage || '').parent().slideDown();

        setTimeout(function() {
          $('.alert-danger').slideUp();
        }, 5000);
      });
    };
  });
