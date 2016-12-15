'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('RegisterCtrl', function($scope, $location, Users) {

    $('.alert').slideUp();

    if (sessionStorage.authToken) {
      $location.path('/dashboard');
    }

    $scope.signup = function() {
      new Users({
        username: $('.register-form #username').val(),
        password: $('.register-form #password').val(),
        firstname: $('.register-form #name').val()
      }).$save(function(user) {
        $('.alert-info span')
          .html('Congrats, ' + user.firstname + ' , your account has been registered. You may now login using your account.')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        $location.path('/');
        setTimeout(function() {
          $('.alert-info').slideUp();
        }, 5000);
      }, function() {
        $('.alert-danger span').html('That username is taken.').parent().slideDown();
      });
    };
  });
