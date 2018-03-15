/**
 * Controller to handle the landing page
 */
(function ProfileControllerWrapper() {

    'use strict';

    function ProfileController($rootScope, $scope, $timeout, UserService,
        $state, $ionicViewSwitcher, $ionicPopup, $ionicModal, $ionicHistory,
        EnrollmentService, Toast, $q, $ionicPush) {

        function toFunction(promise) {
            return function promiseCallback() {
                return promise;
            };
        }

        function eachStep(each) {
            return each();
        }

        function adding(answer, enrollment) {

            var action = answer ? 'accept' : 'ignore';
            var options = {
                title: 'Confirm action',
                template: 'Are you sure do you want to ' + action +
                    ' this enrollment?',
            };

            $ionicPopup
                .confirm(options)
                .then(function onResponse(response) {

                    if (response) {

                        var promises = [];

                        if (!answer) {

                            promises = EnrollmentService.remove(enrollment);

                            return $q.resolve(promises);
                        }

                        promises.push(EnrollmentService.addMember(enrollment));
                        promises.push(EnrollmentService.remove(enrollment));

                        return $q.mapSeries(promises.map(toFunction), eachStep);
                    }

                    return $q.reject(false);
                })
                .then(function onAllPromisesResolved(resolvedPromises) {

                    var id;

                    if (!answer) {
                        id = resolvedPromises.data._id;
                    } else {
                        id = resolvedPromises[1].data._id;
                    }

                    var data = vm.enrollments.filter(updateList(id));

                    vm.enrollments = data;

                    $rootScope.$broadcast('enrollments:update', data);

                    options = {
                        title: 'Done',
                        template: 'User has been ' +
                            (answer ? 'accepted' : 'ignored') + ' sucessfully',
                    };

                    return $ionicPopup.alert(options);
                })
                .then(function onOkPressed() {

                    if (!vm.enrollments || !vm.enrollments.length) {
                        vm.hideNotifications();
                    }

                    $timeout(function clearCache() {
                        $ionicHistory.clearCache();
                    }, 200);
                })
                .catch(function onError(value) {
                    if (value) {
                        Toast.error(value);
                    }
                });
        }

        function removal(answer, enrollment) {

            var action = answer ? 'remove' : 'keep';
            var options = {
                title: 'Confirm action',
                template: 'Are you sure do you want to ' + action + ' <b>' +
                    enrollment.user.fullName + '</b> from <b>' +
                    enrollment.to.name + '</b>?',
            };

            $ionicPopup
                .confirm(options)
                .then(function onResponse(response) {

                    if (response) {

                        var promises = [];

                        if (answer) {
                            promises.push(EnrollmentService.removeUser(enrollment));
                        }

                        promises.push(EnrollmentService.removeRemoval(enrollment));
                        promises.push(EnrollmentService.remove(enrollment));

                        return $q.mapSeries(promises.map(toFunction), eachStep);
                    }

                    return $q.reject(false);
                })
                .then(function onAllPromisesResolved(resolvedPromises) {

                    var position = resolvedPromises.length - 1;
                    var id = resolvedPromises[position].data._id;
                    var data = vm.enrollments.filter(updateList(id));

                    vm.enrollments = data;

                    $rootScope.$broadcast('enrollments:update', data);

                    options = {
                        title: 'Done',
                        template: 'User has been ' +
                            (answer ? 'removed' : 'kept') + ' sucessfully',
                    };

                    return $ionicPopup.alert(options);
                })
                .then(function onOkPressed() {

                    if (!vm.enrollments || !vm.enrollments.length) {
                        vm.hideNotifications();
                    }

                    $timeout(function clearCache() {
                        $ionicHistory.clearCache();
                    }, 200);
                })
                .catch(function onError(value) {
                    if (value) {
                        Toast.error(value);
                    }
                });
        }

        function updateList(id) {

            return function filterRemoved(enrollment) {
                return id !== enrollment._id;
            };
        }

        function markAllRead(enrollment) {

            enrollment.read = true;

            return enrollment;
        }

        function getOnlyId(enrollment) {
            return enrollment._id;
        }

        function getUnreadOnly(enrollment) {
            return !enrollment.read;
        }

        var vm = this;

        var session = UserService.getData();

        var enrollmentTemplate = 'modules/enrollment/enrollments.view.html';
        var options = {
            scope: $scope,
        };

        vm.currentUser = session.user.user;

        vm.showConfirmDialog = function showLogoutConfirmation() {

            var options = {
                title: 'Confirm logout',
                template: 'Are you sure do you want to close your session?',
            };

            $ionicPopup
                .confirm(options)
                .then(function onResponse(response) {

                    if (response) {
                        vm.logout();
                    }
                });
        };

        vm.logout = function deleteSession() {

            $rootScope.$broadcast('popover:close');

            $ionicPush
                .unregister(function onUnregistered() {

                    return UserService.logout();
                })
                .then(function onLoggedOut() {

                    UserService.removeData();

                    $ionicViewSwitcher.nextDirection('back');
                    $state.go('landing');
                });
        };

        vm.openNotifications = function openNotificationsModal() {

            vm.enrollmentModal
                .show()
                .then(function openedNotifications() {

                    var ids = vm.enrollments
                        .filter(getUnreadOnly)
                        .map(getOnlyId);

                    var params = {
                        ids: ids,
                    };

                    if (!ids.length) {
                        return $q.resolve();
                    }

                    return EnrollmentService.markAsRead(params);
                })
                .then(function markedAsRead() {

                    vm.enrollments = vm.enrollments.map(markAllRead);

                    $rootScope.$broadcast('enrollments:update', vm.enrollments);
                });
        };

        vm.hideNotifications = function closeNotificationsModal() {

            $rootScope.$broadcast('popover:close');

            vm.enrollmentModal.hide();
        };

        vm.answerEnrollment = function answerRequest(answer, enrollment) {

            if (enrollment.type === 'adding') {
                return adding(answer, enrollment);
            }

            return removal(answer, enrollment);
        };

        $scope.$on('enrollments:update', function refresh(event, data) {
            vm.enrollments = data;
        });

        $ionicModal
            .fromTemplateUrl(enrollmentTemplate, options)
            .then(function onEnrollmentModalLoaded(modalObject) {
                vm.enrollmentModal = modalObject;
            });
    }

    angular
        .module('remindr')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = [
        '$rootScope', '$scope', '$timeout', 'UserService', '$state',
        '$ionicViewSwitcher', '$ionicPopup', '$ionicModal', '$ionicHistory',
        'EnrollmentService', 'Toast', '$q', '$ionicPush'
    ];
}());
