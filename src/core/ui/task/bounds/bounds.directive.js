'use strict';
gantt.directive('ganttBounds', [function() {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bounds.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: {task: '=ngModel'},
        controller: ['$scope', '$element', function($scope, $element) {
            var css = {};

            $scope.$watchGroup(['task.est', 'task.lct'], function() {
                if ($scope.task.est !== undefined && $scope.task.lct !== undefined) {
                    $scope.bounds = {};
                    $scope.bounds.left = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.est);
                    $scope.bounds.width = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.lct) - $scope.bounds.left;
                } else {
                    $scope.bounds = undefined;
                }
            });

            $scope.task.$element.bind('mouseenter', function() {
                $scope.$apply(function() {
                    $scope.isTaskMouseOver = true;
                });
            });

            $scope.task.$element.bind('mouseleave', function() {
                $scope.$apply(function() {
                    $scope.isTaskMouseOver = false;
                });
            });

            $scope.getCss = function() {
                if ($scope.bounds !== undefined) {
                    css.width = $scope.bounds.width + 'px';

                    if ($scope.task.isMilestone === true || $scope.task.width === 0) {
                        css.left = ($scope.bounds.left - ($scope.task.left - 0.3)) + 'px';
                    } else {
                        css.left = ($scope.bounds.left - $scope.task.left) + 'px';
                    }
                }

                return css;
            };

            $scope.getClass = function() {
                if ($scope.task.est === undefined || $scope.task.lct === undefined) {
                    return 'gantt-task-bounds-in';
                } else if ($scope.task.est > $scope.task.from) {
                    return 'gantt-task-bounds-out';
                }
                else if ($scope.task.lct < $scope.task.to) {
                    return 'gantt-task-bounds-out';
                }
                else {
                    return 'gantt-task-bounds-in';
                }
            };

            $scope.task.rowsManager.gantt.api.directives.raise.new('ganttBounds', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttBounds', $scope, $element);
            });
        }]
    };
}]);
