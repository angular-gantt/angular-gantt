(function(){
    'use strict';
    angular.module('gantt.bounds', ['gantt', 'gantt.bounds.templates']).directive('ganttBounds', ['moment', '$compile', function(moment, $compile) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.bounds) === 'object') {
                    for (var option in scope.options.bounds) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                var boundsScopes = [];
                scope.$watch('enabled', function(enabled) {
                    angular.forEach(boundsScopes, function(boundsScope) {
                        boundsScope.enabled = enabled;
                    });
                });

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTask') {
                        var boundsScope = taskScope.$new();
                        boundsScopes.push(boundsScopes);
                        boundsScope.enabled = scope.enabled;

                        taskElement.append($compile('<gantt-task-bounds></gantt-bounds>')(boundsScope));

                        boundsScope.$on('$destroy', function() {
                            var scopeIndex = boundsScopes.indexOf(boundsScope);
                            if (scopeIndex > -1) {
                                boundsScopes.splice(scopeIndex, 1);
                            }
                        });
                    }
                });

                api.tasks.on.clean(scope, function(model) {
                    if (model.est !== undefined && !moment.isMoment(model.est)) {
                        model.est = moment(model.est);  //Earliest Start Time
                    }
                    if (model.lct !== undefined && !moment.isMoment(model.lct)) {
                        model.lct = moment(model.lct);  //Latest Completion Time
                    }
                });
            }
        };
    }]);
}());

