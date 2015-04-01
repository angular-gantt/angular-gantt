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

                    // if overlaps flag changes this will update the css class.
                    api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                        if (directiveName === 'ganttTask') {
                            taskScope.$watch('task.model.overlaps',function(newOverlapStatus,oldOverlapStatus){
                                if (newOverlapStatus!==oldOverlapStatus){
                                   if(newOverlapStatus){
                                       taskElement.addClass('gantt-task-overlaps');
                                   } else {
                                       taskElement.removeClass('gantt-task-overlaps');
                                   }
                                }
                            });
                        }
                    });
                }


                scope.handleOverlaps = function (changedTask) {

                    // Get all the tasks in the row.
                    var allTasks = changedTask.row.model.tasks;

                    // clear all overlaps flag.
                    angular.forEach(allTasks,function(Task){
                        Task.overlaps = false;
                    });

                    // set overlaps flag to each task that overlaps other task.
                    angular.forEach(allTasks,function(currentTask){
                        var currentStart,currentEnd;
                        if (currentTask.from.isBefore(currentTask.to)){
                            currentStart = currentTask.from;
                            currentEnd = currentTask.to;
                        } else {
                            currentStart = currentTask.to;
                            currentEnd = currentTask.from;
                        }
                        var currentRange = moment().range(currentStart, currentEnd);
                        angular.forEach(allTasks,function(Task){
                            if (currentTask.id !== Task.id){
                                var Start,End;
                                if (Task.from.isBefore(Task.to)){
                                    Start = Task.from;
                                    End = Task.to;
                                } else {
                                    Start = Task.to;
                                    End = Task.from;
                                }
                                var Range = moment().range(Start, End);
                                if (Range.overlaps(currentRange)){
                                    Task.overlaps = currentTask.overlaps = true;
                                }
                            }
                        });
                    });
                    // update view with the new model changes.
                    scope.$apply();
                };
            }
        };
    }]);
}());

