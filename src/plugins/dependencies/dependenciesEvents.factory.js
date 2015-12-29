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
                dependency.connection = info.connection;

                if (oldDependency) {
                    self.manager.api.dependencies.raise.change(dependency, oldDependency);
                } else {
                    self.manager.api.dependencies.raise.add(dependency);
                }

                return true;
            });

            // Remove the dependency from the model if it's manually detached.
            this.manager.plumb.bind('beforeDetach', function(connection, mouseEvent) {
                if (mouseEvent) {
                    var dependency = connection.$dependency;

                    dependency.removeFromTaskModel();
                    self.manager.removeDependency(dependency);
                    self.manager.api.dependencies.raise.remove(dependency);
                }
                return true;
            });

        };
        return DependenciesEvents;
    }]);
}());
