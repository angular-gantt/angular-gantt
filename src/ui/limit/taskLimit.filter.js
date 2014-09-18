gantt.filter('ganttTaskLimit', [function () {
    // Returns only the tasks which are visible on the screen
    // Use the task width and position to decide if a task is still visible

    return function(input, scroll_left, scroll_width, $scope) {
        var res = [];
        for(var i = 0, l = input.length; i<l; i++) {
            var task = input[i];

            if (task.isMoving) {
                // If the task is moving, be sure to keep it existing.
                res.push(task);
            } else {
                // If the task can be drawn with gantt columns only.
                if (task.to > $scope.$parent.gantt.getFirstColumn().date && task.from < $scope.$parent.gantt.getLastColumn().getEndDate()) {

                    // If task has a visible part on the screen
                    if (task.left >= scroll_left && task.left <= scroll_left + scroll_width ||
                        task.left + task.width >= scroll_left && task.left + task.width <= scroll_left + scroll_width ||
                        task.left < scroll_left && task.left + task.width > scroll_left + scroll_width) {

                        res.push(task);
                    }
                }
            }

        }
        return res;
    };
}]);