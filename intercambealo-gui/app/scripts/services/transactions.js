'use strict';

/**
 * @ngdoc service
 * @name intercambealoApp.Transactions
 * @description
 * # Transactions
 * Service in the intercambealoApp.
 */
angular.module('intercambealoApp')
  .service('Transactions', function ($resource) {

    return $resource('http://localhost:3000/transaction/:id');
  });
