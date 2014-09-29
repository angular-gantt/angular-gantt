'use strict';
gantt.directive('ganttLimitUpdater', ['$timeout', function($timeout) {
    // Updates the limit filters if the user scrolls the gantt chart

    return {
        restrict: 'A',
        controller: ['$scope', '$element', function($scope, $element) {
            var el = $element[0];
            var scrollUpdate = function() {
                $scope.scrollStart = el.scrollLeft;
                $scope.scrollWidth = el.offsetWidth;
            };

            $element.bind('scroll', function() {
                $scope.$apply(function() {
                    scrollUpdate();
                });
            });

            $scope.$watch('gantt.width', function() {
                $timeout(function() {
                    scrollUpdate();
                }, 20, true);
            });
        }]
    };
}]);
