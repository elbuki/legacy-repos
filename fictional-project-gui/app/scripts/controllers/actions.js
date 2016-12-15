'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:ActionsCtrl
 * @description
 * # ActionsCtrl
 * Controller of the intercambealoApp
 */
angular.module('fictionalApp')
  .controller('ActionsCtrl', function ($scope, $rootScope, $location) {

      $scope.editMode = false;

      $scope.$on('$locationChangeSuccess', function() {

          $scope.loggedIn = !!sessionStorage.user_id && $location.path() === '/';
      });

      $scope.$on('logout', function() {

         $scope.loggedIn = false;
      });

      $scope.toggleEditMode = function() {

          $scope.editMode = !$scope.editMode;
          $rootScope.$broadcast('edit-mode');
      };

      $scope.addQuestion = function() {

          $rootScope.$broadcast('add-question');
      };

      $scope.refresh = function() {

          $rootScope.$broadcast('refresh');
      };

      $scope.saveChanges = function() {

          $rootScope.$broadcast('save-changes');
      };

  });
