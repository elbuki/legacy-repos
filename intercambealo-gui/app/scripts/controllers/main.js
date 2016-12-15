'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('MainCtrl', function ($scope) {

    $scope.logged = !sessionStorage.authToken;

    $('.alert-danger').slideUp();
  });
