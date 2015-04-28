(function(){
    'use strict';
    angular.module('gantt.overlap', ['gantt', 'gantt.overlap.templates']).directive('ganttOverlap', ['moment',function(moment) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
                // Add other option attributes for this plugin
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.enabled){
                    api.tasks.on.change(scope, function (task) {
                        // on every task change check for overlaps
                        scope.handleOverlaps(task);
                    });
                }

                var overlapsTasks = {};

                scope.handleOverlaps = function (changedTask) {
                    // Get all the tasks in the row.
                    var allTasks = changedTask.row.tasks;

                    var newOverlapsTasks = {};
                    var removedOverlapsTasks = {};

                    angular.forEach(allTasks, function(task) {
                        removedOverlapsTasks[task.model.id] = task;
                    });

                    // set overlaps flag to each task that overlaps other task.
                    angular.forEach(allTasks,function(currentTask){
                        var currentStart,currentEnd;
                        if (currentTask.model.from.isBefore(currentTask.to)){
                            currentStart = currentTask.model.from;
                            currentEnd = currentTask.model.to;
                        } else {
                            currentStart = currentTask.model.to;
                            currentEnd = currentTask.model.from;
                        }
                        var currentRange = moment().range(currentStart, currentEnd);
                        angular.forEach(allTasks,function(task){
                            if (currentTask.model.id !== task.model.id){
                                var start,end;
                                if (task.model.from.isBefore(task.model.to)){
                                    start = task.model.from;
                                    end = task.model.to;
                                } else {
                                    start = task.model.to;
                                    end = task.model.from;
                                }
                                var range = moment().range(start, end);
                                if (range.overlaps(currentRange)){
                                    if (!overlapsTasks.hasOwnProperty(task.model.id)) {
                                        newOverlapsTasks[task.model.id] = task;
                                    }
                                    delete removedOverlapsTasks[task.model.id];
                                    if (!overlapsTasks.hasOwnProperty(currentTask.model.id)) {
                                        newOverlapsTasks[currentTask.model.id] = currentTask;
                                    }
                                    delete removedOverlapsTasks[currentTask.model.id];
                                }
                            }
                        });
                    });

                    angular.forEach(removedOverlapsTasks, function(task) {
                        task.$element.removeClass('gantt-task-overlaps');
                        delete overlapsTasks[task.model.id];
                    });

                    angular.forEach(newOverlapsTasks, function(task) {
                        task.$element.addClass('gantt-task-overlaps');
                        overlapsTasks[task.model.id] = task;
                    });

                    overlapsTasks = newOverlapsTasks;
                };
            }
        };
    }]);
}());

