'use strict';
gantt.filter('ganttTaskLimit', ['$filter', function($filter) {
    // Returns only the tasks which are visible on the screen
    // Use the task width and position to decide if a task is still visible

    return function(input, scrollLeft, scrollWidth, $scope) {
        var res = [];
        for (var i = 0, l = input.length; i < l; i++) {
            var task = input[i];

            if (task.isMoving) {
                // If the task is moving, be sure to keep it existing.
                res.push(task);
            } else {
                // If the task can be drawn with gantt columns only.
                if (task.to > $scope.$parent.gantt.getFirstColumn().date && task.from < $scope.$parent.gantt.getLastColumn().getEndDate()) {

                    // If task has a visible part on the screen
                    if (task.left >= scrollLeft && task.left <= scrollLeft + scrollWidth ||
                        task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollWidth ||
                        task.left < scrollLeft && task.left + task.width > scrollLeft + scrollWidth) {

                        res.push(task);
                    }
                }
            }

        }

        if ($scope.filterTask) {
            res = $filter('filter')(res, $scope.filterTask, $scope.filterTaskComparator);
        }

        return res;
    };
}]);