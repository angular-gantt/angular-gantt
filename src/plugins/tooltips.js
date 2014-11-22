(function(){
    'use strict';
    angular.module('gantt.tooltips', ['gantt', 'gantt.tooltips.templates']).directive('ganttTooltips', ['$compile', '$document', function($compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                dateFormat: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.tooltips) === 'object') {
                    for (var option in scope.options.tooltips) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }
                if (scope.dateFormat === undefined) {
                    scope.dateFormat = 'MMM DD, HH:mm';
                }

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var tooltipScope = taskScope.$new();
                        tooltipScope.pluginScope = scope;
                        var tooltipElement = $document[0].createElement('gantt-tooltip');
                        if (attrs.templateUrl !== undefined) {
                            angular.element(tooltipElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(tooltipElement).attr('data-template', attrs.template);
                        }
                        taskElement.append($compile(tooltipElement)(tooltipScope));
                    }
                });
            }
        };
    }]);
}());

