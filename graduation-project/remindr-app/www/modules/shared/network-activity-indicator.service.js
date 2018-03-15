/**
 * Controller to handle the landing page
 */
(function NetworkActivityIndicatorWrapper() {

    'use strict';

    function NetworkActivityIndicatorController() {

        var ready = false;

        function show() {

            if (!window.cordova || !ready) {
                return;
            }

            NetworkActivityIndicator.show();
        }

        function hide() {

            if (!window.cordova || !ready) {
                return;
            }

            NetworkActivityIndicator.hide();
        }

        function wereReady() {
            ready = true;
        }

        return {
            show: show,
            hide: hide,
            wereReady: wereReady,
        };
    }

    angular
        .module('remindr')
        .service('iOSNai', NetworkActivityIndicatorController);
}());
