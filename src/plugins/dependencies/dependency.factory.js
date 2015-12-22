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
