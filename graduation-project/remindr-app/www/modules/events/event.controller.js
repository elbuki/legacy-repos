/**
 * Controller to handle the landing page
 */
(function EventControllerWrapper() {

    'use strict';

    function EventController($scope, $ionicScrollDelegate, $ionicModal,
        $ionicPopup, $ionicHistory, $ionicViewSwitcher, $ionicLoading, $state,
        $cordovaDatePicker, Toast, EventService, event) {

        function validDates() {
            return vm.event.starts < vm.event.ends;
        }

        function alert(objectName, action) {

            var message = 'The ' + objectName + ' has been ' + action +
                ' successfully';

            return Toast.show(message);
        }

        var vm = this;

        var beforeChangesEvent;
        var options = {
            scope: $scope,
        };

        vm.event = event.data[0];
        vm.editingEvent = true;

        vm.updateEvent = function submitEventChanges() {

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
                .update(vm.event)
                .then(function onModalHidden() {
                    return $ionicHistory.clearCache();
                })
                .then(function onCacheCleared() {
                    return $ionicLoading.hide();
                })
                .then(function onLoadingHidden() {
                    return vm.eventFormModal.hide();
                })
                .then(function onModalHidden() {
                    alert('event', 'updated');
                })
                .catch(Toast.error);
        };

        vm.removeEvent = function showConfirmToDelete() {

            var popupOptions = {
                title: 'Remove confirmation',
                template: 'Are you sure you want to remove this event?'
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        $ionicLoading.show();

                        EventService
                            .remove(vm.event._id)
                            .then(function onEventRemoved(response) {
                                return $ionicLoading.hide();
                            })
                            .then(function onCacheCleared() {
                                return $ionicHistory.clearCache();
                            })
                            .then(function onLoadingHidden() {
                                return vm.goBack();
                            })
                            .then(function onBack() {
                                alert('event', 'removed');
                            })
                            .catch(Toast.error);
                    }
                });
        };

        vm.addToPersonal = function saveToPersonalCalendar() {

            var popupOptions = {
                title: 'Add event',
                template: 'Do you want to add this event to your calendar?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var event = {
                            title: vm.event.title,
                            starts: vm.event.starts,
                            ends: vm.event.ends,
                            location: vm.event.location,
                            createdFor: 'personal',
                        };

                        EventService
                            .create(event)
                            .then(function onEventCreated() {

                                popupOptions = {
                                    title: 'Event saved successfully',
                                    template: 'Do you want to see your ' +
                                        'calendar?',
                                };

                                $ionicPopup
                                    .confirm(popupOptions)
                                    .then(function answeredPopup(answer) {

                                        if (answer) {

                                            var state = 'dashboard.mycalendar';
                                            var params = {
                                                reload: 1,
                                            };

                                            $state.go(state, params);
                                        }
                                    });
                            })
                            .catch(Toast.error);
                    }
                });
        };

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.openEditModal = function openForm() {

            beforeChangesEvent = angular.copy(vm.event);

            vm.eventFormModal.show();
        };

        vm.cancelModal = function closeForm() {

            vm.event = beforeChangesEvent;

            vm.eventFormModal.hide();
        };

        vm.goBack = function goOneLevelBack() {

            $ionicViewSwitcher.nextDirection('back');
            return $ionicHistory.goBack();
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

        $scope.$on('$ionicView.beforeEnter', function onEnter() {
            $ionicScrollDelegate.scrollTop();
        });

        $ionicModal
            .fromTemplateUrl('modules/events/event-form.view.html', options)
            .then(function onFormLoad(modalObject) {

                vm.eventFormModal = modalObject;
            });
    }

    angular
        .module('remindr')
        .controller('EventController', EventController);

    EventController.$inject = [
        '$scope', '$ionicScrollDelegate', '$ionicModal', '$ionicPopup',
        '$ionicHistory', '$ionicViewSwitcher', '$ionicLoading', '$state',
        '$cordovaDatePicker', 'Toast', 'EventService', 'event'
    ];
}());
