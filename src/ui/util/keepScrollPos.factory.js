gantt.factory('keepScrollPos',['$timeout', function ($timeout) {
    // Make sure the scroll position will be at the same place after the tasks or columns changed

    function keepScrollPos($scope, fn) {
        return function() {
            var self = this;
            var argz = arguments;

            $timeout(function() {
                var el = $scope.ganttScroll[0];
                var oldScrollLeft = el.scrollLeft;
                var left = $scope.gantt.getFirstColumn();

                $scope.$apply(function() {
                    fn.apply(self, argz);
                });

                left = left === undefined ? 0: $scope.gantt.getColumnByDate(left.date).left * $scope.getPxToEmFactor();
                el.scrollLeft = left + oldScrollLeft;
            }, 0, false);
        };
    }

    return keepScrollPos;
}]);