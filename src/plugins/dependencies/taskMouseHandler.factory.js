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
                if (!self.installed) {
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
                    if (!endpoint.isVisible()) {
                        endpoint.setVisible(true, true, true);
                        angular.element(endpoint.canvas).bind('mouseenter', mouseEnterHandler);
                        angular.element(endpoint.canvas).bind('mouseleave', mouseExitHandler);
                    }
                });
            };

            /**
             * Hide all endpoints for this task.
             */
            this.hideEndpoints = function() {
                angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                    if (endpoint.isVisible()) {
                        angular.element(endpoint.canvas).unbind('mouseenter', mouseEnterHandler);
                        angular.element(endpoint.canvas).unbind('mouseleave', mouseExitHandler);
                        endpoint.setVisible(false, true, true);
                    }
                });
            };
        };
        return TaskMouseHandler;
    }]);
}());
