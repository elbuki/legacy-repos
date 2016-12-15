'use strict';

/**
 * @ngdoc function
 * @name intercambealoApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the intercambealoApp
 */
angular.module('intercambealoApp')
  .controller('ProductsCtrl', function($scope, $http, $location, $timeout, Products) {

    var productClickedId = null;
    var filtered = false;

    function refreshResults() {
      $('.modal').modal('hide');
      $scope.filtered = filtered = false;
      $scope.loadMine();
      setTimeout(function() {
        $('.alert-success').slideUp();
      }, 2500);
    }

    $scope.productClicked = function(target) {
      if ($(target.currentTarget).hasClass('selected')) {
        productClickedId = null;
        $(target.currentTarget).removeClass('selected');
        $(target.currentTarget).closest('.modal').find('.btn-primary').addClass('absolute-disable');
      } else {
        productClickedId = $(target.currentTarget).attr('product-id');
        $(target.currentTarget).closest('.modal').find('.mini-card.selected').removeClass('selected');
        $(target.currentTarget).addClass('selected');
        $(target.currentTarget).closest('.modal').find('.btn-primary').removeClass('absolute-disable');
      }
    };

    $http.defaults.headers.common['Authorization'] = sessionStorage.authToken;
    $scope.productsQuery = Products.query(function() {
      $scope.filtered = false;
    }, function(error) {
      if (error.status === 401) {
        delete sessionStorage.authToken;
        $('.alert-danger span').html('You\'ll have to login in order to access the system.').parent().slideDown();
        $location.path('/login');
      }
    });

    $scope.loadMine = function() {

      if (!filtered) {
        $timeout(function() {
          $scope.productsQuery = Products.query({
            filter: 'mine'
          }, function() {
            $scope.filtered = filtered = true;
          }, function(error) {
            console.log(error);
          });
        });
      } else {
        $timeout(function() {
          $scope.productsQuery = Products.query(function() {
            $scope.filtered = filtered = false;
          }, function(error) {
            console.log(error);
          });
        });
      }

      $scope.filtered = filtered;
    };

    $scope.createProduct = function(target) {
      if (target.toElement.attributes['ng-action'].value === 'save') {
        new Products({
          name: $('.modal-body #name').val(),
          description: $('.modal-body #description').val(),
          state: $('.modal-body #state').prop('checked')
        }).$save(function(product) {
          $('.alert-success span')
            .html('The product has been created successfully!')
            .parent()
            .slideDown();
          $('.alert-danger').slideUp();
          refreshResults();
        }, function(error) {
          console.log('error', error);
        });
      } else {
        $http({
          method: 'PUT',
          data: {
            id: target.toElement.attributes['product-id'].value,
            name: $('.modal-body #name').val(),
            description: $('.modal-body #description').val(),
            state: $('.modal-body #state').prop('checked')
          },
          url: 'http://localhost:3000/products'
        }).then(function(product) {
          $('.alert-success span')
            .html('A product has been edited successfully!')
            .parent()
            .slideDown();
          $('.alert-danger').slideUp();
          refreshResults();
        }, function(error) {
          console.log(error);
        });
      }

    };

    $scope.deleteProduct = function(target) {
      Products.delete({
        id: target.toElement.attributes['product-id'].value
      }, function(product) {
        $('.alert-success span')
          .html('The product has been deleted.')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        refreshResults();
      }, function(error) {
        console.log('error', error);
      });
    };

    $scope.showCreateModal = function() {
      $('#product-modal').find('input').each(function(value, input) {
        $(input).val('');
      });
      $('#product-modal').find('input[type=\'checkbox\']').attr('checked', false);
      $('#product-modal')
        .find('.modal-title')
        .html('Create a product')
        .closest('#product-modal')
        .find('.modal-footer .btn-primary')
        .html('Create')
        .closest('#product-modal')
        .modal('show');
    };

    $scope.showEditModal = function(product) {
      $('#product-modal')
        .find('.modal-title')
        .html('Edit a product')
        .closest('#product-modal')
        .find('.modal-footer .btn-primary')
        .html('Edit')
        .attr('ng-action', 'update')
        .attr('product-id', product['0'])
        .closest('#product-modal')
        .find('#name')
        .val(product['1'])
        .closest('#product-modal')
        .find('#description')
        .val(product['2'])
        .closest('#product-modal')
        .find('#state')
        .prop('checked', product['3'])
        .closest('#product-modal')
        .modal('show');
    };

    $scope.showDeleteModal = function(product) {
      $('#delete-product-modal')
        .find('#delete-title')
        .html(product['1'])
        .closest('#delete-product-modal')
        .find('#delete-description')
        .html(product['2'])
        .closest('#delete-product-modal')
        .find('.modal-footer .btn-danger')
        .attr('product-id', product['0'])
        .closest('#delete-product-modal')
        .modal('show');
    };

    $scope.showTransactionModal = function(product) {
      Products.query({
        filter: 'mine'
      }, function(products) {
        $scope.carrousel = products;
        $('#request-product-modal')
          .find('#request-title')
          .html(product['1'])
          .closest('#request-product-modal')
          .find('#request-description')
          .html(product['2'])
          .closest('#request-product-modal')
          .find('#request-owner')
          .html('Owned by: ' + product['4'])
          .closest('#request-product-modal')
          .find('.btn-primary')
          .attr('requested-id', product['0'])
          .closest('#request-product-modal')
          .modal('show');
      });
    };

    $scope.requestProduct = function(target) {

      $http({
        method: 'POST',
        data: {
          requested_id: target.toElement.attributes['requested-id'].value,
          offered_id: productClickedId
        },
        url: 'http://localhost:3000/transaction'
      }).then(function(product) {
        $('.alert-success span')
          .html('A transaction has been placed successfully! <a href="#transactions">More details...</a>')
          .parent()
          .slideDown();
        $('.alert-danger').slideUp();
        $('.modal').modal('hide');
        setTimeout(function() {
          $('.alert-success').slideUp();
        }, 2500);
      }, function(error) {
        console.log(error);
      });
    };
  });
