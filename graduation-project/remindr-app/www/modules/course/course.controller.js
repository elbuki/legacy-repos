/**
 * Controller to handle the course information
 */
(function CourseControllerWrapper() {

    'use strict';

    function CourseController($rootScope, $scope, $state, $ionicModal,
        $ionicPopup, Toast, $ionicScrollDelegate, $ionicViewSwitcher,
        $ionicHistory, CourseService, EnrollmentService, UserService, course,
        events, users, $q) {

        function onStateEntered() {

            var message = 'The request has been sent ' +
                'successfully';

            Toast.show(message);
        }

        function filterAdmin(teacher) {
            return teacher._id !== (vm.course.admin && vm.course.admin._id);
        }

        function alert(objectName, action) {

            var message = 'The ' + objectName + ' has been ' + action +
                ' successfully';

            return Toast.show(message);
        }

        var vm = this;

        var beforeEdit;
        var courseModal = 'modules/course/course-form.view.html';
        var descriptionModal = 'modules/course/description-modal.view.html';
        var adminModal = 'modules/course/course.admin.view.html';
        var studentsModal = 'modules/course/course-students.view.html';
        var options = {
            scope: $scope,
        };

        vm.iOsSpecific = window.cordova ? 'margin-top: 0 !important' : '';
        vm.course = course.data.shift();
        vm.events = events.data;
        vm.users = users.data.filter(filterAdmin);
        vm.tabs = {
            ABOUT: 0,
            CALENDAR: 1,
        };
        vm.currentTab = 0;
        vm.searchTerm = '';

        vm.submitCourse = function submitEditForm() {

            vm.courseForm.$setPristine();
            vm.courseForm.$setSubmitted();

            if (vm.courseForm.$invalid) {
                return;
            }

            return vm.updateCourse();
        };

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.cancelCourse = function hideCourseModal() {

            vm.course = beforeEdit;
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

            return !vm.course.amIAdmin &&
                !vm.course.amISuperAdmin &&
                !vm.course.amIMember &&
                !vm.course.disabled &&
                !vm.course.removalRequested &&
                !vm.course.requested &&
                vm.course.admin;
        };

        vm.requested = function isUserRequested() {

            return !vm.course.amIAdmin &&
                !vm.course.amISuperAdmin &&
                !vm.course.amIMember &&
                !vm.course.disabled &&
                !vm.course.removalRequested &&
                vm.course.requested;
        };

        vm.removalRequested = function isRemovalRequested() {

            return !vm.course.amIAdmin &&
                !vm.course.amISuperAdmin &&
                vm.course.amIMember &&
                !vm.course.disabled &&
                vm.course.removalRequested &&
                !vm.course.requested;
        };

        vm.member = function isUserMember() {

            return !vm.course.amIAdmin &&
                !vm.course.amISuperAdmin &&
                vm.course.amIMember &&
                !vm.course.disabled &&
                !vm.course.removalRequested &&
                !vm.course.requested;
        };

        vm.administrator = function isUserTeacher() {

            return vm.course.amISuperAdmin &&
                !vm.course.amIMember &&
                !vm.course.requested &&
                !vm.course.removalRequested;
        };

        vm.teacher = function isUserAdministrator() {

            return vm.course.amIAdmin &&
                !vm.course.requested &&
                !vm.course.removalRequested &&
                !vm.administrator();
        };

        vm.disabled = function isUniversityDisabled() {
            return vm.course.disabled;
        };

        vm.isRelated = function userHavePermissions() {

            return vm.administrator() || vm.teacher();
        };

        vm.enrollMe = function sendEnrollRequest() {

            var popupOptions = {
                title: 'Enroll request confirmation',
                template: 'Are you sure you want to send a request to enroll ' +
                    vm.course.name + '?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            to: vm.course._id,
                        };

                        EnrollmentService
                            .addRequested(params)
                            .then(function onUpdatedUser(response) {

                                params = {
                                    user: response.data._id,
                                    to: vm.course._id,
                                    into: 'group',
                                };

                                vm.course.requested = true;

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
                    ' from ' + vm.course.name + '?'
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        var params = {
                            to: vm.course._id,
                        };

                        EnrollmentService
                            .addRemovalRequest(params)
                            .then(function onUpdatedUser(response) {

                                params = {
                                    user: response.data._id,
                                    to: vm.course._id,
                                    into: 'group',
                                    type: 'removal',
                                };

                                vm.course.removalRequested = true;

                                return EnrollmentService.create(params);
                            })
                            .then(function onEnrolledCreated() {
                                return $state.go('dashboard.universities');
                            })
                            .then(onStateEntered);
                    }
                });
        };

        vm.showConfirm = function showPopupBeforeDeleting(value) {

            var action = value ? 'Disable' : 'Enable';
            var popupOptions = {
                title: action + ' confirmation',
                template: 'Are you sure you want to ' + action.toLowerCase() +
                    ' this course?'
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function handleResponse(answer) {

                    if (answer) {

                        vm.course.disabled = value;

                        CourseService
                            .update(vm.course)
                            .then(function onCourseUpdate(response) {

                                var teacher = vm.course.admin;

                                vm.course = response.data;
                                vm.course.admin = teacher;

                                alert('course', action.toLowerCase() + 'd');
                            })
                            .then($ionicScrollDelegate.scrollTop())
                            .catch(Toast.error);
                    }
                });
        };

        vm.courseFormOpen = function openCourseFormModal() {

            vm.editingCourse = true;
            beforeEdit = angular.copy(vm.course);

            vm.courseModal.show();
        };

        vm.getCurrentTitle = function getViewTitle() {

            var title = Object.keys(vm.tabs)[vm.currentTab];

            return title[0] + title.substring(1).toLowerCase();
        };

        vm.selectTab = function selectTabView(tabIndex) {
            vm.currentTab = tabIndex;
        };

        vm.updateCourse = function saveCourse() {

            vm.course.organization = $state.params.universityid;

            CourseService
                .update(vm.course)
                .then(function updatedCourse(response) {

                    var teacher = vm.course.admin;

                    vm.course = response.data;
                    vm.course.admin = teacher;

                    Toast.show('The course has been updated successfully');

                    vm.courseModal.hide();
                })
                .catch(Toast.error);
        };

        vm.openEventModal = function openEventForm() {

            var options = {
                name: 'group',
                createdFor: 'group',
                references: vm.course._id,
            };

            $scope.$broadcast('calendar:open-form', options);
        };

        vm.showAdminModal = function openAdminModal() {

            if (!vm.administrator()) {
                return;
            }

            vm.adminModal.show();
        };

        vm.search = function searchTeacher() {

            if (!vm.searchTerm) {
                return;
            }

            vm.searching = true;
            vm.searchSubmitted = true;

            var params = {
                organization: $state.params.universityid,
                s: vm.searchTerm,
            };

            UserService
                .get(params)
                .then(function onResults(response) {

                    vm.searchResults = response.data.filter(filterAdmin);
                    vm.searching = false;
                });
        };

        vm.noResults = function checkIfSearchThrowsNoResults() {

            return vm.searchTerm &&
                vm.searchSubmitted &&
                !vm.searching &&
                (!vm.searchResults || !vm.searchResults.length);
        };

        vm.assignTeacher = function setTeacherToCourse(user) {

            var popupOptions = {
                title: 'Teacher change confirmation',
                template: 'Are you sure you want to assign ' + user.fullName +
                    ' to teach ' + vm.course.name + '?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function onPopupAnswered(answer) {

                    if (answer) {

                        var params = {
                            _id: vm.course._id,
                            admin: user._id,
                            organization: $state.params.universityid,
                        };

                        return CourseService.update(params, true);
                    }

                    return $q.resolve(false);
                })
                .then(function onTeacherUpdated(response) {

                    if (response) {

                        var message = vm.course.name + ' has been assigned to' +
                            ' ' + user.fullName;

                        vm.searchTerm = '';
                        vm.searchResults = [];
                        vm.searchSubmitted = false;
                        vm.searching = false;
                        vm.course.admin = response.data.admin;

                        Toast.show(message);

                        vm.adminModal.hide();
                    }
                });
        };

        vm.removeUser = function unEnrollUsersFromCourse(user) {

            var popupOptions = {
                title: 'Remove user confirmation',
                template: 'Are you sure you want to remove ' +
                    '<b>' + user.fullName + '</b> from this course?',
            };

            $ionicPopup
                .confirm(popupOptions)
                .then(function onPopupAnswered(answer) {

                    if (answer) {

                        var params = {
                            user: user._id,
                            group: vm.course._id,
                        };

                        return EnrollmentService.removeUser(params);
                    }

                    return $q.resolve(false);
                })
                .then(function onUserRemoved(response) {

                    if (response) {

                        var message = 'The user has been removed from ' +
                            vm.course.name + ' successfully';

                        vm.users = vm.users.filter(function userRemoved(user) {
                            return user._id !== response.data.user;
                        });

                        return Toast.show(message);
                    }
                });
        };

        vm.goBack = function goBackToList() {

            $ionicViewSwitcher.nextDirection('back');

            if (!$ionicHistory.backView()) {
                console.log($ionicHistory);
            }

            $ionicHistory.goBack();
        };

        $ionicModal
            .fromTemplateUrl(courseModal, options)
            .then(function onCourseFormModalInitialized(modalObject) {

                vm.courseModal = modalObject;

                return $ionicModal.fromTemplateUrl(descriptionModal, options);
            })
            .then(function onDescriptionModalInitialized(modalObject) {

                vm.descriptionModal = modalObject;

                return $ionicModal.fromTemplateUrl(adminModal, options);
            })
            .then(function onAdminModalInitialized(modalObject) {

                vm.adminModal = modalObject;

                return $ionicModal.fromTemplateUrl(studentsModal, options);
            })
            .then(function onStudentsModalInitialized(modalObject) {
                vm.studentsModal = modalObject;
            });
    }

    angular
        .module('remindr')
        .controller('CourseController', CourseController);

    CourseController.$inject = [
        '$rootScope', '$scope', '$state', '$ionicModal', '$ionicPopup', 'Toast',
        '$ionicScrollDelegate', '$ionicViewSwitcher', '$ionicHistory',
        'CourseService', 'EnrollmentService', 'UserService', 'course', 'events',
        'users', '$q'
    ];
}());
