/**
 * Controller to handle the search events directive
 */
(function EventSearchControllerWrapper() {

    'use strict';

    function EventSearchController($scope) {

        function setZero(property) {
            return function setPropertyToZero(element) {
                element.style[property] = '0';
            }
        }

        function setTopNormal(element) {
            element.style.top = '';
        }

        function setTopSearch(element) {
            element.style.setProperty('top', '21px', 'important');
        }

        function setBottomNormal(element) {
            element.style.bottom = '';
        }

        function displayNone(element) {
            element.style.display = 'none';
        }

        function displayBlock(element) {
            element.style.display = 'block';
        }

        function displayFlex(element) {
            element.style.display = '';
        }

        $scope.activateSearch = function activateSearchResultBox() {
            $scope.searchEnabled = true;
            document.querySelectorAll('.bar-stable').forEach(displayNone);
            document.querySelectorAll('.tabs').forEach(displayNone);
            document.querySelectorAll('.has-header').forEach(setTopSearch);
            document.querySelectorAll('.has-tabs').forEach(setZero('bottom'));
        };

        $scope.disableSearch = function disableSearchResultBox() {
            $scope.searchTerm = '';
            $scope.searchEnabled = false;
            document.querySelectorAll('.bar-stable').forEach(displayFlex);
            document.querySelectorAll('.tabs').forEach(displayFlex);
            document.querySelectorAll('.has-header').forEach(setTopNormal);
            document.querySelectorAll('.has-tabs').forEach(setBottomNormal);
        }

        $scope.$on('disableSearch', $scope.disableSearch);
    }

    function EventSearch() {

        var directiveOptions = {
            restrict: 'E',
            replace: true,
            templateUrl: 'modules/calendar/event-search.view.html',
            scope: {
                events: '=',
                searchEnabled: '=',
                searchTerm: '=',
            },
            controller: EventSearchController,
            controllerAs: 'vm',
        };

        return directiveOptions;
    }

    angular
        .module('remindr')
        .directive('eventSearch', EventSearch);

    EventSearchController.$inject = ['$scope'];
}());
