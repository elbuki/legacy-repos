/**
 * Controller to handle the landing page
 */
(function DashboardControllerWrapper() {

    'use strict';

    function DashboardController($rootScope, $timeout, enrollments) {

        var ONE_SECOND = 1000;

        $timeout(function haltToLoadNotifications() {
            $rootScope.$broadcast('enrollments:update', enrollments.data);
        }, ONE_SECOND);
    }

    angular
        .module('remindr')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [
        '$rootScope', '$timeout', 'enrollments'
    ];
}());
