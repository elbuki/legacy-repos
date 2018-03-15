/**
 * Controller to handle the landing page
 */
(function UniversityControllerWrapper() {

    'use strict';

    function UniversityController($rootScope, $scope, $ionicModal, $ionicPopup,
        Toast, $ionicScrollDelegate, $ionicListDelegate, $ionicHistory,
        $ionicViewSwitcher, $state, $stateParams, UniversityService,
        CourseService, UserService, EnrollmentService, university,
        courses, events, $q) {

        function toFunction(promise) {
            return function promiseCallback() {
                return promise;
            };
        }

        function eachStep(each) {
            return each();
        }

        function containsProtocol(protocol) {
            return vm.university.website.indexOf(protocol + '://');
        }

        function onStateEntered() {

            var message = 'The request has been sent ' +
                'successfully';

            Toast.show(message);
        }

        function removed(response) {
            return function filterFunction(user) {
                return user._id !== response.data.user;
            };
        }

        function alert(objectName, action) {

            var message = 'The ' + objectName + ' has been ' + action +
                ' successfully';

            return Toast.show(message);
        }

        var vm = this;

        var editingIndex;
        var beforeEdit;
        var editingAddressIndex;
        var descriptionModal = 'modules/university/description-modal.view.html';
        var universityModal = 'modules/university/university-form.view.html';
        var addressModal = 'modules/university/address-modal.view.html';
        var addressTemplate = 'modules/university/address-form.view.html';
        var usersModal = 'modules/university/university-users.view.html';
        var courseModal = 'modules/course/course-form.view.html';
        var options = {
            scope: $scope,
        };

        vm.university = university.data.shift();
        vm.courses = courses.data;
        vm.events = events.data;
        vm.tabs = {
            ABOUT: 0,
            COURSES: 1,
            CALENDAR: 2,
            TEACHERS: 3,
            STUDENTS: 4,
        };
        vm.currentTab = 0;
        vm.currentTabUsers = 3;
        vm.editing = true;
        vm.editingCourse = true;
        vm.address = {};
        vm.searchTerm = '';

        vm.submitCourse = function submitEditForm() {

            vm.courseForm.$setPristine();
            vm.courseForm.$setSubmitted();

            if (vm.courseForm.$invalid) {
                return;
            }

            return vm.createCourse();
        };

        vm.showAddButton = function canISeeTheAddButton() {

            if (vm.university.disabled) {
                return false;
            }

            return vm.administrator();
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

        vm.editAddress = function openUpdateAddressModal(address, index) {

            vm.addressForm.$setPristine();
            vm.addressForm.$setUntouched();

            editingAddressIndex = index;
            vm.editingAddress = true;
            vm.address = angular.copy(address);

            vm.addressFormModal.show();
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

        vm.removeAddress = function deleteAddress(index) {

            vm.university.addresses.splice(index, 1);

            $ionicListDelegate
                .$getByHandle('location-list')
                .closeOptionButtons();
        };

        vm.editUniversity = function showFormToEdit() {

            beforeEdit = angular.copy(vm.university);

            vm.universityFormModal.show();
        };

        vm.cancel = function hideUniversityModal() {

            vm.university = beforeEdit;

            vm.universityFormModal.hide();
        };

        vm.cancelCourse = function hideCourseModal() {

            vm.course = {};
            vm.courseModal.hide();
        };

        vm.goToEvent = function redirectToEvent(event) {

            $rootScope.$broadcast('disableSearch');

            var params = {
                eventid: event._id,
            };

            $ionicViewSwitcher.nextDirection('forward');
            $state.go('events', params);
        };

        vm.searchByTerm = function searchByTerm(event) {

            if (!vm.searchTerm) {
                return true;
            }

            var term = vm.searchTerm.toLowerCase();
            var title = event.title.toLowerCase();
            var location = event.location.toLowerCase();

            return title.indexOf(term) > -1 || location.indexOf(term) > -1;
        };

        vm.unrequested = function isUserUnrequested() {

            return !vm.university.amIAdmin &&
                !vm.university.amISubadmin &&
                !vm.university.amIMember &&
                !vm.university.disabled &&
                !vm.university.removalRequested &&
                !vm.university.requested;
        };

        vm.requested = function isUserRequested() {

            return !vm.university.amIAdmin &&
                !vm.university.amISubadmin &&
                !vm.university.amIMember &&
                !vm.university.disabled &&
                !vm.university.removalRequested &&
                vm.university.requested;
        };

        vm.removalRequested = function isRemovalRequested() {

            return !vm.university.amIAdmin &&
                !vm.university.amISuperAdmin &&
                vm.university.amIMember &&
                !vm.university.disabled &&
                vm.university.removalRequested &&
                !vm.university.requested;
        };

        vm.member = function isUserMember() {

            return !vm.university.amIAdmin &&
                !vm.university.amISubadmin &&
                vm.university.amIMember &&
                !vm.university.disabled &&
                !vm.university.removalRequested &&
                !vm.university.requested;
        };

        vm.teacher = function isUserTeacher() {

            return !vm.university.amIAdmin &&
                vm.university.amISubadmin &&
                !vm.university.amIMember &&
                !vm.university.requested &&
                !vm.university.removalRequested;
        };

        vm.administrator = function isUserAdministrator() {

            return vm.university.amIAdmin &&
                !vm.university.amISubadmin &&
                !vm.university.amIMember &&
                !vm.university.requested &&
                !vm.university.removalRequested;
        };

        vm.disabled = function isUniversityDisabled() {
            return vm.university.disabled;
        };

        vm.isRelated = function userHavePermissions() {

            return vm.administrator() || vm.teacher() || vm.member();
        };

        vm.getCurrentTitle = function getViewTitle() {

            var title = Object.keys(vm.tabs)[vm.currentTab];

            return title[0] + title.substring(1).toLowerCase();
        };

        vm.selectTab = function selectTabView(tabIndex) {
            vm.currentTab = tabIndex;
        };

        vm.selectTabUsers = function selectTabViewUsers(tabIndex) {

            vm.currentTabUsers = tabIndex;

            $ionicListDelegate
                .$getByHandle('users-list')
                .closeOptionButtons();
        };

        vm.selectedCollection = function getSelectedDataFromTab() {

            if (!vm.users) {
                return;
            }

            if (vm.currentTabUsers === vm.tabs.TEACHERS) {
                return vm.users.subadmins;
            }

            return vm.users.members;
        };

        vm.openAddressModal = function addressModalOpen(address) {

            vm.address = address;
            vm.editingAddress = true;
            vm.addressModal.show();
        };

        vm.openCourseModal = function courseModalOpen(editing) {

            vm.courseForm.$setPristine();
            vm.courseForm.$setUntouched();

            vm.editingCourse = editing;
            vm.courseModal.show();
        };

        vm.openEventModal = function openEventForm() {

            var options = {
                name: 'organization',
                createdFor: 'organization',
                references: vm.university._id,
            };

            $scope.$broadcast('calendar:open-form', options);
        };

        vm.showConfirm = function showPopupBeforeDeleting(value) {

            var action = value ? 'disable' : 'enable';
            var popupOptions = {
                title: action.substring(0, 1).toUpperCase() +
                    action.substring(1) + ' confirmation',
                template: 'Are you sure you want to ' + action +
                    ' this university?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        vm.university.disabled = value;

                        UniversityService
                            .update(vm.university)
                            .then(function onUniversityUpdate(response) {

                                vm.university = response.data;

                                alert('university', action + 'd');
                            })
                            .then($ionicScrollDelegate.scrollTop())
                            .catch(Toast.error);
                    }
                });
        };

        vm.updateUniversity = function applyUpdate() {

            UniversityService
                .update(vm.university)
                .then(function onUniversityUpdate(response) {

                    vm.university = response.data;

                    $rootScope.$broadcast('university:update', vm.university);

                    return vm.universityFormModal.hide();
                })
                .then($ionicScrollDelegate.scrollTop())
                .catch(Toast.error);
        };

        vm.createCourse = function submitToCreate() {

            vm.course.organizationId = $stateParams.universityid;

            CourseService
                .create(vm.course)
                .then(function courseCreated(response) {

                    vm.courses.push(response.data);

                    Toast.show('The course has been created successfully');
                    return vm.courseModal.hide();
                })
                .then(function onModalHidden() {
                    vm.course = {};
                })
                .catch(Toast.error);
        };

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.enrollMe = function sendEnrollRequest() {

            var popupOptions = {
                title: 'Enroll request confirmation',
                template: 'Are you sure you want to send a request to enroll ' +
                    vm.university.name + '?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            to: vm.university._id,
                        };

                        EnrollmentService
                            .addRequested(params)
                            .then(function onUpdatedUser(response) {

                                params = {
                                    user: response.data._id,
                                    to: vm.university._id,
                                    into: 'organization',
                                };

                                vm.university.requested = true;

                                return EnrollmentService.create(params);
                            })
                            .then(function onEnrolledCreated() {
                                return $state.go('dashboard.universities');
                            })
                            .then(onStateEntered);
                    }
                });
        };

        vm.unenroll = function sendUnenrollRequest() {

            if (!vm.member()) {
                return;
            }

            var popupOptions = {
                title: 'Unenroll confirmation',
                template: 'Are you sure you want to send an unenroll request' +
                    ' from ' + vm.university.name + '?'
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            to: vm.university._id,
                        };

                        EnrollmentService
                            .addRemovalRequest(params)
                            .then(function onUpdatedUser(response) {

                                params = {
                                    user: response.data._id,
                                    to: vm.university._id,
                                    into: 'organization',
                                    type: 'removal',
                                };

                                vm.university.removalRequested = true;

                                return EnrollmentService.create(params);
                            })
                            .then(function onEnrolledCreated() {
                                return $state.go('dashboard.universities');
                            })
                            .then(onStateEntered);
                    }
                });
        };

        vm.makeAsTeacher = function convertUserAsTeacher(user) {

            var popupOptions = {
                title: 'Make user as teacher',
                template: 'Are you sure you want to make this user a ' +
                    'teacher of ' + vm.university.name + '?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            user: user._id,
                            organization: vm.university._id,
                        };

                        return EnrollmentService.makeAsTeacher(params);
                    }

                    return $q.resolve(false);
                })
                .then(function afterResponse(response) {

                    if (response) {

                        var message = 'The user has been converted as a ' +
                            'teacher of ' +
                            vm.university.name + ' successfully';

                        user.subadmin = true;
                        vm.users.members = vm.users.members.filter(removed(response));

                        vm.users.subadmins.push(user);

                        $ionicListDelegate
                            .$getByHandle('users-list')
                            .closeOptionButtons();

                        return Toast.show(message);
                    }
                });
        };

        vm.makeAsStudent = function convertUserAsStudent(user) {

            var teaches = user.groupsIn && user.groupsIn.length;
            var popupOptions = {
                title: 'Confirmation',
                template: 'Are you sure that you want to make it as a student?',
            };

            if (teaches) {

                var names = user.groupsIn.map(function wrapIntoElement(group) {
                    return '<b>- ' + group.name + '</b></br>';
                });

                popupOptions.template =
                    '<p>This teacher is already enrolled into these ' +
                    'courses:</p>' +
                    names.join('') + '</br>' +
                    '<p>Proceeding ' +
                    '<b>will unassign this user as a teacher</b> ' +
                    'from those courses.</p>' +
                    '<p>Are you sure you want to continue?</p>';
            }

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            user: user._id,
                            organization: vm.university._id,
                        };

                        if (teaches) {

                            var promises = [
                                EnrollmentService.makeAsStudent(params),
                                EnrollmentService.unenrollGroups(params),
                            ];

                            return $q.mapSeries(promises.map(toFunction), eachStep);
                        }

                        return EnrollmentService.makeAsStudent(params);
                    }

                    return $q.resolve(false);
                })
                .then(function afterResponse(response) {

                    if (response) {

                        if (response.length) {
                            response = response[0];
                        }

                        var message = 'The user has been marked as a ' +
                            'student of ' +
                            vm.university.name + ' successfully';

                        user.subadmin = false;

                        var subadmins = vm
                            .users
                            .subadmins
                            .filter(removed(response));

                        vm.users.subadmins = subadmins;

                        vm.users.members.push(user);

                        $ionicListDelegate
                            .$getByHandle('users-list')
                            .closeOptionButtons();

                        Toast.show(message);
                    }
                });
        };

        vm.removeUser = function removeEnrollment(removedUser) {

            var teaches = removedUser.groupsIn && removedUser.groupsIn.length;
            var popupOptions = {
                title: 'Remove user',
                template: 'Are you sure you want to remove this user from ' +
                    vm.university.name + '?',
            };

            if (removedUser.groupsIn && removedUser.groupsIn.length) {

                var names = removedUser.groupsIn.map(function wrapIntoElement(group) {
                    return '<b>- ' + group.name + '</b></br>';
                });

                popupOptions.template =
                    '<p>This teacher is already enrolled into these ' +
                    'courses:</p>' +
                    names.join('') + '</br>' +
                    '<p>Proceeding ' +
                    '<b>will unassign this user as a teacher</b> ' +
                    'from those courses.</p>' +
                    '<p>Are you sure you want to continue?</p>';
            }

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            user: removedUser._id,
                            organization: vm.university._id,
                        };

                        if (teaches) {

                            var promises = [
                                EnrollmentService.removeUser(params),
                                EnrollmentService.unenrollGroups(params),
                            ];

                            return $q.mapSeries(promises.map(toFunction), eachStep);
                        }

                        return EnrollmentService.removeUser(params);
                    }

                    return $q.resolve(false);
                })
                .then(function afterResponse(response) {

                    if (response) {

                        if (response.length) {
                            response = response[0];
                        }

                        var message = 'The user has been removed from ' +
                            vm.university.name + ' successfully.';

                        vm.users.members = vm.users.members.filter(removed(response));
                        vm.users.subadmins = vm.users.subadmins.filter(removed(response));

                        return Toast.show(message);
                    }
                });
        };

        vm.updateAddress = function applyUpdateAddress() {

            vm.university.addresses[editingAddressIndex] = vm.address;

            vm.addressFormModal.hide();
        };

        vm.validateAddress = function validateFieldsRequired() {

            vm.addressForm.$setPristine();
            vm.addressForm.$setSubmitted();

            if (vm.addressForm.$invalid) {
                return;
            }

            vm.editingAddress ? vm.updateAddress() : vm.addAddress();
        };

        vm.addAddress = function createAddress() {

            if (!vm.university.addresses) {
                vm.university.addresses = [];
            }

            vm.university.addresses.push(vm.address);

            vm.addressFormModal.hide();
        };

        vm.goBack = function goBackToList() {

            $ionicViewSwitcher.nextDirection('back');

            if (!$ionicHistory.backView()) {
                return $state.go('dashboard.universities');
            }

            $ionicHistory.goBack();
        };

        vm.openWebsite = function openLinkInSafari() {

            var protocols = ['http', 'https'];
            var hasProtocol = protocols.find(containsProtocol) || 'http';
            var url = hasProtocol + '://' + vm.university.website;

            if (OpenUrlExt && OpenUrlExt.open) {
                OpenUrlExt.open(url, console.log, Toast.show);
            }
        };

        vm.submit = function submitForm() {

            vm.universityForm.$setPristine();
            vm.universityForm.$setSubmitted();

            if (!vm.university.addresses || !vm.university.addresses.length) {
                Toast.show('The university must have at least one address');
                return;
            }

            if (!vm.university.emails || !vm.university.emails.length) {
                Toast.show('The university must have at least one email');
                return;
            }

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

            return vm.updateUniversity();
        };

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {

            var params = {
                organization: $stateParams.universityid,
            };

            $ionicScrollDelegate.scrollTop();

            UserService
                .get(params)
                .then(function onUsersLoaded(response) {
                    vm.users = response.data;
                });
        });

        $ionicModal
            .fromTemplateUrl(descriptionModal, options)
            .then(function onDescriptionModal(modalObject) {

                vm.descriptionModal = modalObject;

                return $ionicModal.fromTemplateUrl(addressModal, options);
            })
            .then(function onAddressModal(modalObject) {

                vm.addressModal = modalObject;

                return $ionicModal.fromTemplateUrl(universityModal, options);
            })
            .then(function onUniversityFormModal(modalObject) {

                vm.universityFormModal = modalObject;

                return $ionicModal.fromTemplateUrl(usersModal, options);
            })
            .then(function onusersModalOpen(modalObject) {

                vm.usersModal = modalObject;

                return $ionicModal.fromTemplateUrl(courseModal, options);
            })
            .then(function onCourseModalopen(modalObject) {

                vm.courseModal = modalObject;

                return $ionicModal.fromTemplateUrl(addressTemplate, options);
            })
            .then(function onAddressFromOpen(addressFormModal) {
                vm.addressFormModal = addressFormModal;
            });;
    }

    angular
        .module('remindr')
        .controller('UniversityController', UniversityController);

    UniversityController.$inject = [
        '$rootScope', '$scope', '$ionicModal', '$ionicPopup', 'Toast',
        '$ionicScrollDelegate', '$ionicListDelegate', '$ionicHistory',
        '$ionicViewSwitcher', '$state', '$stateParams', 'UniversityService',
        'CourseService', 'UserService', 'EnrollmentService', 'university',
        'courses', 'events', '$q'
    ];
}());
