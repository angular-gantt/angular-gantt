'use strict';
gantt.directive('ganttLimitUpdater', ['$timeout', 'debounce', function($timeout, debounce) {
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
                $scope.$apply(function() {
                    scrollUpdate();
                });
            }, 5));

            $scope.$watch('gantt.width', function() {
                $timeout(function() {
                    scrollUpdate();
                }, 20, true);
            });
        }]
    };
}]);
