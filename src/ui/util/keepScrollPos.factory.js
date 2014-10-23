'use strict';
gantt.factory('ganttKeepScrollPos', ['$timeout', function($timeout) {
    // Make sure the scroll position will be at the same place after the tasks or columns changed

    function keepScrollPos($scope, fn) {
        return function() {
            if ($scope.template.scrollable) {
                var el = $scope.template.scrollable.$element[0];

                // Save scroll position
                var oldScrollLeft = el.scrollLeft;
                var left = $scope.gantt.getFirstColumn();

                // Execute Gantt changes
                fn.apply(this, arguments);

                // Re-apply scroll position
                left = left === undefined ? 0 : $scope.gantt.getColumnByDate(left.date).left;
                el.scrollLeft = left + oldScrollLeft;

                // Workaround: Set scrollLeft again after the DOM has changed as the assignment of scrollLeft before may not have worked when the scroll area was too tiny.
                if (el.scrollLeft !== left + oldScrollLeft) {
                    $timeout(function() {
                        el.scrollLeft = left + oldScrollLeft;
                    }, 0, false);
                }
            } else {
                // Execute Gantt changes
                fn.apply(this, arguments);
            }
        };
    }

    return keepScrollPos;
}]);
