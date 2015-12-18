/* globals jsPlumb */
(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependenciesManager', ['GanttDependency', function(Dependency) {
        var DependenciesManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.plumb = jsPlumb.getInstance();

            this.dependenciesFrom = {};
            this.dependenciesTo = {};

            this.tasks = {};

            /**
             * Add definition of a dependency.
             *
             * @param fromId id of the start task of the dependency
             * @param toId id of the end task of the dependency
             */
            this.addDependency = function(fromId, toId) {
                var dependency = new Dependency(this, fromId, toId);

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

            /**
             * Set tasks objects that can be used to display dependencies.
             *
             * @param tasks
             */
            this.setTasks = function(tasks) {
                self.tasks = {};
                angular.forEach(tasks, function(task) {
                    self.tasks[task.model.id] = task;
                });
            };

            this.setTask = function(task) {
                var oldTask = self.tasks[task.model.id];
                if (oldTask !== undefined) {
                    var oldDependencies = this.getTaskDependencies(oldTask);
                    if (oldDependencies) {
                        angular.forEach(oldDependencies, function(dependency) {
                            dependency.disconnect();
                        });
                    }
                }
                self.tasks[task.model.id] = task;
                var dependencies = this.getTaskDependencies(task);
                if (dependencies) {
                    angular.forEach(dependencies, function(dependency) {
                        dependency.connect();
                    });
                }
            };

            /**
             * Retrieve the element representing the task.
             *
             * @param taskId id of the task element to retrieve.
             * @returns {*}
             */
            this.getTaskElement = function(taskId) {
                var taskObject = self.tasks[taskId];
                if (taskObject) {
                    return taskObject.$element;
                }
            };


            /**
             * Refresh jsplumb status based on defined dependencies.
             */
            this.refresh = function() {
                angular.forEach(this.dependenciesFrom, function(dependencies) {
                    angular.forEach(dependencies, function(dependency) {
                        if (!dependency.isConnected()) {
                            dependency.connect();
                        } else {
                            dependency.repaint();
                        }
                    });
                });
                //this.plumb.repaintEverything();
            };
        };
        return DependenciesManager;
    }]);
}());
