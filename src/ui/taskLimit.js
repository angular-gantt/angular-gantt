gantt.filter('ganttTaskLimit', [function () {
    // Returns only the tasks which are visible on the screen
    // Use the task width and position to decide if a task is still visible

    return function(input, scroll_left, scroll_width) {
        var res = [];
        for(var i = 0, l = input.length; i<l; i++) {
            var task = input[i];
            // If task start visible on screen or end visible on screen
            if (task.left > scroll_left && task.left < scroll_left + scroll_width ||
                task.left + task.width > scroll_left && task.left + task.width < scroll_left + scroll_width) {
                    res.push(task);
            }
        }

        return res;
    };
}]);