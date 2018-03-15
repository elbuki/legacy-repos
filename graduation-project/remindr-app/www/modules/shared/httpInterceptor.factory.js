/**
 * Controller to handle the landing page
 */
(function HttpInterceptorWrapper() {

    'use strict';

    function HttpInterceptor($q, $injector, iOSNai) {

        var responses = {
            request: function(config) {

                var session = JSON.parse(localStorage.getItem('currentUser'));

                if (session && session.user) {

                    var token = session.user.token;

                    config.headers.Authorization = token;
                }

                iOSNai.show();

                return config;
            },
            response: function handleResponse(response) {

                iOSNai.hide();

                return response;
            },
            responseError: function handleErrors(response) {

                iOSNai.hide();

                return $q.reject(response);
            },
        };

        return responses;
    }

    angular
        .module('remindr')
        .factory('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['$q', '$injector', 'iOSNai'];
}());
