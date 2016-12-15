angular
    .module('remindr')
    .factory('Event', function(RestResource) {

        var url = '';

        function get(params, callback, error) {

            return RestResource.request('get', url, params, callback, error);
        }

        function create(params, callback, error) {

            return RestResource.request('post', url, params, callback, error);
        }

        function update(id, params, callback, error) {

            var putUrl = url + id;

            return RestResource.request('put', putUrl, params, callback, error);
        }

        function remove(params, callback, error) {

            var removeUrl = url + id;

            return RestResource.request('put', removeUrl, params, callback,
                                        error);
        }

        return {
            get: get,
            create: create,
            update: update,
            remove: remove
        };
    });
