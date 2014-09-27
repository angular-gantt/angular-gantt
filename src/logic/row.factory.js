'use strict';
gantt.factory('Row', ['Task', 'moment', function(Task, moment) {
    var Row = function(id, gantt, name, order, data) {
        var self = this;

        self.id = id;
        self.gantt = gantt;
        self.name = name;
        self.order = order;
        self.from = undefined;
        self.to = undefined;
        self.tasksMap = {};
        self.tasks = [];
        self.visibleTasks = [];
        self.data = data;

        // Adds a task to a specific row. Merges the task if there is already one with the same id
        self.addTask = function(taskData) {
            // Copy to new task (add) or merge with existing (update)
            var task;

            if (taskData.id in self.tasksMap) {
                task = self.tasksMap[taskData.id];
                task.copy(taskData);
            } else {
                task = new Task(taskData.id, self, taskData.name, taskData.color, taskData.classes, taskData.priority, taskData.from, taskData.to, taskData.data, taskData.est, taskData.lct);
                self.tasksMap[taskData.id] = task;
                self.tasks.push(task);
            }

            self.sortTasks();
            self.setFromToByTask(task);
            return task;
        };

        // Removes the task from the existing row and adds it to he current one
        self.moveTaskToRow = function(task) {
            task.row.removeTask(task.id);
            self.tasksMap[task.id] = task;
            self.tasks.push(task);
            self.setFromTo();
            task.row = self;
            task.updatePosAndSize();
        };

        // Remove the specified task from the row
        self.removeTask = function(taskId) {
            if (taskId in self.tasksMap) {
                delete self.tasksMap[taskId]; // Remove from map

                for (var i = 0, l = self.tasks.length; i < l; i++) {
                    var task = self.tasks[i];
                    if (task.id === taskId) {
                        self.tasks.splice(i, 1); // Remove from array

                        // Update earliest or latest date info as this may change
                        if (self.from - task.from === 0 || self.to - task.to === 0) {
                            self.setFromTo();
                        }

                        return task;
                    }
                }
            }
        };

        // Calculate the earliest from and latest to date of all tasks in a row
        self.setFromTo = function() {
            self.from = undefined;
            self.to = undefined;
            for (var j = 0, k = self.tasks.length; j < k; j++) {
                self.setFromToByTask(self.tasks[j]);
            }
        };

        self.setFromToByTask = function(task) {
            if (self.from === undefined) {
                self.from = moment(task.from);
            } else if (task.from < self.from) {
                self.from = moment(task.from);
            }

            if (self.to === undefined) {
                self.to = moment(task.to);
            } else if (task.to > self.to) {
                self.to = moment(task.to);
            }
        };

        self.sortTasks = function() {
            self.tasks.sort(function(t1, t2) {
                return t1.left - t2.left;
            });
        };

        self.copy = function(row) {
            self.name = row.name;
            self.data = row.data;

            if (row.order !== undefined) {
                self.order = row.order;
            }
        };

        self.clone = function() {
            var clone = new Row(self.id, self.gantt, self.name, self.order, self.data);
            for (var i = 0, l = self.tasks.length; i < l; i++) {
                clone.addTask(self.tasks[i].clone());
            }

            return clone;
        };
    };

    return Row;
}]);
