gantt.directive('ganttLimitUpdater', ['$timeout', function ($timeout) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', function ($scope, $element) {
            var el = $element[0];
            var update = function() {
                var emPxFactor = $scope.ganttScroll.children()[0].offsetWidth / $scope.ganttInnerWidth;
                $scope.scroll_start = el.scrollLeft / emPxFactor;
                $scope.scroll_width = el.offsetWidth / emPxFactor;
            };

            $element.bind('scroll', function() { $scope.$apply(function() { update(); }); });

            $scope.$watch('ganttInnerWidth', function(newValue, oldValue) {
                $timeout(function() {
                    update();
                }, 20, true);
            });
        }]
    };
}]);