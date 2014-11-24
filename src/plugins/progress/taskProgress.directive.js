(function(){
    'use strict';
    angular.module('gantt.progress').directive('ganttTaskProgress', ['$templateCache', function($templateCache) {
        return {
            restrict: 'E',
            requires: '^ganttTask',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'plugins/progress/taskProgress.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template !== undefined) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.getClasses = function() {
                    var classes = [];

                    if (typeof($scope.task.model.progress) === 'object') {
                        classes = $scope.task.model.progress.classes;
                    }

                    return classes;
                };

                $scope.getCss = function() {
                    var css = {};

                    var progress;
                    if ($scope.task.model.progress !== undefined) {
                        if (typeof($scope.task.model.progress) === 'object') {
                            progress = $scope.task.model.progress;
                        } else {
                            progress = {percent: $scope.task.model.progress};
                        }
                    }

                    if (progress) {
                        if (progress.color) {
                            css['background-color'] = progress.color;
                        } else {
                            css['background-color'] = '#6BC443';
                        }

                        css.width = progress.percent + '%';
                    }

                    return css;
                };

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskProgress', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskProgress', $scope, $element);
                });
            }]
        };
    }]);
}());

