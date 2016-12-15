'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('MainCtrl', function ($scope) {

    $scope.logged = !sessionStorage.token;

    $('.alert-danger').slideUp();
  });
