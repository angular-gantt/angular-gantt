(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependency', [function() {
        var Dependency = function(manager, fromId, toId) {
            this.manager = manager;
            this.fromId = fromId;
            this.toId = toId;
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
                        target: toElement[0],
                        anchors: ['Right', 'Left'],
                        endpoints: [
                            ['Rectangle', {'cssClass': 'gantt-dep-from-endpoint'}],
                            ['Rectangle', {'cssClass': 'gantt-dep-to-endpoint'}]
                        ],
                        connector: 'Flowchart'
                    });
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
