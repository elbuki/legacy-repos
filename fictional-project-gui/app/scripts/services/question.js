'use strict';

/**
 * @ngdoc service
 * @name intercambealoApp.Question
 * @description
 * # Question
 * Service in the intercambealoApp.
 */
angular.module('fictionalApp')
  .service('Question', function ($resource) {

      var headers = {
          post: {
              headers: {
                  'Accepts': 'application/json'
              }
          }
      };

      var actions = {
         get: {
             isArray: true
         }
      };

      return $resource('http://localhost:3000/questions/', {}, actions, headers);
  });
