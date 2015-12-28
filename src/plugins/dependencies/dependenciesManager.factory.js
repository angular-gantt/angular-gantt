/* globals jsPlumb */
(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesManager', ['GanttDependency', 'GanttDependenciesEvents', function(Dependency, DependenciesEvents) {
        var DependenciesManager = function(gantt, pluginScope) {
            var self = this;

            this.gantt = gantt;
            this.pluginScope = pluginScope;

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
             * @param fromId id of the start task of the dependency
             * @param toId id of the end task of the dependency
             * @param connectParameters jsplumb.connect function parameters
             */
            this.addDependency = function(fromId, toId, connectParameters) {
                var dependency = new Dependency(this, fromId, toId, connectParameters);

                if (!(fromId in this.dependenciesFrom)) {
                    this.dependenciesFrom[fromId] = [];
                }
                if (!(toId in this.dependenciesTo)) {
                    this.dependenciesTo[toId] = [];
                }

                this.dependenciesFrom[fromId].push(dependency);
                this.dependenciesTo[toId].push(dependency);
            };

            /**
             * Check if a dependency definition exists.
             *
             * @param fromId id of the start task of the dependency
             * @param toId id of the end task of the dependency
             * @returns {boolean}
             */
            this.hasDependency = function(fromId, toId) {
                var fromDependencies = this.dependenciesFrom[fromId];

                if (!fromDependencies) {
                    return false;
                }

                var found = false;
                angular.forEach(fromDependencies, function(dependency) {
                    if (dependency.to === toId) {
                        found = true;
                    }
                });
                return found;
            };

            /**
             * Remove definition of a dependency
             *
             * @param fromId id of the start task of the dependency
             * @param toId id of the end task of the dependency
             */
            this.removeDependency = function(fromId, toId) {
                var fromDependencies = this.dependenciesFrom[fromId];
                var fromRemove = [];

                if (fromDependencies) {
                    angular.forEach(fromDependencies, function(dependency) {
                        if (dependency.to === toId) {
                            fromRemove.push(dependency);
                        }
                    });
                }

                var toDependencies = this.dependenciesTo[toId];
                var toRemove = [];

                if (toDependencies) {
                    angular.forEach(toDependencies, function(dependency) {
                        if (dependency.from === fromId) {
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

            var addTaskEndpoints = function(task) {
                task.dependencies = {endpoints: []};

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


                task.dependencies = undefined;
            };

            /**
             * Set tasks objects that can be used to display dependencies.
             *
             * @param tasks
             */
            this.setTasks = function(tasks) {
                angular.forEach(self.tasks, function(task) {
                    removeTaskEndpoint(task);
                });

                self.tasks = {};
                angular.forEach(tasks, function(task) {
                    self.tasks[task.model.id] = task;
                    addTaskEndpoints(task);
                });
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
                        var oldDependencies = this.getTaskDependencies(oldTask);
                        if (oldDependencies) {
                            angular.forEach(oldDependencies, function(dependency) {
                                dependency.disconnect();
                            });
                        }
                        removeTaskEndpoint(oldTask);
                    }
                    self.tasks[task.model.id] = task;
                    addTaskEndpoints(task);
                    var dependencies = this.getTaskDependencies(task);
                    if (dependencies) {
                        angular.forEach(dependencies, function(dependency) {
                            dependency.connect();
                        });
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
             * @param connectParameters
             * @returns connection object
             */
            this.connect = function(fromTask, toTask, connectParameters) {
                var sourceEndpoints = getSourceEndpoints(fromTask);
                var targetEndpoints = getTargetEndpoints(toTask);
                if (sourceEndpoints && targetEndpoints) {
                    var sourceEndpoint;
                    var targetEndpoint;

                    if (connectParameters.sourceEndpointIndex) {
                        sourceEndpoint = sourceEndpoints[connectParameters.sourceEndpointIndex];
                    } else {
                        sourceEndpoint = sourceEndpoints[0];
                    }

                    if (connectParameters.targetEndpointIndex) {
                        targetEndpoint = targetEndpoints[connectParameters.targetEndpointIndex];
                    } else {
                        targetEndpoint = targetEndpoints[0];
                    }

                    var connection = self.plumb.connect({
                        source: sourceEndpoint,
                        target: targetEndpoint
                    }, connectParameters);
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
