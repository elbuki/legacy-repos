'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('LoginCtrl', function ($scope, $http, $location) {

    if(sessionStorage.authToken) {
      $location.path('/dashboard');
    }

    $scope.authenticate = function() {
      $http({
        method: 'POST',
        url: 'http://localhost:3000/session/authenticate',
        data: {
          username: $('#username').val(),
          password: $('#password').val()
        }
      }).then(function(response) {
        sessionStorage.authToken = response.data.authtoken;
        $('.alert-danger').slideUp();
        $location.path('/dashboard');
      }, function() {
        $('.alert-danger span').html('Wrong username and password combination, please try again.').parent().slideDown();
      });
    };
  });
