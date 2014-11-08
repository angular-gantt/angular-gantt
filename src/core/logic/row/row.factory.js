'use strict';
gantt.factory('GanttRow', ['GanttTask', 'moment', '$filter', function(Task, moment, $filter) {
    var Row = function(rowsManager, model) {
        this.rowsManager = rowsManager;
        this.model = model;

        this.from = undefined;
        this.to = undefined;

        this.tasksMap = {};
        this.tasks = [];
        this.filteredTasks = [];
        this.visibleTasks = [];
    };

    // Adds a task to a specific row. Merges the task if there is already one with the same id
    Row.prototype.addTask = function(taskModel) {
        // Copy to new task (add) or merge with existing (update)
        var task, isUpdate = false;

        this.rowsManager.gantt.objectModel.cleanTask(taskModel);
        if (taskModel.id in this.tasksMap) {
            task = this.tasksMap[taskModel.id];
            if (task.model === taskModel) {
                return;
            }
            task.model = taskModel;
            isUpdate = true;
        } else {
            task = new Task(this, taskModel);
            this.tasksMap[taskModel.id] = task;
            this.tasks.push(task);
            this.filteredTasks.push(task);
            this.visibleTasks.push(task);

            if (this.model.tasks === undefined) {
                this.model.tasks = [];
            }
            if (this.model.tasks.indexOf(taskModel) === -1) {
                this.model.tasks.push(taskModel);
            }
        }

        this.sortTasks();
        this.setFromToByTask(task);

        if (isUpdate) {
            this.rowsManager.gantt.api.tasks.raise.change(task);
        } else {
            this.rowsManager.gantt.api.tasks.raise.add(task);
        }

        return task;
    };

    // Removes the task from the existing row and adds it to he current one
    Row.prototype.moveTaskToRow = function(task) {
        var oldRow = task.row;
        oldRow.removeTask(task.model.id, true);
        oldRow.updateVisibleTasks();

        this.tasksMap[task.model.id] = task;
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
            var filterTask = this.rowsManager.gantt.$scope.filterTask;
            if (typeof(filterTask) === 'object') {
                filterTask = {model: filterTask};
            }

            var filterTaskComparator = this.rowsManager.gantt.$scope.filterTaskComparator;
            if (typeof(filterTaskComparator) === 'function') {
                filterTaskComparator = function(actual, expected) {
                    return this.rowsManager.gantt.$scope.filterRowComparator(actual.model, expected.model);
                };
            }

            this.filteredTasks = $filter('filter')(this.tasks, filterTask, filterTaskComparator);
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
                if (task.model.id === taskId) {
                    removedTask = task;
                    this.tasks.splice(i, 1); // Remove from array

                    // Update earliest or latest date info as this may change
                    if (this.from - task.model.from === 0 || this.to - task.model.to === 0) {
                        this.setFromTo();
                    }
                }
            }

            for (i = this.filteredTasks.length - 1; i >= 0; i--) {
                task = this.filteredTasks[i];
                if (task.model.id === taskId) {
                    this.filteredTasks.splice(i, 1); // Remove from filtered array
                }
            }

            for (i = this.visibleTasks.length - 1; i >= 0; i--) {
                task = this.visibleTasks[i];
                if (task.model.id === taskId) {
                    this.visibleTasks.splice(i, 1); // Remove from visible array
                }
            }

            if (this.model.tasks !== undefined) {
                var taskIndex = this.model.tasks.indexOf(removedTask.model);
                if (taskIndex > -1) {
                    this.model.tasks.splice(taskIndex, 1);
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
            this.from = moment(task.model.from);
        } else if (task.model.from < this.from) {
            this.from = moment(task.model.from);
        }

        if (this.to === undefined) {
            this.to = moment(task.model.to);
        } else if (task.model.to > this.to) {
            this.to = moment(task.model.to);
        }
    };

    Row.prototype.sortTasks = function() {
        this.tasks.sort(function(t1, t2) {
            return t1.left - t2.left;
        });
    };

    Row.prototype.clone = function() {
        var clone = new Row(this.rowsManager, angular.copy(this));
        for (var i = 0, l = this.tasks.length; i < l; i++) {
            clone.addTask(this.tasks[i].model);
        }
        return clone;
    };

    return Row;
}]);
