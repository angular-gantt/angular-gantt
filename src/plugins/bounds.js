'use strict';
angular.module('gantt.bounds', ['gantt', 'gantt.bounds.templates']).directive('ganttBounds', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                if (directiveName === 'ganttTask') {
                    $timeout(function() {
                        // TODO: Don't really understand why it fails without $timeout wrapping ...
                        taskElement.append($compile('<gantt-task-bounds ng-model="task"></gantt-bounds>')(taskScope));
                    });

                }
            });
        }
    };
}]);
