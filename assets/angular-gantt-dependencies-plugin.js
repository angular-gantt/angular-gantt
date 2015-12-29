/*
Project: angular-gantt v1.2.9 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: https://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.dependencies', ['gantt', 'gantt.dependencies.templates']).directive('ganttDependencies', ['$timeout', '$document', 'ganttDebounce', 'GanttDependenciesManager', function($timeout, $document, debounce, DependenciesManager) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                jsPlumbDefaults: '=?',
                endpoints: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                api.registerEvent('dependencies', 'add');
                api.registerEvent('dependencies', 'change');
                api.registerEvent('dependencies', 'remove');

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.dependencies) === 'object') {
                    for (var option in scope.options.dependencies) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.jsPlumbDefaults === undefined) {
                    // https://jsplumbtoolkit.com/community/doc/defaults.html
                    scope.jsPlumbDefaults = {
                        Endpoint: ['Dot', {radius: 4}],
                        EndpointStyle: {fillStyle:'#456', strokeStyle:'#456', lineWidth: 1},
                        Connector: 'Flowchart',
                        ConnectionOverlays: [['Arrow', { location:1, length:12, width:12}]]
                    };
                }

                function createLeftOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay start-endpoint arrow-right"></span></span>');
                }

                function createRightOverlay() {
                    return angular.element('<span><span class="gantt-endpoint-overlay end-endpoint arrow-right"></span></span>');
                }

                if (scope.endpoints === undefined) {
                    scope.endpoints = [
                        {
                            anchor:'Left',
                            isSource:false,
                            isTarget:true,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint start-endpoint target-endpoint',
                            overlays:[
                                ['Custom', {create:createLeftOverlay}]
                            ]

                        },
                        {
                            anchor:'Right',
                            isSource:true,
                            isTarget:false,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint end-endpoint source-endpoint',
                            overlays:[
                                ['Custom', {create:createRightOverlay}]
                            ]
                        }/*,
                        {
                            anchor:'BottomLeft',
                            isSource:true,
                            isTarget:false,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint start-endpoint source-endpoint'
                        },
                        {
                            anchor:'TopRight',
                            isSource:false,
                            isTarget:true,
                            maxConnections: -1,
                            cssClass: 'gantt-endpoint end-endpoint target-endpoint'
                        }
                        */
                    ];
                }

                var manager = new DependenciesManager(ganttCtrl.gantt, scope, api);

                api.directives.on.new(scope, function(directiveName, directiveScope, directiveElement) {
                    if (directiveName === 'ganttBody') {
                        manager.plumb.setContainer(directiveElement);
                    }
                });

                api.tasks.on.add(scope, function(task) {
                    var taskDependencies = task.model.dependencies;

                    if (taskDependencies !== undefined) {
                        if (!angular.isArray(taskDependencies)) {
                            taskDependencies = [taskDependencies];
                            task.model.dependencies = taskDependencies;
                        }

                        angular.forEach(taskDependencies, function(taskDependency) {
                            manager.addDependency(task, taskDependency);
                        });

                    }
                });

                api.tasks.on.remove(scope, function(task) {
                    var dependencies = manager.getTaskDependencies(task);

                    if (dependencies) {
                        angular.forEach(dependencies, function(dependency) {
                            dependency.disconnect();
                            manager.removeDependency(dependency);
                        });
                    }
                });

                api.tasks.on.displayed(scope, debounce(function(tasks, filteredTasks, visibleTasks) {
                    manager.setTasks(visibleTasks);
                    manager.refresh();
                }, 10));

                api.rows.on.displayed(scope, function() {
                    manager.refresh();
                });

                api.tasks.on.viewChange(scope, function(task) {
                    if (task.$element) {
                        manager.plumb.revalidate(task.$element[0]);
                    }
                });

                api.tasks.on.viewRowChange(scope, function(task) {
                    manager.setTask(task);
                });

            }
        };
    }]);
}());


(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesEvents', [function() {
        /**
         * Creates a new DependenciesEvents object.
         *
         * @param manager DependenciesManager object
         * @constructor
         */
        var DependenciesEvents = function(manager) {
            var self = this;

            this.manager = manager;

            // Deny drop on the same task.
            var denyDropOnSameTask = function(params) {
                return params.sourceId !== params.targetId;
            };

            this.manager.plumb.bind('beforeDrop', denyDropOnSameTask);


            // Notify the manager that a connection is being created.
            this.manager.plumb.bind('connectionDrag', function(connection) {
                self.manager.setDraggingConnection(connection);
            });

            this.manager.plumb.bind('connectionDragStop', function() {
                self.manager.setDraggingConnection(undefined);
            });

            this.manager.plumb.bind('beforeDrop', function() {
                self.manager.setDraggingConnection(undefined);
                return true;
            });

            // Record the new dependency in the model and reload the task to display the new connection.
            this.manager.plumb.bind('beforeDrop', function(info) {
                var oldDependency;
                if (info.connection.$dependency) {
                    oldDependency = info.connection.$dependency;
                }

                var sourceEndpoint = info.connection.endpoints[0];
                var targetEndpoint = info.dropEndpoint;

                var sourceModel = sourceEndpoint.$task.model;

                var dependenciesModel = sourceModel.dependencies;

                if (dependenciesModel === undefined) {
                    dependenciesModel = [];
                    sourceModel.dependencies = dependenciesModel;
                }

                var connectionModel = {to: targetEndpoint.$task.model.id};
                dependenciesModel.push(connectionModel);

                if (oldDependency) {
                    oldDependency.removeFromTaskModel();
                    self.manager.removeDependency(oldDependency);
                }

                var dependency = self.manager.addDependency(sourceEndpoint.$task, connectionModel);
                info.connection.$dependency = dependency;

                if (oldDependency) {
                    self.manager.api.dependencies.raise.change(dependency, oldDependency);
                } else {
                    self.manager.api.dependencies.raise.add(dependency);
                }

                self.manager.refresh();

                return false; // Block further processing as manager has been refreshed.
            });

            // Remove the dependency from the model if it's manually detached.
            this.manager.plumb.bind('beforeDetach', function(connection, mouseEvent) {
                if (mouseEvent) {
                    var dependency = connection.$dependency;

                    dependency.removeFromTaskModel();
                    self.manager.removeDependency(dependency);
                    self.manager.api.dependencies.raise.remove(dependency);

                    self.manager.refresh();
                }
                return false; // Block further processing as manager has been refreshed.
            });

        };
        return DependenciesEvents;
    }]);
}());

/* globals jsPlumb */
(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesManager', ['GanttDependency', 'GanttDependenciesEvents', 'GanttDependencyTaskMouseHandler', function(Dependency, DependenciesEvents, TaskMouseHandler) {
        var DependenciesManager = function(gantt, pluginScope, api) {
            var self = this;

            this.gantt = gantt;
            this.pluginScope = pluginScope;
            this.api = api;

            this.plumb = jsPlumb.getInstance();
            this.plumb.importDefaults(this.pluginScope.jsPlumbDefaults);

            this.dependenciesFrom = {};
            this.dependenciesTo = {};

            this.tasks = {};

            this.events = new DependenciesEvents(this);

            this.pluginScope.$watch('enabled', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.refresh(true);
                }

            });

            this.pluginScope.$watch('jsPlumbDefaults', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.plumb.importDefaults(newValue);
                    self.refresh(true);
                }
            }, true);

            /**
             * Add definition of a dependency.
             *
             * @param task Task defining the dependency.
             * @param model Model object for the dependency.
             */
            this.addDependency = function(task, model) {
                var dependency = new Dependency(this, task, model);

                var fromTaskId = dependency.getFromTaskId();
                var toTaskId = dependency.getToTaskId();

                if (!(fromTaskId in this.dependenciesFrom)) {
                    this.dependenciesFrom[fromTaskId] = [];
                }
                if (!(toTaskId in this.dependenciesTo)) {
                    this.dependenciesTo[toTaskId] = [];
                }

                if (fromTaskId) {
                    this.dependenciesFrom[fromTaskId].push(dependency);
                }

                if (toTaskId) {
                    this.dependenciesTo[toTaskId].push(dependency);
                }

                return dependency;
            };

            /**
             * Remove definition of a dependency
             *
             * @param fromId id of the start task of the dependency
             * @param toId id of the end task of the dependency
             */
            this.removeDependency = function(dependency) {
                var fromDependencies = this.dependenciesFrom[dependency.getFromTaskId()];
                var fromRemove = [];

                if (fromDependencies) {
                    angular.forEach(fromDependencies, function(fromDependency) {
                        if (dependency === fromDependency) {
                            fromRemove.push(dependency);
                        }
                    });
                }

                var toDependencies = this.dependenciesTo[dependency.getToTaskId()];
                var toRemove = [];

                if (toDependencies) {
                    angular.forEach(toDependencies, function(toDependency) {
                        if (dependency === toDependency) {
                            toRemove.push(dependency);
                        }
                    });
                }

                angular.forEach(fromRemove, function(dependency) {
                    dependency.disconnect();
                    fromDependencies.splice(fromDependencies.indexOf(dependency), 1);
                });

                angular.forEach(toRemove, function(dependency) {
                    dependency.disconnect();
                    toDependencies.splice(toDependencies.indexOf(dependency), 1);
                });
            };

            this.getTaskDependencies = function(task) {
                var dependencies = [];

                var fromDependencies = self.dependenciesFrom[task.model.id];
                if (fromDependencies) {
                    dependencies = dependencies.concat(fromDependencies);
                }

                var toDependencies = self.dependenciesTo[task.model.id];
                if (toDependencies) {
                    dependencies = dependencies.concat(toDependencies);
                }

                return dependencies;
            };

            this.setDraggingConnection = function(connection) {
                if (connection) {
                    self.draggingConnection = connection;
                    angular.forEach(self.tasks, function(task) {
                        task.dependencies.mouseHandler.release();
                    });
                } else {
                    self.draggingConnection = undefined;
                    angular.forEach(self.tasks, function(task) {
                        task.dependencies.mouseHandler.install();
                    });
                }
            };

            var addTaskEndpoints = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                task.dependencies.endpoints = [];

                if (self.pluginScope.endpoints) {
                    angular.forEach(self.pluginScope.endpoints, function(endpoint) {
                        var endpointObject = self.plumb.addEndpoint(task.$element, endpoint);
                        endpointObject.$task = task;
                        task.dependencies.endpoints.push(endpointObject);
                    });
                }

            };

            var removeTaskEndpoint = function(task) {
                angular.forEach(task.dependencies.endpoints, function(endpointObject) {
                    self.plumb.deleteEndpoint(endpointObject);
                    endpointObject.$task = undefined;
                });

                task.dependencies.endpoints = undefined;
            };

            var addTaskMouseHandler = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                task.dependencies.mouseHandler = new TaskMouseHandler(self, task);
                task.dependencies.mouseHandler.install();
            };

            var removeTaskMouseHandler = function(task) {
                task.dependencies.mouseHandler.release();
                task.dependencies.mouseHandler = undefined;
            };

            /**
             * Set tasks objects that can be used to display dependencies.
             *
             * @param tasks
             */
            this.setTasks = function(tasks) {
                angular.forEach(self.tasks, function(task) {
                    removeTaskMouseHandler(task);
                    removeTaskEndpoint(task);
                });

                self.tasks = {};
                angular.forEach(tasks, function(task) {
                    self.tasks[task.model.id] = task;
                    addTaskEndpoints(task);
                    addTaskMouseHandler(task);
                });
            };

            var disconnectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    angular.forEach(dependencies, function(dependency) {
                        dependency.disconnect();
                    });
                }
                return dependencies;
            };

            var connectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    angular.forEach(dependencies, function(dependency) {
                        dependency.connect();
                    });
                }
                return dependencies;
            };

            /**
             * Set task object in replacement of an existing with the same id.
             *
             * @param task
             */
            this.setTask = function(task) {
                self.plumb.setSuspendDrawing(true);
                try {
                    var oldTask = self.tasks[task.model.id];
                    if (oldTask !== undefined) {
                        disconnectTaskDependencies(oldTask);
                        removeTaskMouseHandler(oldTask);
                        removeTaskEndpoint(oldTask);
                    }
                    self.tasks[task.model.id] = task;
                    addTaskEndpoints(task);
                    addTaskMouseHandler(task);
                    connectTaskDependencies(task);
                } finally {
                    self.plumb.setSuspendDrawing(false, true);
                }
            };

            /**
             * Retrieve the task from it's id.
             *
             * @param taskId id of the task element to retrieve.
             * @returns {*}
             */
            this.getTask = function(taskId) {
                return self.tasks[taskId];
            };


            var isElementVisible = function(element) {
                return element.offsetParent !== undefined && element.offsetParent !== null;
            };

            var getSourceEndpoints = function(task) {
                return task.dependencies.endpoints.filter(function(endpoint) {
                    return endpoint.isSource;
                });
            };

            var getTargetEndpoints = function(task) {
                return task.dependencies.endpoints.filter(function(endpoint) {
                    return endpoint.isTarget;
                });
            };

            /**
             * Connects two tasks together using source endpoint from fromTask and target endpoint from toTask.
             *
             * @param fromTask
             * @param toTask
             * @param model
             * @returns connection object
             */
            this.connect = function(fromTask, toTask, model) {
                var sourceEndpoints = getSourceEndpoints(fromTask);
                var targetEndpoints = getTargetEndpoints(toTask);
                if (sourceEndpoints && targetEndpoints) {
                    var sourceEndpoint;
                    var targetEndpoint;

                    if (model.connectParameters && model.connectParameters.sourceEndpointIndex) {
                        sourceEndpoint = sourceEndpoints[model.connectParameters.sourceEndpointIndex];
                    } else {
                        sourceEndpoint = sourceEndpoints[0];
                    }

                    if (model.connectParameters && model.connectParameters.targetEndpointIndex) {
                        targetEndpoint = targetEndpoints[model.connectParameters.targetEndpointIndex];
                    } else {
                        targetEndpoint = targetEndpoints[0];
                    }

                    var connection = self.plumb.connect({
                        source: sourceEndpoint,
                        target: targetEndpoint
                    }, model.connectParameters);
                    return connection;
                }
            };

            /**
             * Refresh jsplumb status based on defined dependencies and tasks.
             *
             * @param hard will totaly remove and reconnect every existing dependencies if set to true
             */
            this.refresh = function(hard) {
                self.plumb.setSuspendDrawing(true);
                try {
                    hard = true; // There is issue with soft refresh, when hidden rows using tree plugin.
                    angular.forEach(this.dependenciesFrom, function(dependencies) {
                        angular.forEach(dependencies, function(dependency) {
                            if (hard) {
                                dependency.disconnect();
                            }

                            if (self.pluginScope.enabled) {
                                if (!dependency.isConnected()) {
                                    dependency.connect();
                                } else {
                                    dependency.refresh();
                                }
                            }
                        });
                    });

                    angular.forEach(this.tasks, function(task) {
                        if (!isElementVisible(task.$element[0])) {
                            self.plumb.hide(task.$element[0]);
                        }
                    });
                } finally {
                    self.plumb.setSuspendDrawing(false, true);
                }
            };
        };
        return DependenciesManager;
    }]);
}());

(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependency', ['ganttUtils', function(utils) {
        /**
         * Constructor of Dependency object.
         * 
         * @param manager Dependency manager used by this dependency
         * @param task Task declaring the dependency
         * @param model model of the dependency
         *
         * @constructor
         *
         * @see https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumb.html#method_connect
         */
        var Dependency = function(manager, task, model) {
            this.manager = manager;
            this.task = task;
            this.model = model;
            this.connection = undefined;

            /**
             * Check if this dependency is connected.
             *
             * @returns {boolean}
             */
            this.isConnected = function() {
                if (this.connection) {
                    return true;
                }
                return false;
            };

            /**
             * Disconnect this dependency.
             */
            this.disconnect = function() {
                if (this.connection) {
                    this.manager.plumb.detach(this.connection);
                    this.connection.$dependency = undefined;
                    this.connection = undefined;
                }
            };

            this.getFromTaskId = function() {
                if (this.model.from !== undefined) {
                    return this.model.from;
                }
                return this.task.model.id;
            };

            this.getToTaskId = function() {
                if (this.model.to !== undefined) {
                    return this.model.to;
                }
                return this.task.model.id;
            };

            this.getFromTask = function() {
                if (this.model.from !== undefined) {
                    return this.manager.getTask(this.model.from);
                }
                return this.task;
            };

            this.getToTask = function() {
                if (this.model.to !== undefined) {
                    return this.manager.getTask(this.model.to);
                }
                return this.task;
            };

            this.removeFromTaskModel = function() {
                var modelIndex = utils.angularIndexOf(this.task.model.dependencies, this.model);
                if (modelIndex >= 0) {
                    this.task.model.dependencies.splice(modelIndex, 1);
                }
                return modelIndex;
            };

            /**
             * Connect this dependency if both elements are available.
             *
             * @returns {boolean}
             */
            this.connect = function() {
                var fromTask = this.getFromTask();
                var toTask = this.getToTask();

                if (fromTask && toTask && fromTask !== toTask) {
                    var connection = this.manager.connect(fromTask, toTask, this.model);
                    if (connection) {
                        connection.$dependency = this;
                        this.connection = connection;
                        return true;
                    }
                }
                return false;
            };

            /**
             * Refresh this dependency.
             *
             * @returns {boolean}
             */
            this.refresh = function() {
                var fromTask = this.manager.getTask(this.fromId);
                var toTask = this.manager.getTask(this.toId);
                this.manager.plumb.revalidate([fromTask.$element[0], toTask.$element[0]]);
            };
        };
        return Dependency;
    }]);
}());

(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependencyTaskMouseHandler', ['$timeout', function($timeout) {
        var TaskMouseHandler = function(manager, task) {
            var self = this;

            this.manager = manager;
            this.task = task;
            this.installed = false;

            var hideEndpointsPromise;

            var mouseExitHandler = function() {
                hideEndpointsPromise = $timeout(self.hideEndpoints, 1000, false);
            };

            var mouseEnterHandler = function() {
                $timeout.cancel(hideEndpointsPromise);
                self.displayEndpoints();
            };

            /**
             * Install mouse handler for this task, and hide all endpoints.
             */
            this.install = function() {
                if (!self.installed)  {
                    self.hideEndpoints();

                    self.task.getContentElement().bind('mouseenter', mouseEnterHandler);
                    self.task.getContentElement().bind('mouseleave', mouseExitHandler);

                    self.installed = true;
                }
            };

            /**
             * Release mouse handler for this task, and display all endpoints.
             */
            this.release = function() {
                if (self.installed) {
                    self.task.getContentElement().unbind('mouseenter', mouseEnterHandler);
                    self.task.getContentElement().unbind('mouseleave', mouseExitHandler);

                    $timeout.cancel(hideEndpointsPromise);

                    self.displayEndpoints();

                    self.installed = false;
                }
            };

            /**
             * Display all endpoints for this task.
             */
            this.displayEndpoints = function() {
                angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                    endpoint.setVisible(true, true, true);
                });
            };

            /**
             * Hide all endpoints for this task.
             */
            this.hideEndpoints = function() {
                angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                    endpoint.setVisible(false, true, true);
                });
            };
        };
        return TaskMouseHandler;
    }]);
}());

angular.module('gantt.dependencies.templates', []).run(['$templateCache', function($templateCache) {

}]);

//# sourceMappingURL=angular-gantt-dependencies-plugin.js.map