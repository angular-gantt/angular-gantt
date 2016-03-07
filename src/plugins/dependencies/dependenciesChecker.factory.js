(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesChecker', [function() {
        /**
         * Creates a new DependenciesChecker object.
         *
         * @constructor
         */
        var GanttDependenciesChecker = function(manager) {
            function handleTaskConflict(conflictsList, task) {
                if (!(task.model.id in conflictsList) && task.$element) {
                    task.$element.addClass('gantt-task-conflict');
                    conflictsList[task.model.id] = task;
                }
            }

            function handleTaskNonConflict(conflictsList, allTasks) {
                for (var i = 0, l = allTasks.length; i < l; i++) {
                    var task = allTasks[i];
                    if (!(task.model.id in conflictsList) && task.$element) {
                        task.$element.removeClass('gantt-task-conflict');
                    }
                }
            }

            /**
             * Refresh the conflict status of given tasks.
             *
             * @param tasks
             */
            this.refresh = function(tasks) {
                var allTasks = tasks.slice(0);
                var conflictsList = [];

                for (var i = 0; i < tasks.length; i++) {
                    var taskDependencies = manager.getTaskDependencies(tasks[i]);

                    for (var j = 0; j < taskDependencies.length; j++) {
                        var dependency = taskDependencies[j];

                        var fromTask = dependency.getFromTask();
                        var toTask = dependency.getToTask();

                        if (!(fromTask in allTasks)) {
                            allTasks.push(fromTask);
                        }

                        if (!(toTask in allTasks)) {
                            allTasks.push(toTask);
                        }

                        if (fromTask.model.to > toTask.model.from) {
                            handleTaskConflict(conflictsList, fromTask);
                            handleTaskConflict(conflictsList, toTask);
                        }
                    }
                }

                handleTaskNonConflict(conflictsList, allTasks);
            };

            /**
             * Remove the conflict status of given tasks.
             *
             * @param tasks
             */
            this.clear = function(tasks) {
                var allTasks = tasks.slice(0);
                handleTaskNonConflict([], allTasks);
            };

        };
        return GanttDependenciesChecker;
    }]);
}());
