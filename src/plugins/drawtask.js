(function(){
    'use strict';
    angular.module('gantt.drawtask', ['gantt']).directive('ganttDrawTask', ['$document', 'ganttMouseOffset', 'ganttUtils', 'moment', function(document, mouseOffset, utils, moment) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                moveThreshold: '=?',
                taskFactory: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.moveThreshold === undefined) {
                    scope.moveThreshold = 0;
                }

                if (scope.taskFactory === undefined) {
                    scope.taskFactory = function() {
                        return {}; // New empty task.
                    };
                }

                var newTaskModel = function(row) {
                    if (row.model.drawTask && angular.isFunction(row.model.drawTask.taskFactory)) {
                        return row.model.drawTask.taskFactory();
                    } else {
                        return scope.taskFactory();
                    }
                };

                api.directives.on.new(scope, function(directiveName, directiveScope, element) {
                    if (directiveName === 'ganttRow') {
                        var addNewTask = function(x) {
                            var startDate = api.core.getDateByPosition(x, true);
                            var endDate = moment(startDate);

                            var taskModel = newTaskModel(directiveScope.row);
                            taskModel.from = startDate;
                            taskModel.to = endDate;

                            var task = directiveScope.row.addTask(taskModel);
                            task.isResizing = true;
                            task.updatePosAndSize();
                            directiveScope.row.updateVisibleTasks();

                            directiveScope.row.$scope.$digest();
                        };

                        var deferDrawing = function(startX) {
                            var moveTrigger = function(evt) {
                                var currentX = mouseOffset.getOffset(evt).x;

                                if (Math.abs(startX - currentX) >= scope.moveThreshold) {
                                    element.off('mousemove', moveTrigger);
                                    addNewTask(startX);
                                }
                            };

                            element.on('mousemove', moveTrigger);
                            document.on('mouseup', function() {
                                element.off('mousemove', moveTrigger);
                            });
                        };

                        var drawHandler = function(evt) {
                            var evtTarget = (evt.target ? evt.target : evt.srcElement);

                            var rowDrawTask = directiveScope.row.model.drawTask;

                            if (typeof(rowDrawTask) === 'boolean' || angular.isFunction(rowDrawTask)) {
                                rowDrawTask = {enabled: rowDrawTask};
                            }

                            var enabledValue = utils.firstProperty([rowDrawTask], 'enabled', scope.enabled);
                            var enabled = angular.isFunction(enabledValue) ? enabledValue(evt): enabledValue;
                            if (enabled && evtTarget.className.indexOf('gantt-row') > -1) {
                                var x = mouseOffset.getOffset(evt).x;

                                if (scope.moveThreshold === 0) {
                                    addNewTask(x, x);
                                } else {
                                    deferDrawing(x);
                                }
                            }
                        };

                        element.on('mousedown', drawHandler);
                        directiveScope.drawTaskHandler = drawHandler;
                    }
                });

                api.directives.on.destroy(scope, function(directiveName, directiveScope, element) {
                    if (directiveName === 'ganttRow') {
                        element.off('mousedown', directiveScope.drawTaskHandler);
                        delete directiveScope.drawTaskHandler;
                    }
                });
            }
        };
    }]);
}());

