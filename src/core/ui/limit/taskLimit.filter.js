(function(){
    'use strict';
    angular.module('gantt').filter('ganttTaskLimit', [function() {
        // Returns only the tasks which are visible on the screen
        // Use the task width and position to decide if a task is still visible

        return function(input, gantt) {
            var firstColumn = gantt.columnsManager.getFirstColumn();
            var lastColumn = gantt.columnsManager.getLastColumn();

            if (firstColumn !== undefined && lastColumn !== undefined) {
                var res = [];

                var scrollLeft = gantt.scroll.getScrollLeft();
                var scrollContainerWidth = gantt.scroll.getScrollContainerWidth();

                for (var i = 0, l = input.length; i < l; i++) {
                    var task = input[i];

                    if (task.active) {
                        res.push(task);
                    } else {
                        // If task has a visible part on the screen
                        if (!scrollContainerWidth ||
                            task.left >= scrollLeft && task.left <= scrollLeft + scrollContainerWidth ||
                            task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollContainerWidth ||
                            task.left < scrollLeft && task.left + task.width > scrollLeft + scrollContainerWidth) {

                            res.push(task);
                        }
                    }
                }

                return res;
            } else {
                return input.splice();
            }
        };
    }]);
}());

