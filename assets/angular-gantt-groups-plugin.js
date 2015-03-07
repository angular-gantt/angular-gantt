/*
Project: angular-gantt v1.2.0 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: http://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.groups', ['gantt', 'gantt.groups.templates']).directive('ganttGroups', ['ganttUtils', 'GanttHierarchy', '$compile', '$document', function(utils, Hierarchy, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                display: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.display === undefined) {
                    scope.display = 'group';
                }

                scope.hierarchy = new Hierarchy();

                function refresh() {
                    scope.hierarchy.refresh(ganttCtrl.gantt.rowsManager.filteredRows);
                }

                ganttCtrl.gantt.api.registerMethod('groups', 'refresh', refresh, this);
                ganttCtrl.gantt.$scope.$watchCollection('gantt.rowsManager.filteredRows', function() {
                    refresh();
                });

                api.directives.on.new(scope, function(directiveName, rowScope, rowElement) {
                    if (directiveName === 'ganttRow') {
                        var taskGroupScope = rowScope.$new();
                        taskGroupScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');

                        var taskGroupElement = $document[0].createElement('gantt-task-group');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(taskGroupElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(taskGroupElement).attr('data-template', attrs.template);
                        }

                        angular.element(ifElement).append(taskGroupElement);

                        rowElement.append($compile(ifElement)(taskGroupScope));
                    }
                });
            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.groups').controller('GanttGroupController', ['$scope', 'GanttTaskGroup', 'ganttUtils', function($scope, TaskGroup, utils) {
        var updateTaskGroup = function() {
            var rowGroups = $scope.row.model.groups;

            if (typeof(rowGroups) === 'boolean') {
                rowGroups = {enabled: rowGroups};
            }

            var enabledValue = utils.firstProperty([rowGroups], 'enabled', $scope.pluginScope.enabled);
            if (enabledValue) {
                $scope.display = utils.firstProperty([rowGroups], 'display', $scope.pluginScope.display);
                $scope.taskGroup = new TaskGroup($scope.row, $scope.pluginScope);

                $scope.row.setFromTo();
                $scope.row.setFromToByValues($scope.taskGroup.from, $scope.taskGroup.to);
            } else {
                $scope.taskGroup = undefined;
                $scope.display = undefined;
            }
        };

        $scope.gantt.api.tasks.on.change($scope, function(task) {
            if ($scope.taskGroup !== undefined) {
                if ($scope.taskGroup.tasks.indexOf(task) > -1) {
                    $scope.$evalAsync(function() {
                        updateTaskGroup();
                    });
                } else {
                    var descendants = $scope.pluginScope.hierarchy.descendants($scope.row);
                    if (descendants.indexOf(task.row) > -1) {
                        $scope.$evalAsync(function() {
                            updateTaskGroup();
                        });
                    }
                }
            }
        });

        $scope.pluginScope.$watch('display', function() {
            updateTaskGroup();
        });

        $scope.$watchCollection('gantt.rowsManager.filteredRows', function() {
            updateTaskGroup();
        });

        $scope.gantt.api.columns.on.refresh($scope, function() {
            updateTaskGroup();
        });
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.groups').directive('ganttTaskGroup', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskGroup', 'plugins/groups/taskGroup.tmpl.html');
        return builder.build();
    }]);
}());


(function(){
    'use strict';

    angular.module('gantt').factory('GanttTaskGroup', ['ganttUtils', 'GanttTask', function(utils, Task) {
        var TaskGroup = function (row, pluginScope) {
            var self = this;

            self.row = row;
            self.pluginScope = pluginScope;

            self.descendants = self.pluginScope.hierarchy.descendants(self.row);

            self.tasks = [];
            self.overviewTasks = [];
            self.groupedTasks = [];
            self.promotedTasks = [];

            var groupRowGroups = self.row.model.groups;
            if (typeof(groupRowGroups) === 'boolean') {
                groupRowGroups = {enabled: groupRowGroups};
            }

            var getTaskDisplay = function(task) {
                var taskGroups = task.model.groups;
                if (typeof(taskGroups) === 'boolean') {
                    taskGroups = {enabled: taskGroups};
                }

                var rowGroups = task.row.model.groups;
                if (typeof(rowGroups) === 'boolean') {
                    rowGroups = {enabled: rowGroups};
                }

                var enabledValue = utils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'enabled', self.pluginScope.enabled);

                if (enabledValue) {
                    var display = utils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'display', self.pluginScope.display);
                    return display;
                }
            };

            angular.forEach(self.descendants, function(descendant) {
                angular.forEach(descendant.tasks, function(task) {
                    if (getTaskDisplay(task) !== undefined) {
                        self.tasks.push(task);
                    }

                    var taskDisplay = getTaskDisplay(task);
                    if (taskDisplay !== undefined) {
                        var clone = new Task(self.row, task.model);

                        if (taskDisplay === 'overview') {
                            self.overviewTasks.push(clone);
                            clone.updatePosAndSize();
                        } else if(taskDisplay === 'promote'){
                            self.promotedTasks.push(clone);
                        } else {
                            self.groupedTasks.push(clone);
                        }
                    }
                });
            });

            self.from = undefined;
            angular.forEach(self.tasks, function(task) {
                if (self.from === undefined || task.model.from < self.from) {
                    self.from =  task.model.from;
                }
            });

            self.to = undefined;
            angular.forEach(self.tasks, function(task) {
                if (self.to === undefined || task.model.to > self.to) {
                    self.to = task.model.to;
                }
            });

            self.left = row.rowsManager.gantt.getPositionByDate(self.from);
            self.width = row.rowsManager.gantt.getPositionByDate(self.to) - self.left;
        };
        return TaskGroup;
    }]);
}());

(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskOverview', ['GanttDirectiveBuilder', 'moment', function(Builder, moment) {
        var builder = new Builder('ganttTaskOverview', 'plugins/groups/taskOverview.tmpl.html');
        builder.controller = function($scope, $element) {
            $scope.task.$element = $element;
            $scope.task.$scope = $scope;

            $scope.simplifyMoment = function(d) {
                return moment.isMoment(d) ? d.unix() : d;
            };

            $scope.$watchGroup(['simplifyMoment(task.model.from)', 'simplifyMoment(task.model.to)'], function() {
                $scope.task.updatePosAndSize();
            });
        };
        return builder.build();
    }]);
}());

//# sourceMappingURL=angular-gantt-groups-plugin.js.map