/**
 * Controller to handle the landing page
 */
(function CalendarDirectiveControllerWrapper() {

    'use strict';

    function CalendarDirectiveController($scope, $state, $ionicModal, Toast,
        $cordovaDatePicker, $ionicViewSwitcher, $ionicLoading, EventService,
        UserService) {

        function validDates() {
            return vm.event.starts < vm.event.ends;
        }

        var vm = this;

        var loginDetails = UserService.getData();

        $scope.events.map(function addOwnsProperty(event) {

            event.owns = event.createdBy === loginDetails.user.user._id;

            return event;
        });

        var options = {
            scope: $scope,
        };

        vm.event = {};

        vm.byDay = function filterByDay(event) {

            if (!vm.dateSelected) {
                return;
            }

            var starts = new Date(event.starts);
            var today = new Date();

            return starts.toDateString() === vm.dateSelected.toDateString();
        };

        vm.createEvent = function submitNewEvent() {

            vm.eventForm.$setPristine();
            vm.eventForm.$setSubmitted();

            if (vm.eventForm.$invalid) {
                return;
            } else if (!validDates()) {
                Toast.show('The starting date must be before the ending date');
                return;
            }

            $ionicLoading.show();

            EventService
                .create(vm.event)
                .then(function onEventCreated(response) {

                    $scope.events.push(response.data);

                    return $ionicLoading.hide();
                })
                .then(function onLoadingHidden() {
                    return vm.eventFormModal.hide();
                })
                .then(function onModalHidden() {
                    Toast.show('The event has been created successfully');
                })
                .catch(Toast.error);
        };

        vm.editDate = function openDatePicker(property) {

            var options = {
                date: vm.event[property],
                mode: 'datetime',
                allowOldDates: false,
            };

            $cordovaDatePicker
                .show(options)
                .then(function onDateChanged(date) {

                    if (date) {
                        vm.event[property] = date;
                    }
                });
        };

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.goToEvent = function redirectToEvent(event) {

            var params = {
                eventid: event._id,
            };

            $ionicViewSwitcher.nextDirection('forward');
            $state.go('events', params);
        };

        $scope.$on('calendar:open-form', function(event, data) {

            if ($scope.name === data.name) {

                var now = new Date();

                vm.event = {
                    createdFor: data.createdFor,
                    starts: now.getTime(),
                    ends: now.setHours(now.getHours() + 1),
                    references: data.references,
                };

                vm.eventForm.$setPristine();
                vm.eventForm.$setUntouched();

                vm.eventFormModal.show();
            }
        });

        $ionicModal
            .fromTemplateUrl('modules/events/event-form.view.html', options)
            .then(function onFormLoad(modalObject) {

                vm.eventFormModal = modalObject;
            });
    }

    function CalendarDirective() {

        var directiveOptions = {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/calendar/calendar.view.html',
            scope: {
                name: '@',
                display: '=',
                selectedDate: '=',
                events: '=',
            },
            controller: CalendarDirectiveController,
            controllerAs: 'vm',
        };

        return directiveOptions;
    }

    angular
        .module('remindr')
        .directive('calendar', CalendarDirective);

    CalendarDirectiveController.$inject = [
        '$scope', '$state', '$ionicModal', 'Toast', '$cordovaDatePicker',
        '$ionicViewSwitcher', '$ionicLoading', 'EventService', 'UserService'
    ];
}());
