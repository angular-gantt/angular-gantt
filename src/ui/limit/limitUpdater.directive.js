gantt.directive('ganttLimitUpdater', ['$timeout', function ($timeout) {
    // Updates the limit filters if the user scrolls the gantt chart

    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            var el = $element[0];
            var scrollUpdate = function() {
                $scope.scroll_start = el.scrollLeft / $scope.getPxToEmFactor();
                $scope.scroll_width = el.offsetWidth / $scope.getPxToEmFactor();
            };

            $element.bind('scroll', function() { $scope.$apply(function() { scrollUpdate(); }); });

            $scope.$watch('gantt.width', function(newValue, oldValue) {
                $timeout(function() {
                    scrollUpdate();
                }, 20, true);
            });
        }]
    };
}]);