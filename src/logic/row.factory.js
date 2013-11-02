gantt.factory('Row', ['Task', 'dateFunctions', function (Task, df) {
    var Row = function(id, description, order, data) {
        var self = this;

        self.id = id;
        self.description = description;
        self.order= order;
        self.tasksMap = {};
        self.tasks = [];
        self.data = data;

        // Adds a task to a specific row. Merges the task if there is already one with the same id
        self.addTask = function(taskData) {
            // Copy to new task (add) or merge with existing (update)
            var task;

            if (taskData.id in self.tasksMap) {
                task = self.tasksMap[taskData.id];
                task.copy(taskData);
            } else {
                task = new Task(taskData.id, taskData.subject, taskData.color, taskData.from, taskData.to, taskData.data);
                self.tasksMap[taskData.id] = task;
                self.tasks.push(task);
            }

            self.findEarliestFromDate(task);
            return task;
        };

        // Remove the specified task from the row
        self.removeTask = function(taskId) {
            if (taskId in self.tasksMap) {
                delete self.tasksMap[taskId]; // Remove from map

                for (var i = 0, l = self.tasks.length; i < l; i++) {
                    var task = self.tasks[i];
                    if (task.id === taskId) {
                        self.tasks.splice(i, 1); // Remove from array

                        // Update earliest date info as this may change
                        if (self.minFromDate - task.from === 0) {
                            self.minFromDate = undefined;
                            for (var j = 0, k = self.tasks.length; j < k; j++) {
                                self.findEarliestFromDate(self.tasks[j]);
                            }
                        }

                        return task;
                    }
                }
            }
        };

        // Calculate the earliest from date of all tasks in a row
        self.findEarliestFromDate = function (task) {
            if (self.minFromDate === undefined) {
                self.minFromDate = df.clone(task.from);
            } else if (task.from < self.minFromDate) {
                self.minFromDate = df.clone(task.from);
            }
        };

        self.copy = function(row) {
            self.description = row.description;
            self.data = row.data;

            if (row.order !== undefined) {
                self.order = row.order;
            }
        };

        self.clone = function() {
            var clone = new Row(self.id, self.description, self.order, self.data);
            for (var i = 0, l = self.tasks.length; i < l; i++) {
                clone.addTask(self.tasks[i].clone());
            }

            return clone;
        };
    };

    return Row;
}]);