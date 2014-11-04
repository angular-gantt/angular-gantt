'use strict';
gantt.factory('GanttRow', ['GanttTask', 'moment', '$filter', function(Task, moment, $filter) {
    var Row = function(id, rowsManager, name, order, height, color, classes, data) {
        this.id = id;
        this.rowsManager = rowsManager;
        this.name = name;
        this.order = order;
        this.height = height;
        this.color = color;
        this.classes = classes;
        this.from = undefined;
        this.to = undefined;
        this.tasksMap = {};
        this.tasks = [];
        this.filteredTasks = [];
        this.visibleTasks = [];
        this.data = data;
    };

    // Adds a task to a specific row. Merges the task if there is already one with the same id
    Row.prototype.addTask = function(taskData) {
        // Copy to new task (add) or merge with existing (update)
        var task;

        if (taskData.id in this.tasksMap) {
            task = this.tasksMap[taskData.id];
            task.copy(taskData);
        } else {
            task = new Task(taskData.id, this, taskData.name, taskData.color, taskData.classes, taskData.priority, taskData.from, taskData.to, taskData.data, taskData.est, taskData.lct, taskData.progress);
            this.tasksMap[taskData.id] = task;
            this.tasks.push(task);
            this.filteredTasks.push(task);
            this.visibleTasks.push(task);
        }

        this.sortTasks();
        this.setFromToByTask(task);
        this.rowsManager.gantt.api.tasks.raise.add(task);
        return task;
    };

    // Removes the task from the existing row and adds it to he current one
    Row.prototype.moveTaskToRow = function(task) {
        var oldRow = task.row;
        oldRow.removeTask(task.id, true);
        oldRow.updateVisibleTasks();

        this.tasksMap[task.id] = task;
        this.tasks.push(task);
        this.filteredTasks.push(task);
        this.visibleTasks.push(task);
        task.row = this;

        this.sortTasks();
        this.setFromToByTask(task);

        task.updatePosAndSize();
        this.updateVisibleTasks();

        this.rowsManager.gantt.api.tasks.raise.move(task, oldRow);

    };

    Row.prototype.updateVisibleTasks = function() {
        if (this.rowsManager.gantt.$scope.filterTask) {
            this.filteredTasks = $filter('filter')(this.tasks, this.rowsManager.gantt.$scope.filterTask, this.rowsManager.gantt.$scope.filterTaskComparator);
        } else {
            this.filteredTasks = this.tasks.slice(0);
        }
        this.visibleTasks = $filter('ganttTaskLimit')(this.filteredTasks, this.rowsManager.gantt);
    };

    Row.prototype.updateTasksPosAndSize = function() {
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.tasks[j].updatePosAndSize();
        }
    };

    // Remove the specified task from the row
    Row.prototype.removeTask = function(taskId, disableEmit) {
        if (taskId in this.tasksMap) {
            delete this.tasksMap[taskId]; // Remove from map

            var task;
            var removedTask;
            for (var i = this.tasks.length - 1; i >= 0; i--) {
                task = this.tasks[i];
                if (task.id === taskId) {
                    removedTask = task;
                    this.tasks.splice(i, 1); // Remove from array

                    // Update earliest or latest date info as this may change
                    if (this.from - task.from === 0 || this.to - task.to === 0) {
                        this.setFromTo();
                    }
                }
            }

            for (i = this.filteredTasks.length - 1; i >= 0; i--) {
                task = this.filteredTasks[i];
                if (task.id === taskId) {
                    this.filteredTasks.splice(i, 1); // Remove from filtered array
                }
            }

            for (i = this.visibleTasks.length - 1; i >= 0; i--) {
                task = this.visibleTasks[i];
                if (task.id === taskId) {
                    this.visibleTasks.splice(i, 1); // Remove from visible array
                }
            }

            if (!disableEmit) {
                this.rowsManager.gantt.api.tasks.raise.remove(removedTask);
            }

            return removedTask;
        }
    };

    // Calculate the earliest from and latest to date of all tasks in a row
    Row.prototype.setFromTo = function() {
        this.from = undefined;
        this.to = undefined;
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.setFromToByTask(this.tasks[j]);
        }
    };

    Row.prototype.setFromToByTask = function(task) {
        if (this.from === undefined) {
            this.from = moment(task.from);
        } else if (task.from < this.from) {
            this.from = moment(task.from);
        }

        if (this.to === undefined) {
            this.to = moment(task.to);
        } else if (task.to > this.to) {
            this.to = moment(task.to);
        }
    };

    Row.prototype.sortTasks = function() {
        this.tasks.sort(function(t1, t2) {
            return t1.left - t2.left;
        });
    };

    Row.prototype.copy = function(row) {
        this.name = row.name;
        this.height = row.height;
        this.color = row.color;
        this.classes = row.classes;
        this.data = row.data;

        if (row.order !== undefined) {
            this.order = row.order;
        }
    };

    Row.prototype.clone = function() {
        var clone = new Row(this.id, this.rowsManager, this.name, this.order, this.height, this.color, this.classes, this.data);
        for (var i = 0, l = this.tasks.length; i < l; i++) {
            clone.addTask(this.tasks[i].clone());
        }
        return clone;
    };

    return Row;
}]);
