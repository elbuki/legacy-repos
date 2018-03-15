/**
 * Controller to handle the landing page
 */
(function EnrollmentServiceWrapper() {

    'use strict';

    function EnrollmentService(RestResource) {

        function get(params) {

            var resource = 'enrollments';

            return RestResource.request('get', resource, params);
        }

        function create(params) {

            var resource = 'enrollments';

            return RestResource.request('post', resource, params);
        }

        function update(params) {

            var resource = 'enrollments/' + params._id;

            return RestResource.request('put', resource, params);
        }

        function remove(params) {

            var resource = 'enrollments/' + params._id;

            return RestResource.request('delete', resource);
        }

        function removeRequested(params) {

            var resource = 'enrollments/remove_requested';

            return RestResource.request('put', resource, params);
        }

        function addMember(params) {

            var resource = 'enrollments/add_member';

            return RestResource.request('put', resource, params);
        }

        function addRequested(params) {

            var resource = 'enrollments/add_requested';

            return RestResource.request('put', resource, params);
        }

        function addRemovalRequest(params) {

            var resource = 'enrollments/add_removal';

            return RestResource.request('put', resource, params);
        }

        function removeRemoval(params) {

            var resource = 'enrollments/remove_removal';

            return RestResource.request('put', resource, params);
        }

        function markAsRead(params) {

            var resource = 'enrollments/mark_read';

            return RestResource.request('put', resource, params);
        }

        function makeAsTeacher(params) {

            var resource = 'enrollments/make_as_subadmin';

            return RestResource.request('put', resource, params);
        }

        function makeAsStudent(params) {

            var resource = 'enrollments/make_as_member';

            return RestResource.request('put', resource, params);
        }

        function removeUser(params) {

            var resource = 'enrollments/remove_user';

            return RestResource.request('put', resource, params);
        }

        function unenrollGroups(params) {

            var resource = 'enrollments/unenroll_groups';

            return RestResource.request('put', resource, params);
        }

        return {
            get: get,
            create: create,
            update: update,
            remove: remove,
            removeRequested: removeRequested,
            addMember: addMember,
            addRequested: addRequested,
            addRemovalRequest: addRemovalRequest,
            removeRemoval: removeRemoval,
            markAsRead: markAsRead,
            makeAsTeacher: makeAsTeacher,
            makeAsStudent: makeAsStudent,
            removeUser: removeUser,
            unenrollGroups: unenrollGroups,
        };
    }

    angular
        .module('remindr')
        .service('EnrollmentService', EnrollmentService);

    EnrollmentService.$inject = ['RestResource'];
}());
