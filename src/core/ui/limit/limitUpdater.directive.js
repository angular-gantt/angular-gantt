(function(){
    'use strict';
    angular.module('gantt').directive('ganttLimitUpdater', ['$timeout', 'ganttDebounce', function($timeout, debounce) {
        // Updates the limit filters if the user scrolls the gantt chart

        return {
            restrict: 'A',
            controller: ['$scope', '$element', function($scope, $element) {
                var el = $element[0];
                var scrollUpdate = function() {
                    $scope.scrollLeft = el.scrollLeft;
                    $scope.scrollWidth = el.offsetWidth;
                };

                $element.bind('scroll', debounce(function() {
                    scrollUpdate();
                }, 5));

                $scope.$watch('gantt.width', debounce(function() {
                    scrollUpdate();
                }, 20));
            }]
        };
    }]);
}());

