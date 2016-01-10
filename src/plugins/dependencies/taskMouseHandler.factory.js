(function() {
    'use strict';

    angular.module('gantt.dependencies').factory('GanttDependencyTaskMouseHandler', ['$timeout', function($timeout) {
        var TaskMouseHandler = function(manager, task) {
            var self = this;

            this.manager = manager;
            this.task = task;
            this.installed = false;
            this.elementHandlers = [];

            this.display = true;
            this.hideEndpointsPromise = undefined;

            /**
             * Handler for a single DOM element.
             *
             * @param element
             * @constructor
             */
            var ElementHandler = function(element) {
                this.element = element;

                this.mouseExitHandler = function() {
                    $timeout.cancel(self.hideEndpointsPromise);
                    self.hideEndpointsPromise = $timeout(self.hideEndpoints, 1000, false);
                };

                this.mouseEnterHandler = function() {
                    $timeout.cancel(self.hideEndpointsPromise);
                    self.displayEndpoints();
                };

                this.install = function() {
                    this.element.bind('mouseenter', this.mouseEnterHandler);
                    this.element.bind('mouseleave', this.mouseExitHandler);
                };

                this.release = function() {
                    this.element.unbind('mouseenter', this.mouseEnterHandler);
                    this.element.unbind('mouseleave', this.mouseExitHandler);
                    $timeout.cancel(self.hideEndpointsPromise);
                };

            };



            /**
             * Install mouse handler for this task, and hide all endpoints.
             */
            this.install = function() {
                if (!self.installed) {
                    self.hideEndpoints();

                    self.elementHandlers.push(new ElementHandler(self.task.getContentElement()));
                    angular.forEach(self.task.dependencies.endpoints, function(endpoint) {
                        self.elementHandlers.push(new ElementHandler(angular.element(endpoint.canvas)));
                    });

                    angular.forEach(self.elementHandlers, function(elementHandler) {
                        elementHandler.install();
                    });

                    self.installed = true;
                }
            };

            /**
             * Release mouse handler for this task, and display all endpoints.
             */
            this.release = function() {
                if (self.installed) {
                    angular.forEach(self.elementHandlers, function(elementHandler) {
                        elementHandler.release();
                    });

                    self.elementHandlers = [];

                    self.displayEndpoints();
                    self.installed = false;
                }
            };

            /**
             * Display all endpoints for this task.
             */
            this.displayEndpoints = function() {
                self.display = true;
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
                self.display = false;
            };
        };
        return TaskMouseHandler;
    }]);
}());
