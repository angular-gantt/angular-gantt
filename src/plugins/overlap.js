(function(){
    'use strict';
    angular.module('gantt.overlap', ['gantt', 'gantt.overlap.templates']).directive('ganttOverlap', ['moment',function(moment) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.enabled){
                    api.tasks.on.change(scope, function(task) {
                        handleOverlaps(task.row);
                    });

                    api.tasks.on.rowChange(scope, function(task, oldRow) {
                        handleOverlaps(oldRow);
                    });
                }

                function handleOverlaps(row) {
                    var allTasks = row.tasks;
                    var newOverlapsTasks = {};

                    for(var i=0, l=allTasks.length; i<l; i++) {
                        var currentTask = allTasks[i];
                        var currentRange = getRange(currentTask);

                        for(var j=i+1, k=allTasks.length; j<k; j++) {
                            var task = allTasks[j];
                            var range = getRange(task);

                            if (range.overlaps(currentRange)) {
                                handleTaskOverlap(newOverlapsTasks, task);
                                handleTaskOverlap(newOverlapsTasks, currentTask);
                            }
                        }
                    }

                    handleTaskNonOverlaps(newOverlapsTasks, allTasks);
                }

                function getRange(task) {
                    var startEnd = getStartEnd(task);
                    return moment().range(startEnd[0], startEnd[1]);
                }

                function getStartEnd(task) {
                    var start, end;

                    if (task.model.from.isBefore(task.model.to)) {
                        start = task.model.from;
                        end = task.model.to;
                    } else {
                        start = task.model.to;
                        end = task.model.from;
                    }

                    return [start, end];
                }

                function handleTaskOverlap(overlapsList, task) {
                    if (!(task.model.id in overlapsList)) {
                        task.$element.addClass('gantt-task-overlaps');
                        overlapsList[task.model.id] = task;
                    }
                }

                function handleTaskNonOverlaps(overlapsList, allTasks) {
                    for(var i=0, l=allTasks.length; i<l; i++) {
                        var task = allTasks[i];
                        if (!(task.model.id in overlapsList)) {
                            task.$element.removeClass('gantt-task-overlaps');
                        }
                    }
                }
            }
        };
    }]);
}());

