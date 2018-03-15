/**
 * Controller to handle the landing page
 */
(function ToastServiceWrapper() {

    'use strict';

    function ToastServiceController($cordovaToast, $ionicLoading) {

        function showToast(message) {

            if (window.cordova) {
                return $cordovaToast.showLongBottom(message).then();
            }

            console.info(message);
        }

        function error(object) {

            $ionicLoading.hide();

            var message = 'Something went wrong, please try again later';

            if (typeof object !== 'string') {

                if (object.data) {
                    message = object.data.message;
                }
            } else {
                message = object;
            }

            showToast(message);
        }

        return {
            error: error,
            show: showToast,
        };
    }

    angular
        .module('remindr')
        .service('Toast', ToastServiceController);

    ToastServiceController.$inject = ['$cordovaToast', '$ionicLoading'];
}());
