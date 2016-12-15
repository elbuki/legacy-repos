'use strict';

/**
 * @ngdoc service
 * @name intercambealoApp.Users
 * @description
 * # Users
 * Service in the intercambealoApp.
 */
angular.module('fictionalApp')
  .service('Users', function ($resource) {

    var headers = {
        post: {
            headers: {
                'Accepts': 'application/json'
            }
        }
    };

    return $resource('http://localhost:3000/user/', {}, headers);
  });
