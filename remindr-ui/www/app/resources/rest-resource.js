(function() {
    'use strict';

    function RestResource($http) {

        function request(method, resource, params, responseCallback,
                                                                errorCallback) {

            if (typeof $http[method] === 'function') {

                var paramsData = method === 'post' || method === 'put' ?
                    params : {
                        params: params
                    };

                return $http[method](resource, paramsData)
                    .then(responseCallback)
                    .catch(errorCallback);
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
