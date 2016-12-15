'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:TransactionsCtrl
 * @description
 * # TransactionsCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('TransactionsCtrl', function ($scope, $location, $http, $timeout, Transactions) {

    function refreshResults() {
      $('.modal').modal('hide');
      $timeout(function() {
        $scope.requestedTransactions = Transactions.query({
          filter: 'requested'
        });
      });
      setTimeout(function() {
        $('.alert-success').slideUp();
      }, 2500);
    }

    $http.defaults.headers.common['Authorization'] = sessionStorage.authToken;
    $scope.requestedTransactions = Transactions.query({
      filter: 'requested'
    }, function() {

    }, function(error) {
      if(error.status === 401) {
        delete sessionStorage.authToken;
        $('.alert-danger span').html('You\'ll have to login in order to access the system.').parent().slideDown();
        $location.path('/login');
      }

    });

    $scope.showDeleteModal = function(transaction) {

      $('#delete-transaction-modal')
        .find('#delete-username')
        .html(transaction['2'])
        .closest('#delete-transaction-modal')
        .find('#delete-requested')
        .html(transaction['1'])
        .closest('#delete-transaction-modal')
        .find('#delete-offered')
        .html(transaction['3'])
        .closest('#delete-transaction-modal')
        .find('.modal-footer .btn-danger')
        .attr('transaction-id', transaction['0'])
        .closest('#delete-transaction-modal')
        .modal('show');
    };

    $scope.deleteTransaction = function(target) {

      Transactions.delete({
        id: target.toElement.attributes['transaction-id'].value
      }, function() {
        $('.alert-success span')
          .html('The transaction has been deleted.')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        refreshResults();
      }, function(error) {
        console.log('error', error);
      });
    };

  });
