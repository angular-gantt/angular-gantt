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
                jsPlumbDefaults: '=?'
                // Add other option attributes for this plugin
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

                if (scope.jsPlumbDefaults === undefined) {
                    // https://jsplumbtoolkit.com/community/doc/defaults.html
                    scope.jsPlumbDefaults = {
                        Endpoint: ['Dot', {radius: 7}],
                        EndpointStyle: {fillStyle:'#456', strokeStyle:'#456', lineWidth: 2},
                        Connector: 'Flowchart'
                    };
                }

                var manager = new DependenciesManager(ganttCtrl.gantt, scope);

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
                        }

                        angular.forEach(taskDependencies, function(taskDependency) {
                            var toId = taskDependency.to;

                            if (toId !== undefined) {
                                manager.addDependency(task.model.id, toId, taskDependency.connectParameters);
                            }

                            var fromId = taskDependency.from;
                            if (fromId !== undefined) {
                                manager.addDependency(fromId, task.model.id, taskDependency.connectParameters);
                            }
                        });

                    }
                });

                api.tasks.on.remove(scope, function(task) {
                    var dependencies = manager.getTaskDependencies(task);

                    if (dependencies) {
                        angular.forEach(dependencies, function(dependency) {
                            dependency.disconnect();
                            manager.removeDependency(dependency.fromId, dependency.toId);
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

                api.tasks.on.viewRowChange(scope, debounce(function(task) {
                    manager.setTask(task);
                }, 10));

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
            this.manager = manager;

            var denyDropOnSameTask = function(params) {
                return params.sourceId !== params.targetId;
            };

            this.manager.plumb.bind('beforeDrop', denyDropOnSameTask);

        };
        return DependenciesEvents;
    }]);
}());

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

            var addTaskEndpoint = function(task) {
                if (!task.dependencies) {
                    task.dependencies = {};
                }

                // TODO: How to allow customizing those Endpoints without introducing to much api complexity ?
                task.dependencies.leftTargetEndpoint = self.plumb.addEndpoint(task.$element, {
                    anchor:'Left',
                    isSource:false,
                    isTarget:true,
                    maxConnections: -1,
                    cssClass: 'gantt-endpoint start-endpoint target-endpoint'
                });
                task.dependencies.leftTargetEndpoint.$task = task;

                task.dependencies.leftSourceEndpoint = self.plumb.addEndpoint(task.$element, {
                    anchor:'BottomLeft',
                    isSource:true,
                    isTarget:false,
                    maxConnections: -1,
                    cssClass: 'gantt-endpoint start-endpoint source-endpoint'
                });
                task.dependencies.leftSourceEndpoint.$task = task;

                task.dependencies.rightSourceEndpoint = self.plumb.addEndpoint(task.$element, {
                    anchor:'Right',
                    isSource:true,
                    isTarget:false,
                    maxConnections: -1,
                    cssClass: 'gantt-endpoint start-endpoint source-endpoint'
                });
                task.dependencies.rightSourceEndpoint.$task = task;

                task.dependencies.rightTargetEndpoint = self.plumb.addEndpoint(task.$element, {
                    anchor:'BottomRight',
                    isSource:false,
                    isTarget:true,
                    maxConnections: -1,
                    cssClass: 'gantt-endpoint end-endpoint target-endpoint'
                });
                task.dependencies.rightTargetEndpoint.$task = task;
            };

            var removeTaskEndpoint = function(task) {
                if (task.dependencies) {
                    if (task.dependencies.leftTargetEndpoint) {
                        self.plumb.deleteEndpoint(task.dependencies.leftTargetEndpoint);
                    }
                    if (task.dependencies.leftSourceEndpoint) {
                        self.plumb.deleteEndpoint(task.dependencies.leftSourceEndpoint);
                    }
                    if (task.dependencies.rightSourceEndpoint) {
                        self.plumb.deleteEndpoint(task.dependencies.rightSourceEndpoint);
                    }
                    if (task.dependencies.rightTargetEndpoint) {
                        self.plumb.deleteEndpoint(task.dependencies.rightTargetEndpoint);
                    }

                    task.dependencies = undefined;
                }
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
                    addTaskEndpoint(task);
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
                    addTaskEndpoint(task);
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

                            if(self.pluginScope.enabled) {
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

    angular.module('gantt.dependencies').factory('GanttDependency', [function() {
        /**
         * Constructor of Dependency object.
         * 
         * @param manager Dependency manager used by this dependency
         * @param fromId id of the start task of the dependency
         * @param toId id of the end task of the dependency
         * @param connectParameters jsplumb.connect function parameters
         *
         * @constructor
         *
         * @see https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumb.html#method_connect
         */
        var Dependency = function(manager, fromId, toId, connectParameters) {
            this.manager = manager;
            this.fromId = fromId;
            this.toId = toId;
            this.connectParameters = connectParameters !== undefined ? connectParameters : {};
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
                    this.connection = undefined;
                }
            };


            /**
             * Connect this dependency if both elements are available.
             *
             * @returns {boolean}
             */
            this.connect = function() {
                var fromTask = this.manager.getTask(this.fromId);
                var toTask = this.manager.getTask(this.toId);
                if (fromTask && toTask) {
                    var connection = this.manager.plumb.connect({
                        source: fromTask.dependencies.rightSourceEndpoint,
                        target: toTask.dependencies.leftTargetEndpoint
                    }, this.connectParameters);
                    this.connection = connection;
                    return true;
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

angular.module('gantt.dependencies.templates', []).run(['$templateCache', function($templateCache) {

}]);

//# sourceMappingURL=angular-gantt-dependencies-plugin.js.map