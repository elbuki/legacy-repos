'use strict';

/**
 * @ngdoc service
 * @name intercambealoApp.Products
 * @description
 * # Products
 * Service in the intercambealoApp.
 */
angular.module('intercambealoApp')
  .service('Products', function ($resource) {

    return $resource('http://localhost:3000/products/:id');
  });
