(function(){
    'use strict';
    angular.module('gantt.tooltips', ['gantt', 'gantt.tooltips.templates']).directive('ganttTooltips', ['$compile', function($compile) {
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

                var tooltipScopes = [];
                scope.$watch('dateFormat', function(dateFormat) {
                    angular.forEach(tooltipScopes, function(tooltipScope) {
                        tooltipScope.dateFormat = dateFormat;
                    });
                });

                scope.$watch('enabled', function(enabled) {
                    angular.forEach(tooltipScopes, function(tooltipScope) {
                        tooltipScope.enabled = enabled;
                    });
                });

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var tooltipScope = taskScope.$new();
                        tooltipScopes.push(tooltipScope);
                        tooltipScope.dateFormat = scope.dateFormat;
                        tooltipScope.enabled = scope.enabled;
                        taskElement.append($compile('<gantt-tooltip ng-model="task"></gantt-tooltip>')(tooltipScope));

                        tooltipScope.$on('$destroy', function() {
                            var scopeIndex = tooltipScopes.indexOf(tooltipScope);
                            if (scopeIndex > -1) {
                                tooltipScopes.splice(scopeIndex, 1);
                            }
                        });
                    }
                });
            }
        };
    }]);
}());

