(function() {
    'use strict';
    angular.module('gantt.dependencies', ['gantt', 'gantt.dependencies.templates']).directive('ganttDependencies',
        ['$timeout', '$document', 'ganttDebounce', 'GanttDependenciesManager', 'GanttDependenciesChecker',
            function($timeout, $document, debounce, DependenciesManager, DependenciesChecker) {
                return {
                    restrict: 'E',
                    require: '^gantt',
                    scope: {
                        enabled: '=?',
                        readOnly: '=?',
                        jsPlumbDefaults: '=?',
                        endpoints: '=?',
                        fallbackEndpoints: '=?',
                        conflictChecker: '=?'
                    },
                    link: function(scope, element, attrs, ganttCtrl) {
                        var api = ganttCtrl.gantt.api;

                        // Load options from global options attribute.
                        if (scope.options && typeof(scope.options.dependencies) === 'object') {
                            for (var option in scope.options.dependencies) {
                                scope[option] = scope.options[option];
                            }
                        }

                        if (scope.enabled === undefined) {
                            scope.enabled = true;
                        }

                        if (scope.readOnly === undefined) {
                            scope.readOnly = false;
                        }

                        if (scope.jsPlumbDefaults === undefined) {
                            // https://jsplumbtoolkit.com/community/doc/defaults.html
                            scope.jsPlumbDefaults = {
                                Endpoint: ['Dot', {radius: 4}],
                                EndpointStyle: {fillStyle: '#456', strokeStyle: '#456', lineWidth: 1},
                                Connector: 'Flowchart',
                                ConnectionOverlays: [['Arrow', {location: 1, length: 12, width: 12}]]
                            };
                        }

                        function createLeftOverlay() {
                            return angular.element('<span><span class="gantt-endpoint-overlay start-endpoint arrow-right"></span></span>');
                        }

                        function createRightOverlay() {
                            return angular.element('<span><span class="gantt-endpoint-overlay end-endpoint arrow-right"></span></span>');
                        }

                        function createLeftFallbackOverlay() {
                            return angular.element('<span><span class="gantt-endpoint-overlay start-endpoint fallback-endpoint"></span></span>');
                        }

                        function createRightFallbackOverlay() {
                            return angular.element('<span><span class="gantt-endpoint-overlay end-endpoint fallback-endpoint"></span></span>');
                        }

                        if (scope.endpoints === undefined) {
                            scope.endpoints = [
                                {
                                    anchor: 'Left',
                                    isSource: false,
                                    isTarget: true,
                                    maxConnections: -1,
                                    cssClass: 'gantt-endpoint start-endpoint target-endpoint',
                                    overlays: [
                                        ['Custom', {create: createLeftOverlay}]
                                    ]

                                },
                                {
                                    anchor: 'Right',
                                    isSource: true,
                                    isTarget: false,
                                    maxConnections: -1,
                                    cssClass: 'gantt-endpoint end-endpoint source-endpoint',
                                    overlays: [
                                        ['Custom', {create: createRightOverlay}]
                                    ]
                                }
                            ];
                        }

                        if (scope.fallbackEndpoints === undefined) {
                            scope.fallbackEndpoints = [
                                {
                                    endpoint: 'Blank',
                                    anchor: 'Left',
                                    isSource: false,
                                    isTarget: true,
                                    maxConnections: 0,
                                    cssClass: 'gantt-endpoint start-endpoint fallback-endpoint',
                                    overlays: [
                                        ['Custom', {create: createLeftFallbackOverlay}]
                                    ]
                                },
                                {
                                    endpoint: 'Blank',
                                    anchor: 'Right',
                                    isSource: true,
                                    isTarget: false,
                                    maxConnections: 0,
                                    cssClass: 'gantt-endpoint end-endpoint fallback-endpoint',
                                    overlays: [
                                        ['Custom', {create: createRightFallbackOverlay}]
                                    ]
                                }
                            ];
                        }

                        if (scope.conflictChecker === undefined) {
                            scope.conflictChecker = false;
                        }

                        var manager = new DependenciesManager(ganttCtrl.gantt, scope, api);
                        var checker = new DependenciesChecker(manager, scope, api);

                        scope.$watchGroup(['conflictChecker', 'enabled'], function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                var rows = ganttCtrl.gantt.rowsManager.rows;
                                var allTasks = [];
                                for (var i = 0; i < rows.length; i++) {
                                    allTasks.push.apply(allTasks, rows[i].tasks);
                                }
                                if (scope.conflictChecker && scope.enabled) {
                                    checker.refresh(allTasks);
                                } else {
                                    checker.clear(allTasks);
                                }

                            }
                        });

                        api.directives.on.new(scope, function(directiveName, directiveScope, directiveElement) {
                            if (directiveName === 'ganttBody') {
                                manager.plumb.setContainer(directiveElement);
                            }
                        });

                        api.tasks.on.add(scope, function(task) {
                            manager.addDependenciesFromTask(task);
                        });

                        api.tasks.on.remove(scope, function(task) {
                            manager.removeDependenciesFromTask(task);
                        });

                        api.tasks.on.displayed(scope, debounce(function(tasks) {
                            manager.setTasks(tasks);
                            manager.refresh();
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh(tasks);
                            }
                        }));

                        api.rows.on.displayed(scope, function() {
                            manager.refresh();
                        });

                        api.tasks.on.viewChange(scope, function(task) {
                            if (task.$element) {
                                manager.plumb.revalidate(task.$element[0]);
                            }
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh([task]);
                            }
                        });

                        api.tasks.on.viewRowChange(scope, function(task) {
                            manager.setTask(task);
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh([task]);
                            }
                        });

                        api.dependencies.on.add(scope, function(dependency) {
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh([dependency.getFromTask(), dependency.getToTask()]);
                            }
                        });

                        api.dependencies.on.change(scope, function(dependency) {
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh([dependency.getFromTask(), dependency.getToTask()]);
                            }
                        });

                        api.dependencies.on.remove(scope, function(dependency) {
                            if (scope.conflictChecker && scope.enabled) {
                                checker.refresh([dependency.getFromTask(), dependency.getToTask()]);
                            }
                        });


                    }
                };
            }]);
}());

