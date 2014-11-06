/*
Project: angular-gantt for AngularJS
Author: Marco Schweighauser
Contributors: Rémi Alvergnat
License: MIT.
Github: https://github.com/angular-gantt/angular-gantt
*/
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


gantt.directive('ganttTaskBounds', [function() {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'plugins/bounds/default.taskBounds.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: true,
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

//# sourceMappingURL=angular-gantt-bounds-plugin.js.map