(function(){
    'use strict';
    angular.module('gantt').filter('ganttTaskLimit', [function() {
        // Returns only the tasks which are visible on the screen
        // Use the task width and position to decide if a task is still visible

        return function(input, gantt) {
            var firstColumn = gantt.columnsManager.getFirstColumn();
            var lastColumn = gantt.columnsManager.getLastColumn();

            var fromDate = gantt.options.value('fromDate');
            var toDate = gantt.options.value('toDate');


            if (fromDate === undefined) {
                fromDate = firstColumn.date;
            }

            if (toDate === undefined) {
                toDate = lastColumn.endDate;
            }

            if (firstColumn !== undefined && lastColumn !== undefined) {
                var res = [];

                var scrollLeft = gantt.scroll.getScrollLeft();
                var scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth();

                for (var i = 0, l = input.length; i < l; i++) {
                    var task = input[i];

                    if (task.active) {
                        res.push(task);
                    } else {
                        // If the task can be drawn with gantt columns only.
                        if (task.model.to >= fromDate && task.model.from <= toDate) {

                            // If task has a visible part on the screen
                            if (!scrollContainerWidth ||
                                task.left >= scrollLeft && task.left <= scrollLeft + scrollContainerWidth ||
                                task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollContainerWidth ||
                                task.left < scrollLeft && task.left + task.width > scrollLeft + scrollContainerWidth) {

                                res.push(task);
                            }
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

