/* globals jsPlumb */
(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesManager', ['GanttDependency', 'GanttDependenciesEvents', 'GanttDependencyTaskMouseHandler', function(Dependency, DependenciesEvents, TaskMouseHandler) {
        var DependenciesManager = function(gantt, pluginScope, api) {
            var self = this;

            this.gantt = gantt;
            this.pluginScope = pluginScope;
            this.api = api;

            this.api.registerEvent('dependencies', 'add');
            this.api.registerEvent('dependencies', 'change');
            this.api.registerEvent('dependencies', 'remove');

            this.plumb = jsPlumb.getInstance();
            this.plumb.importDefaults(this.pluginScope.jsPlumbDefaults);

            this.dependenciesFrom = {};
            this.dependenciesTo = {};

            this.tasksList = [];
            this.tasks = {};

            this.events = new DependenciesEvents(this);

            this.pluginScope.$watch('enabled', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.refresh();
                }
            });

            this.pluginScope.$watch('readOnly', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.setTasks(self.tasksList);
                    self.refresh();
                }
            });

            this.pluginScope.$watch('jsPlumbDefaults', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.plumb.importDefaults(newValue);
                    self.refresh();
                }
            }, true);

            /**
             * Add all dependencies defined from a task. Dependencies will be added only if plugin is enabled.
             *
             * @param task
             */
            this.addDependenciesFromTask = function(task) {
                if (this.pluginScope.enabled) {
                    var taskDependencies = task.model.dependencies;

                    if (taskDependencies !== undefined && taskDependencies) {
                        if (!angular.isArray(taskDependencies)) {
                            taskDependencies = [taskDependencies];
                            task.model.dependencies = taskDependencies;
                        }

                        for (var i = 0, l = taskDependencies.length; i < l; i++) {
                            var dependency = self.addDependency(task, taskDependencies[i]);
                            dependency.connect();
                        }
                    }
                }
            };

            /**
             * Remove all dependencies defined for a task.
             *
             * @param task
             * @param keepConnection if true, dependency will not be disconnected.
             */
            this.removeDependenciesFromTask = function(task, keepConnection) {
                var dependencies = this.getTaskDependencies(task);

                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        if (!keepConnection) {
                            dependencies[i].disconnect();
                        }
                        self.removeDependency(dependencies[i]);
                    }
                }
            };

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
             * @param dependency Dependency object
             * @param keepConnection if true, dependency will not be disconnected.
             */
            this.removeDependency = function(dependency, keepConnection) {
                var fromDependencies = this.dependenciesFrom[dependency.getFromTaskId()];
                var fromRemove = [];
                var i;

                if (fromDependencies) {
                    for (i = 0; i < fromDependencies.length; i++) {
                        if (dependency === fromDependencies[i]) {
                            fromRemove.push(dependency);
                        }
                    }
                }

                var toDependencies = this.dependenciesTo[dependency.getToTaskId()];
                var toRemove = [];

                if (toDependencies) {
                    for (i = 0; i < toDependencies.length; i++) {
                        if (dependency === toDependencies[i]) {
                            toRemove.push(dependency);
                        }
                    }
                }

                for (i = 0; i < fromRemove.length; i++) {
                    if (!keepConnection) {
                        fromRemove[i].disconnect();
                    }
                    fromDependencies.splice(fromDependencies.indexOf(dependency), 1);
                }

                for (i = 0; i < toRemove.length; i++) {
                    if (!keepConnection) {
                        toRemove[i].disconnect();
                    }
                    toDependencies.splice(toDependencies.indexOf(dependency), 1);
                }

                if (this.dependenciesFrom[dependency.getFromTaskId()] &&
                    this.dependenciesFrom[dependency.getFromTaskId()].length === 0) {
                    delete this.dependenciesFrom[dependency.getFromTaskId()];
                }

                if (this.dependenciesTo[dependency.getToTaskId()] &&
                    this.dependenciesTo[dependency.getToTaskId()].length === 0) {
                    delete this.dependenciesTo[dependency.getToTaskId()];
                }
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

            var isTaskEnabled = function(task) {
                var rowDependencies = task.row.model.dependencies;
                if (rowDependencies !== undefined) {
                    return rowDependencies !== false;
                }
                var taskDependencies = task.model.dependencies;
                if (taskDependencies !== undefined) {
                    return taskDependencies !== false;
                }
                return true;
            };

            var addTaskEndpoints = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                task.dependencies.endpoints = [];

                if (self.pluginScope.endpoints) {
                    for (var i = 0; i < self.pluginScope.endpoints.length; i++) {
                        var endpointObject = self.plumb.addEndpoint(task.$element, self.pluginScope.endpoints[i]);
                        endpointObject.setVisible(false, true, true); // hide endpoint
                        endpointObject.$task = task;
                        task.dependencies.endpoints.push(endpointObject);
                    }
                }

            };

            var removeTaskEndpoint = function(task) {
                if (task.dependencies.endpoints) {
                    for (var i = 0; i < task.dependencies.endpoints.length; i++) {
                        var endpointObject = task.dependencies.endpoints[i];
                        self.plumb.deleteEndpoint(endpointObject);
                        endpointObject.$task = undefined;
                    }

                    task.dependencies.endpoints = undefined;
                }
            };

            var addTaskMouseHandler = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                if (!self.pluginScope.readOnly) {
                    task.dependencies.mouseHandler = new TaskMouseHandler(self, task);
                    task.dependencies.mouseHandler.install();
                }
            };

            var removeTaskMouseHandler = function(task) {
                if (task.dependencies.mouseHandler) {
                    task.dependencies.mouseHandler.release();
                    task.dependencies.mouseHandler = undefined;
                }
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

                var newTasks = {};
                var tasksList = [];
                for (var i = 0; i < tasks.length; i++) {
                    var task = tasks[i];
                    if (isTaskEnabled(task)) {
                        newTasks[task.model.id] = task;
                        tasksList.push(task);
                        addTaskEndpoints(task);
                        addTaskMouseHandler(task);
                    }
                }
                self.tasks = newTasks;
                self.tasksList = tasks;
            };

            var disconnectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        dependencies[i].disconnect();
                    }
                }
                return dependencies;
            };

            var connectTaskDependencies = function(task) {
                var dependencies = self.getTaskDependencies(task);
                if (dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        dependencies[i].connect();
                    }
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
                    if (isTaskEnabled(task)) {
                        self.tasks[task.model.id] = task;
                        addTaskEndpoints(task);
                        addTaskMouseHandler(task);
                        connectTaskDependencies(task);
                    }
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
             * Get all defined dependencies.
             *
             * @returns {Array}
             */
            this.getDependencies = function() {
                var allDependencies = [];

                angular.forEach(this.dependenciesFrom, function(dependencies) {
                    for (var i = 0; i < dependencies.length; i++) {
                        if (!(dependencies[i] in allDependencies)) {
                            allDependencies.push(dependencies[i]);
                        }
                    }
                });

                return allDependencies;
            };

            /**
             * Refresh jsplumb status based on tasks dependencies models.
             */
            this.refresh = function(tasks) {
                self.plumb.setSuspendDrawing(true);

                try {
                    var tasksDependencies;
                    var i;
                    if (tasks && !angular.isArray(tasks)) {
                        tasks = [tasks];
                    }

                    if (tasks === undefined) {
                        tasks = this.tasks;
                        tasksDependencies = this.getDependencies();
                    } else {
                        tasksDependencies = [];
                        angular.forEach(tasks, function(task) {
                            var taskDependencies = self.getTaskDependencies(task);
                            angular.forEach(taskDependencies, function(taskDependency) {
                                if (!(taskDependency in tasksDependencies)) {
                                    tasksDependencies.push(taskDependency);
                                }
                            });
                        });
                    }

                    for (i = 0; i < tasksDependencies.length; i++) {
                        self.removeDependency(tasksDependencies[i]);
                    }

                    angular.forEach(tasks, function(task) {
                        self.addDependenciesFromTask(task);
                    });
                } finally {
                    self.plumb.setSuspendDrawing(false, true);
                }
            };

            this.api.registerMethod('dependencies', 'refresh', this.refresh, this);
        };
        return DependenciesManager;
    }]);
}());
