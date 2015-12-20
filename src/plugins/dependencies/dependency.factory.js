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
                var fromElement = this.manager.getTaskElement(this.fromId);
                var toElement = this.manager.getTaskElement(this.toId);
                if (fromElement && toElement) {
                    var connection = this.manager.plumb.connect({
                        source: fromElement[0],
                        target: toElement[0]
                    }, this.connectParameters);
                    this.connection = connection;
                    return true;
                }
                return false;
            };

            /**
             * Revalidate this dependency.
             *
             * @returns {boolean}
             */
            this.repaint = function() {
                var fromElement = this.manager.getTaskElement(this.fromId);
                var toElement = this.manager.getTaskElement(this.toId);
                this.manager.plumb.revalidate([fromElement[0], toElement[0]]);
            };
        };
        return Dependency;
    }]);
}());
