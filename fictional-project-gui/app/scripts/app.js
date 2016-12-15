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
  .module('fictionalApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'chart.js',
    'contenteditable'
  ]).config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
      })
      .when('/login', {
        title: 'Login - Fictional project',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/register', {
        title: 'Register - Fictional project',
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/chart', {
        templateUrl: 'views/comparative-chart.html',
        controller: 'ChartCtrl',
        controllerAs: 'chart'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
