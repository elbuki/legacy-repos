'use strict';

var modules = [
    'ionic', 'ngCordova', 'countrySelect', 'ionic.cloud', 'angularMarquee',
    'mwl.bluebird'
];

angular
    .module('remindr', modules)
    .run(function($ionicPlatform, $templateCache, $http, iOSNai, $ionicPush,
        $state, $rootScope) {

        $ionicPlatform.ready(function() {

        ionic.Platform.setPlatform('ios');

        if (window.cordova) {

            var cordovaDefined = window.cordova;
            var pluginsDefined = window.cordova.plugins;
            var keyboardDefined = window.cordova.plugins.Keyboard;

            if (cordovaDefined && pluginsDefined && keyboardDefined) {

                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {

                StatusBar.styleDefault();
            }

            iOSNai.wereReady();

            if ($ionicPush.plugin) {

                $ionicPush.plugin.on('notification', function handleNotification() {

                    $state
                        .go('dashboard.universities', {}, { reload: true })
                        .then(function updateValues() {
                            $rootScope.$broadcast('reload:notification');
                        });
                });
            }
        }

        // Preload templates
        var options = {
            cache: $templateCache,
        };

        $http.get('modules/calendar/assets/calendar.html', options);
        $http.get('modules/calendar/calendar.view.html', options);
      });
    })
    .config(function($stateProvider, $urlRouterProvider) {

        function onLoggedIn($state, UserService) {

            var session = UserService.getData();

            if (session.user && session.user.token) {

                if ($state.transition) {

                    $state.transition.finally(function() {

                        $state.go('dashboard.universities');
                    });
                }
            }
        }

        function onLoggedOut($state, $ionicViewSwitcher, UserService) {

            var session = UserService.getData();

            if (!session.user && session.user.token) {

                if ($state.transition) {

                    $state.transition.finally(function() {

                        $ionicViewSwitcher.nextDirection('back');

                        $state.go('landing');
                    });
                }
            }
        }

        $stateProvider
            .state('landing', {
                controller: 'LandingController',
                controllerAs: 'vm',
                url: '/',
                templateUrl: 'modules/landing/landing.view.html',
                onEnter: onLoggedIn,
            })
            .state('dashboard', {
                abstract: true,
                controller: 'DashboardController',
                controllerAs: 'vm',
                templateUrl: 'modules/dashboard/dashboard.view.html',
                onEnter: onLoggedOut,
                resolve: {
                    enrollments: function getEnrollments(EnrollmentService) {
                        return EnrollmentService.get();
                    },
                },
            })
            .state('dashboard.universities', {
                url: '/universities',
                views: {
                    'universities': {
                        controller: 'UniversityListController',
                        controllerAs: 'vm',
                        templateUrl: 'modules/university/' +
                            'university-list.view.html',
                        resolve: {
                            mine: function getMine(UniversityService) {
                                return UniversityService.get();
                            },
                            enrolled: function getEnrolled(UniversityService) {

                                var params = {
                                    enrolled: true,
                                };

                                return UniversityService.get(params);
                            },
                        },
                    },
                },
            })
            .state('dashboard.mycalendar', {
                params: {
                    reload: 0,
                },
                url: '/calendar',
                views: {
                    'my-calendar': {
                        controller: 'CalendarController',
                        controllerAs: 'vm',
                        templateUrl: 'modules/profile/calendar.view.html',
                        resolve: {
                            events: function getMyEvents(EventService) {
                                return EventService.get();
                            },
                        },
                    },
                },
            })
            .state('universities', {
                url: '/universities/:universityid',
                templateUrl: 'modules/university/university.view.html',
                controller: 'UniversityController',
                controllerAs: 'vm',
                cache: false,
                resolve: {
                    university: function getUniversity($stateParams,
                        UniversityService) {

                        var params = {
                            id: $stateParams.universityid,
                        };

                        return UniversityService.get(params);
                    },
                    courses: function getCourses($stateParams, CourseService) {

                        var params = {
                            organizationId: $stateParams.universityid,
                        };

                        return CourseService.get(params);
                    },
                    events: function getEvents($stateParams, EventService) {

                        var params = {
                            organizationId: $stateParams.universityid,
                        };

                        return EventService.get(params);
                    },
                },
            })
            .state('courses', {
                url: '/universities/:universityid/courses/:courseid',
                templateUrl: 'modules/course/course.view.html',
                controller: 'CourseController',
                controllerAs: 'vm',
                resolve: {
                    course: function getCourse($stateParams, CourseService) {

                        var params = {
                            id: $stateParams.courseid,
                            organizationId: $stateParams.universityid,
                        };

                        return CourseService.get(params);
                    },
                    events: function getEvents($stateParams, EventService) {

                        var params = {
                            groupId: $stateParams.courseid,
                        };

                        return EventService.get(params);
                    },
                    users: function getUserFromCourse($stateParams,
                        UserService) {

                        var params = {
                            groupId: $stateParams.courseid,
                        };

                        return UserService.get(params);
                    },
                },
            })
            .state('events', {
                url: '/events/:eventid/',
                templateUrl: 'modules/events/event.view.html',
                controller: 'EventController',
                controllerAs: 'vm',
                resolve: {
                    event: function getEvent($stateParams, EventService) {
                        return EventService.show($stateParams.eventid);
                    },
                },
            });

        $urlRouterProvider.otherwise('/');
    })
    .config(function defineInterceptors($httpProvider) {

        var contentType = 'application/json';

        $httpProvider.interceptors.push('HttpInterceptor');
        $httpProvider.defaults.headers.post['Content-Type'] = contentType;
        $httpProvider.useApplyAsync(true);
    })
    .config(function configurePushNotifications($ionicCloudProvider) {

        var settings = {
            core: {
                app_id: '00a3ef3f',
            },
            push: {
                sender_id: '249127269023',
                pluginConfig: {
                    ios: {
                        alert: true,
                        badge: true,
                        sound: true,
                        vibrate: true,
                    },
                },
            },
        };

        $ionicCloudProvider.init(settings);
    })
    .config(function setTabsLayout($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.views.swipeBackEnabled(false);
    });
