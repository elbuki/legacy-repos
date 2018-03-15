/**
 * Controller to handle the landing page
 */
(function LandingControllerWrapper() {

    'use strict';

    function LandingController($rootScope, $scope, $state, $ionicModal,
        $ionicLoading, $ionicPopup, $ionicViewSwitcher, Toast, UserService,
        EnrollmentService, $ionicPush, $ionicHistory) {

        var vm = this;

        vm.NOT_ENOUGH = '>';
        vm.MINIMUM = '>>';
        vm.MIDDLE = '<>';
        vm.REACHED_MAX = '<';
        vm.passwordStrength = $scope.NOT_ENOUGH;

        function clearInputs() {

            vm.data = {
                login: {},
                register: {},
            };

            vm.registerForm.$setPristine();
            vm.registerForm.$setUntouched();
            vm.registerForm.email.$setViewValue('');
            vm.registerForm.email.$render();
            vm.passwordStrength = vm.NOT_ENOUGH;
            vm.loginForm.$setPristine();
            vm.loginForm.$setUntouched();
            vm.loginForm.email.$setViewValue('');
            vm.loginForm.email.$render();
            vm.passwordStrength = $scope.NOT_ENOUGH;
            vm.passwordLength = 0;
        }

        vm.hasError = function checkIfInvalid(formName, inputName) {

            var submitted = vm[formName].$submitted;
            var invalidInput = vm[formName][inputName].$invalid;
            var untouched = vm[formName][inputName].$pristine;

            return submitted && invalidInput && untouched;
        };

        vm.login = function loginUser() {

            vm.loginForm.$setPristine();
            vm.loginForm.$setSubmitted();

            if (vm.loginForm.$invalid) {
                return;
            }

            $ionicLoading.show();

            if (window.cordova) {

                return UserService
                    .login(vm.data.login)
                    .then(function handleLogin(response) {

                    UserService.setData(response);

                    return $ionicPush.register();
                })
                .then(function registeredToken(response) {

                    var params = {
                        deviceToken: response.token,
                    };
                    var promises = [
                        $ionicPush.saveToken(response),
                        UserService.update(params),
                    ];

                    return Promise.all(promises);
                })
                .then(function tokenSaved() {

                    $ionicPush.plugin.on('notification', function handleNotification() {

                        $state
                            .go('dashboard.universities', {}, { reload: true })
                            .then(function updateValues() {
                                $rootScope.$broadcast('reload:notification');
                            });
                    });

                    return $ionicLoading.hide();
                })
                .then(function loadingHidden() {
                    return vm.loginModal.hide();
                })
                .then(function modalHidden() {

                    vm.loginForm.$setPristine();

                    $ionicViewSwitcher.nextDirection('forward');
                    return $state.go('dashboard.universities');
                })
                .then(function onUniversityList() {
                    return EnrollmentService.get();
                })
                .then(function updateEnrollments(response) {
                    $rootScope.$broadcast('enrollments:update', response.data);
                })
                .catch(Toast.error);
            }

            return UserService
                .login(vm.data.login)
                .then(function handleLogin(response) {

                    UserService.setData(response);

                    return $ionicLoading.hide();
                })
                .then(function loadingHidden() {
                    return vm.loginModal.hide();
                })
                .then(function modalHidden() {

                    vm.loginForm.$setPristine();

                    $ionicViewSwitcher.nextDirection('forward');
                    return $state.go('dashboard.universities');
                })
                .then(function onUniversityList() {
                    return EnrollmentService.get();
                })
                .then(function updateEnrollments(response) {
                    $rootScope.$broadcast('enrollments:update', response.data);
                })
                .catch(Toast.error);
        };

        vm.createAccount = function registerAccount() {

            var MISMATCH = 'Password mismatch';
            var repeat = vm.data.register.password === vm.data.register.repeat;

            vm.registerForm.$setPristine();
            vm.registerForm.$setSubmitted();

            vm.registerForm.repeat.$setValidity(MISMATCH, repeat);

            if (vm.registerForm.$invalid) {
                return;
            }

            vm.data.register.fullName =
                vm.data.register.firstName + ' ' + vm.data.register.lastName;

            $ionicLoading.show();

            UserService
                .register(vm.data.register)
                .then(function handleAccountCreated() {

                    $ionicLoading.hide();

                    return vm.registerModal.hide();
                })
                .then(function modalHidden() {

                    var options = {
                        title: 'Account successfully created',
                        template: 'You should now be able to login by using' +
                            ' your new account credentials.',
                    };

                    $ionicPopup.alert(options);
                })
                .catch(Toast.error);
        };

        vm.showModal = function callModal(accessor) {

            clearInputs();

            vm[accessor].show();
        };

        vm.switchModal = function switchModalInstances(actual, next) {

            clearInputs();

            vm[actual]
                .hide()
                .then(function hideModal() {

                    vm[next].show();
                });
        };

        vm.activateStrengthMeter = function validateStrengthMeter(value) {

            var MINIMUM = 6;
            var MIDDLE_OF_STRENGTH = 12;
            var FULL_STRENGTH = 20;

            vm.passwordLength = value && value.length;

            if (!value) {

                vm.passwordStrength = vm.NOT_ENOUGH;
                return;
            }

            if (value.length < MINIMUM) {
                vm.passwordStrength = vm.NOT_ENOUGH;
            } else if (value.length >= MINIMUM && value.length <= MIDDLE_OF_STRENGTH) {
                vm.passwordStrength = vm.MINIMUM;
            } else if (value.length > MIDDLE_OF_STRENGTH && value.length < FULL_STRENGTH) {
                vm.passwordStrength = vm.MIDDLE;
            } else if (value.length === FULL_STRENGTH) {
                vm.passwordStrength = vm.FULL_STRENGTH;
            }
        };

        vm.colorNumbers = function returnColorRepresentation() {

            var data = {
                'assertive': vm.passwordStrength === vm.NOT_ENOUGH,
                'energized': vm.passwordStrength === vm.MINIMUM,
                'balanced': vm.passwordStrength === vm.MIDDLE,
                'dark': vm.passwordStrength === vm.FULL_STRENGTH,
            };

            return data;
        };

        $scope.$on('$ionicView.enter', function clearCache() {
            $ionicHistory.clearCache();
        });

        (function initializeModals() {

            var loginTemplate = 'modules/landing/login.view.html';
            var registerTemplate = 'modules/landing/register.view.html';
            var options = {
                scope: $scope,
            };

            $ionicModal
                .fromTemplateUrl(loginTemplate, options)
                .then(function onLoginModalOpen(modalObject) {

                    vm.loginModal = modalObject;
                });

            $ionicModal
                .fromTemplateUrl(registerTemplate, options)
                .then(function onRegisterModalOpen(modalObject) {

                    vm.registerModal = modalObject;
                });
        }());
    }

    angular
        .module('remindr')
        .controller('LandingController', LandingController);

    LandingController.$inject = [
        '$rootScope', '$scope', '$state', '$ionicModal', '$ionicLoading',
        '$ionicPopup', '$ionicViewSwitcher', 'Toast', 'UserService',
        'EnrollmentService', '$ionicPush', '$ionicHistory'
    ];
}());
