'use strict';
angular.module('gantt.tooltips', ['gantt', 'gantt.tooltips.templates']).directive('ganttTooltips', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        require: '^gantt',
        link: function(scope, element, attrs, ganttCtrl) {
            var api = ganttCtrl.gantt.api;

            api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                if (directiveName === 'ganttTask') {
                    $timeout(function() {
                        // TODO: Don't really understand why it fails without $timeout wrapping ...
                        taskElement.prepend($compile('<gantt-tooltip ng-model="task"></gantt-tooltip>')(taskScope));
                    });

                }
            });
        }
    };
}]);
