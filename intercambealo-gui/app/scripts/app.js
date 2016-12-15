'use strict';

/**
 * @ngdoc overview
 * @name intercambealoApp
 * @description
 * # intercambealoApp
 *
 * Main module of the application.
 */
angular
  .module('intercambealoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngRoute'
  ]).config(function($routeProvider) {
    $routeProvider
      .when('/', {
        title: 'Home - Intercambealo',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        title: 'Login - Intercambealo',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/dashboard', {
        title: 'Dashboard - Intercambealo',
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/register', {
        title: 'Register - Intercambealo',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/products', {
        title: 'Products - Intercambealo',
        templateUrl: 'views/products.html',
        controller: 'ProductsCtrl',
        controllerAs: 'products'
      })
      .when('/transactions', {
        templateUrl: 'views/transactions.html',
        controller: 'TransactionsCtrl',
        controllerAs: 'transactions'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
