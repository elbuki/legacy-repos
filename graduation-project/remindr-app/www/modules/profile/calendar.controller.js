/**
 * Controller to handle the landing page
 */
(function CalendarControllerWrapper() {

    'use strict';

    function CalendarController($rootScope, $scope, $ionicScrollDelegate,
        $ionicViewSwitcher, $state, events, EventService) {

        var vm = this;

        vm.events = events.data;
        vm.searchTerm = '';

        vm.searchByTerm = function searchByTerm(event) {

            if (!vm.searchTerm) {
                return true;
            }

            var term = vm.searchTerm.toLowerCase();
            var title = event.title.toLowerCase();
            var location = event.location.toLowerCase();

            return title.indexOf(term) > -1 || location.indexOf(term) > -1;
        };

        vm.openAddModal = function openEventForm() {

            var options = {
                name: 'personal',
                createdFor: 'personal',
            };

            $scope.$broadcast('calendar:open-form', options);
        };

        vm.goToEvent = function redirectToEvent(event) {

            $rootScope.$broadcast('disableSearch');

            var params = {
                eventid: event._id,
            };

            $ionicViewSwitcher.nextDirection('forward');
            $state.go('events', params);
        };

        $scope.$on('$ionicView.beforeEnter', function reloadEvents() {

            if ($state.params.reload) {

                EventService
                    .get()
                    .then(function onEventsLoaded(response) {
                        vm.events = response.data;
                    });
            }
        });
    }

    angular
        .module('remindr')
        .controller('CalendarController', CalendarController);

    CalendarController.$inject = [
        '$rootScope', '$scope', '$ionicScrollDelegate', '$ionicViewSwitcher',
        '$state', 'events', 'EventService'
    ];
}());
