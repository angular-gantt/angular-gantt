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
