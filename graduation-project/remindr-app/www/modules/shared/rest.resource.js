/**
 * Data Service factory
 */
(function() {
    'use strict';

    function RestResource($http) {
        function request(method, resource, params) {

            var api = 'https://remindr-api.herokuapp.com/';

            // if (typeof window.cordova === 'undefined') {
            //     api = 'http://127.0.0.1:5000/';
            // }

            resource = api + resource;

            if (typeof $http[method] === 'function') {
                /**
                 * Verify the request type, to send the params as json object
                 * in POST case.
                 **/
                var paramsData = method === 'post' || method === 'put' ?
                    params : {
                        params: params
                    };
                /**
                 * Using https://docs.angularjs.org/api/ng/service/$http
                 **/
                return $http[method](resource, paramsData);
            }
        }
        return {
            request: request
        };
    }

    angular
        .module('remindr')
        .factory('RestResource', RestResource);

    RestResource.$inject = ['$http'];
})();
