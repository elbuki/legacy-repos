'use strict';

/**
 * @ngdoc service
 * @name intercambealoApp.Users
 * @description
 * # Users
 * Service in the intercambealoApp.
 */
angular.module('intercambealoApp')
  .service('Users', function ($resource) {

    return $resource('http://localhost:3000/user/:id');
  });
