/**
 * Controller to handle the landing page
 */
(function UserServiceWrapper() {

    'use strict';

    function UserService(RestResource) {

        var CURRENT_USER_KEY = 'currentUser';

        function get(params) {

            var resource = 'users';

            return RestResource.request('get', resource, params);
        }

        function login(params) {

            var resource = 'authenticate';

            return RestResource.request('post', resource, params);
        }

        function logout() {

            var resource = 'logout';

            return RestResource.request('delete', resource);
        }

        function register(params) {

            var resource = 'users/register';

            return RestResource.request('post', resource, params);
        }

        function update(params) {

            var resource = 'users';

            return RestResource.request('put', resource, params);
        }

        function getData() {

            var data = localStorage.getItem(CURRENT_USER_KEY);

            if (!data) {
                return {};
            }

            return JSON.parse(data);
        }

        function setData(response) {

            var currentSession = getData();

            currentSession.user = response.data;

            var data = JSON.stringify(currentSession);

            localStorage.setItem(CURRENT_USER_KEY, data);
        }

        function removeData() {

            localStorage.removeItem(CURRENT_USER_KEY);
        }

        return {
            get: get,
            login: login,
            logout: logout,
            register: register,
            update: update,
            getData: getData,
            setData: setData,
            removeData: removeData,
        };
    }

    angular
        .module('remindr')
        .service('UserService', UserService);

    UserService.$inject = ['RestResource'];
}());
