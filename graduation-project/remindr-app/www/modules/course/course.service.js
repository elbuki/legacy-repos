/**
 * Controller to handle the landing page
 */
(function CourseServiceWrapper() {

    'use strict';

    function CourseService(RestResource) {

        function get(params) {

            var resource = 'organizations/' + params.organizationId + '/groups';

            return RestResource.request('get', resource, params);
        }

        function create(params) {

            var resource = 'organizations/' + params.organizationId + '/groups';

            return RestResource.request('post', resource, params);
        }

        function update(params, teacher) {

            var resource = 'organizations/' + params.organization +
                '/groups/' + params._id;

            if (teacher) {
                resource += '?teacher_change=true'
            }

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
        .service('CourseService', CourseService);

    CourseService.$inject = ['RestResource'];
}());
