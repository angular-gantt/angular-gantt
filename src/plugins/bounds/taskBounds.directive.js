(function(){
    'use strict';
    angular.module('gantt.bounds').directive('ganttTaskBounds', ['$templateCache', 'moment', function($templateCache, moment) {
        // Displays a box representing the earliest allowable start time and latest completion time for a job

        return {
            restrict: 'E',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'plugins/bounds/taskBounds.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            replace: true,
            scope: true,
            controller: ['$scope', '$element', function($scope, $element) {
                $element.toggleClass('ng-hide', true);

                $scope.simplifyMoment = function(d) {
                    return moment.isMoment(d) ? d.unix() : d;
                };

                $scope.$watchGroup(['simplifyMoment(task.model.est)', 'simplifyMoment(task.model.lct)', 'task.left', 'task.width'], function() {
                    var left = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.est);
                    var right = $scope.task.rowsManager.gantt.getPositionByDate($scope.task.model.lct);

                    $element.css('left', left - $scope.task.left + 'px');
                    $element.css('width', right - left + 'px');

                    $element.toggleClass('gantt-task-bounds-in', false);
                    $element.toggleClass('gantt-task-bounds-out', false);
                    if ($scope.task.model.est === undefined || $scope.task.model.lct === undefined) {
                        $element.toggleClass('gantt-task-bounds-in', true);
                    } else if ($scope.task.model.est > $scope.task.model.from) {
                        $element.toggleClass('gantt-task-bounds-out', true);
                    }
                    else if ($scope.task.model.lct < $scope.task.model.to) {
                        $element.toggleClass('gantt-task-bounds-out', true);
                    } else {
                        $element.toggleClass('gantt-task-bounds-in', true);
                    }
                });

                $scope.task.$element.bind('mouseenter', function() {
                    $element.toggleClass('ng-hide', false);
                });

                $scope.task.$element.bind('mouseleave', function() {
                    $element.toggleClass('ng-hide', true);
                });

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttBounds', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttBounds', $scope, $element);
                });
            }]
        };
    }]);
}());

