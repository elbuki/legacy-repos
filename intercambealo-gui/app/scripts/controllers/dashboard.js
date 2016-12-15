'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('DashboardCtrl', function($scope, $location, $http, $timeout, Transactions) {

    function refreshResults() {
      $('.modal').modal('hide');
      $timeout(function() {
        $scope.transactions = Transactions.query();
      });
      setTimeout(function() {
        $('.alert-success').slideUp();
      }, 2500);
    }

    $http.defaults.headers.common['Authorization'] = sessionStorage.authToken;
    $scope.transactions = Transactions.query(function() {

    }, function(error) {
      if (error.status === 401) {
        delete sessionStorage.authToken;
        $('.alert-danger span').html('You\'ll have to login in order to access the system.').parent().slideDown();
        $location.path('/login');
      }

    });

    $scope.showAcceptModal = function(transaction) {
      $('#accept-transaction-modal')
        .find('#accept-username-request')
        .html(transaction['4'])
        .closest('#accept-transaction-modal')
        .find('#accept-offered')
        .html(transaction['3'])
        .closest('#accept-transaction-modal')
        .find('#accept-requested')
        .html(transaction['1'])
        .closest('#accept-transaction-modal')
        .find('.modal-footer .btn-primary')
        .attr('transaction-id', transaction['0'])
        .closest('#accept-transaction-modal')
        .modal('show');
    };

    $scope.acceptTransaction = function(target) {
      $http({
        method: 'GET',
        url: 'http://localhost:3000/transaction/finalize/' + target.toElement.attributes['transaction-id'].value
      }).then(function(response) {
        $('.alert-success span')
          .html('The transaction has been accepted.')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        refreshResults();
      }, function(error) {
        console.log('error', error);
      });
    };

  });
