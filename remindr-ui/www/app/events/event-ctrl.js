angular
    .module('remindr')
    .controller('EventController', function($scope, $filter,
                                                        $ionicModal, Event) {

        var vm = this;

        var formTemplate = 'app/events/event-form.html';
        var formConfig = {
            scope: $scope
        };

        vm.event = {};

        $ionicModal
            .fromTemplateUrl(formTemplate, formConfig).then(function(modal) {

                $scope.modal = modal;
        });

        vm.selectToday = function() {

            vm.selectedDate = $filter('date')(new Date(), 'dd-MMM-yyyy');
        };

        vm.reloadEventsOnDate = function() {

            vm.shortDateSelectedDate = new Date(vm.selectedDate);
            console.log('load events on:', vm.selectedDate, 'short format',
                        vm.shortDateSelectedDate);
        };

        vm.save = function() {

            vm.saving = true;

            var each = vm.event.frequencyNumber * (+vm.event.frequencyTime);

            vm.event.frequency = vm.event.allowFrecuencies &&
                                    each ? each : null;

            // TODO: Save event on API, set vm.saving to false when it's done.
            // vm.closeForm();
        };

        vm.showForm = function(action) {

            vm.action = action;

            vm.event.frequencyTime = vm.event.frequencyTime || '24';

            $scope.modal.show();
        };

        vm.closeForm = function() {

            $scope.modal.hide();
        };
    });
