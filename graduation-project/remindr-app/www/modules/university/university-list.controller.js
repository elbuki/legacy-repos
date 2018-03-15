/**
 * Controller to handle the landing page
 */
(function UniversityListControllerWrapper() {

    'use strict';

    function UniversityListController($rootScope, $state, $timeout, $scope, $ionicModal,
        $ionicPopover, $ionicViewSwitcher, Toast, UniversityService, EnrollmentService,
        mine, enrolled) {

        function updateList() {

            var params = {
                enrolled: true,
            };

            UniversityService
                .get(params)
                .then(function assignData(response) {

                    vm.universities.enrolled = response.data;
                    vm.currentTab = vm.tabs.ENROLLED;

                    return EnrollmentService.get();
                })
                .then(function assignEnrollments(response) {
                    $rootScope.$broadcast('enrollments:update', response.data);
                })
                .catch(console.error);
        }

        var vm = this;
        var editingIndex;
        var editingAddressIndex;
        var loginTemplate = 'modules/university/university-form.view.html';
        var addressTemplate = 'modules/university/address-form.view.html';
        var profileTemplate = 'modules/profile/profile.view.html';
        var options = {
            scope: $scope,
        };

        vm.searchSubmitted = false;
        vm.tabs = {
            ENROLLED: 0,
            MINE: 1,
            SEARCH: 2,
        };
        vm.iOsSpecific = window.cordova ? 'margin-top: 0 !important' : '';
        vm.universities = {};
        vm.university = {};
        vm.address = {};

        vm.currentTab = vm.tabs.ENROLLED;
        vm.universities.mine = mine.data;
        vm.universities.enrolled = enrolled.data;

        vm.refresh = function () {
            updateList();
        };

        vm.cancel = function hideUniversityModal() {

            vm.university = {};
            vm.universityFormModal.hide();
        };

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.selectTab = function makeThisTabActive(tabNumber) {
            vm.currentTab = tabNumber;
        };

        vm.createUniversity = function saveUniversity() {

            vm.universityForm.$setPristine();
            vm.universityForm.$setSubmitted();

            if (vm.university.website) {

                var regex = '[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}' +
                    '(:[0-9]{1,5})?(\/.*)?$';
                regex = new RegExp(regex);

                var valid = regex.test(vm.university.website);

                vm.universityForm.website.$setValidity('url', valid);
            }

            if (vm.universityForm.$invalid) {
                return;
            }

            return UniversityService
                .create(vm.university)
                .then(function createUniversity(response) {

                    vm.universities.mine.push(response.data);

                    return vm.universityFormModal.hide();
                })
                .then(function clearForm() {
                    vm.university = {};
                })
                .catch(Toast.error);
        };

        vm.addEmail = function appendEmailField() {

            if (!vm.university.emails) {
                vm.university.emails = [];
            }

            vm.university.emails.push('');
        };

        vm.removeEmail = function deleteEmailField(index) {
            vm.university.emails.splice(index, 1);
        };

        vm.showAddressForm = function openAddressForm() {

            vm.addressForm.$setPristine();
            vm.addressForm.$setUntouched();

            editingAddressIndex = false;
            vm.editingAddress = false;
            vm.address = {
                country: 'CR',
            };

            vm.addressFormModal.show();
        };

        vm.validateAddress = function validateFieldsRequired() {

            vm.addressForm.$setPristine();
            vm.addressForm.$setSubmitted();

            if (vm.addressForm.$invalid) {
                return;
            }

            return vm.editingAddress ? vm.updateAddress() : vm.addAddress();
        };

        vm.addAddress = function createAddress() {

            if (!vm.university.addresses) {
                vm.university.addresses = [];
            }

            vm.university.addresses.push(vm.address);

            vm.addressFormModal.hide();
        };

        vm.editAddress = function openUpdateAddressModal(address, index) {

            vm.addressForm.$setPristine();
            vm.addressForm.$setUntouched();

            editingAddressIndex = index;
            vm.editingAddress = true;
            vm.address = angular.copy(address);

            vm.addressFormModal.show();
        };

        vm.updateAddress = function applyUpdateAddress() {

            vm.university.addresses[editingAddressIndex] = vm.address;

            vm.addressFormModal.hide();
        };

        vm.removeAddress = function deleteAddress(index) {

            vm.university.addresses.splice(index, 1);

            $ionicListDelegate
                .$getByHandle('location-list')
                .closeOptionButtons();
        };

        vm.search = function searchUniversities() {

            if (!vm.searchTerm) {
                return;
            }

            vm.searchSubmitted = true;

            var params = {
                s: vm.searchTerm,
            };

            UniversityService
                .get(params)
                .then(function handleSearch(response) {

                    vm.searchFinished = true;
                    vm.searchSubmitted = false;
                    vm.universities.found = response.data;
                })
                .catch(Toast.error);
        };

        vm.clearSearch = function clearSearchResult() {

            vm.searchSubmitted = false;
            vm.searchFinished = false;
            vm.universities.found = [];
        };

        vm.openProfile = function openPopover($event) {

            vm.userPopover.show($event);
        };

        vm.goToUniversity = function transitionToUniversity(university) {

            var params = {
                universityid: university._id,
            };

            $ionicViewSwitcher.nextDirection('forward');
            $state.go('universities', params);
        };

        vm.openCreateModal = function openForm() {

            vm.universityForm.$setPristine();
            vm.universityForm.$setUntouched();

            vm.universityFormModal.show();
        };

        vm.submit = function submitForm() {

            if (!vm.university.addresses || !vm.university.addresses.length) {
                Toast.show('The university must have at least one location');
                return;
            }

            if (!vm.university.emails || !vm.university.emails.length) {
                Toast.show('The university must have at least one email');
                return;
            }

            return vm.editing ? vm.updateUniversity() : vm.createUniversity();
        };

        $scope.$on('popover:close', function closePopover() {
            vm.userPopover.hide();
        });

        $scope.$on('enrollments:update', function refresh(event, data) {

            var unread = data.filter(function checkIfTheresUnread(enrollment) {
                return !enrollment.read;
            });

            $timeout(function applyChangeToView() {
                vm.unread = unread;
            }, 10);
        });

        $rootScope.$on('university:update', function replace(event, data) {

            var mine = vm.universities.mine.map(function change(university) {

                if (data._id === university._id) {
                    university = data;
                }

                return university;
            });

            vm.universities.mine = mine;
        });

        $ionicModal
            .fromTemplateUrl(loginTemplate, options)
            .then(function onUniversityFormOpen(modalObject) {

                vm.universityFormModal = modalObject;

                return $ionicModal.fromTemplateUrl(addressTemplate, options);
            })
            .then(function onAddressFromOpen(addressFormModal) {
                vm.addressFormModal = addressFormModal;
            });

            $ionicPopover
                .fromTemplateUrl(profileTemplate, options)
                .then(function onPopoverLoaded(popoverObject) {
                    vm.userPopover = popoverObject;
                });
    }

    angular
        .module('remindr')
        .controller('UniversityListController', UniversityListController);

    UniversityListController.$inject = [
        '$rootScope', '$state', '$timeout', '$scope', '$ionicModal', '$ionicPopover',
        '$ionicViewSwitcher', 'Toast', 'UniversityService', 'EnrollmentService',
        'mine', 'enrolled'
    ];
}());
