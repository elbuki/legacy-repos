'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('RegisterCtrl', function($scope, $location, Users) {

    $('.alert').slideUp();

    if (sessionStorage.token) {
      $location.path('/dashboard');
    }

    $scope.signup = function() {
      new Users({
        email: $('.register-form #email').val(),
        password: $('.register-form #password').val(),
        name: $('.register-form #name').val()
    }).$save(function(response) {

        $('.alert-info span')
          .html('Congrats, ' + response.name + '. Your account has been registered.')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        $location.path('/');
        setTimeout(function() {
          $('.alert-info').slideUp();
        }, 5000);
    }, function(error) {

        console.log(error);
        if(error.status === 422) {

            var errorString = '';

            if(error.data.code === 11000) {

                errorString = 'This email is already used, pick another one.';
            } else {

                if(error.data.code === 12) {

                    errorString = 'Password is required.';
                } else {

                    var errorKeys = Object.keys(error.data.errors);

                    errorString = errorKeys.join(', ') + ' are required.';
                }
            }
        }

        $('.alert-danger span').html(errorString).parent().slideDown();
      });
    };
  });
