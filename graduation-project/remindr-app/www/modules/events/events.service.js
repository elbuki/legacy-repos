/**
 * Controller to handle the landing page
 */
(function EventServiceWrapper() {

    'use strict';

    function EventService(RestResource) {

        function get(params) {

            var resource = 'events';

            return RestResource.request('get', resource, params || {});
        }

        function create(params) {

            var resource = 'events';

            return RestResource.request('post', resource, params);
        }

        function update(params) {

            var resource = 'events/' + params._id;

            return RestResource.request('put', resource, params);
        }

        function remove(id) {

            var resource = 'events/' + id;

            return RestResource.request('delete', resource);
        }

        function show(id) {

            var resource = 'events?id=' + id;

            return RestResource.request('get', resource);
        }

        return {
            get: get,
            create: create,
            update: update,
            remove: remove,
            show: show,
        };
    }

    angular
        .module('remindr')
        .service('EventService', EventService);

    EventService.$inject = ['RestResource'];
}());
