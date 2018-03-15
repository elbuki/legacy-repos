/**
 * Controller to handle the landing page
 */
(function UniversityServiceWrapper() {

    'use strict';

    function UniversityService(RestResource) {

        function get(params) {

            var resource = 'organizations';

            return RestResource.request('get', resource, params);
        }

        function create(params) {

            var resource = 'organizations';

            return RestResource.request('post', resource, params);
        }

        function update(params) {

            var resource = 'organizations/' + params._id;

            return RestResource.request('put', resource, params);
        }

        return {
            get: get,
            create: create,
            update: update,
        };
    }

    angular
        .module('remindr')
        .service('UniversityService', UniversityService);

    UniversityService.$inject = ['RestResource'];
}());
