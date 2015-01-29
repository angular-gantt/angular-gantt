(function(){
    'use strict';
    angular.module('gantt').directive('ganttTask', ['GanttDirectiveBuilder', 'moment', function(Builder, moment) {
        var builder = new Builder('ganttTask');
        builder.controller = function($scope, $element) {
            $scope.task.$element = $element;
            $scope.task.$scope = $scope;

            $scope.getTaskContent = function() {
                if ($scope.task.model.content !== undefined) {
                    return $scope.task.model.content;
                }
                return $scope.task.rowsManager.gantt.options.value('taskContent');
            };

            $scope.simplifyMoment = function(d) {
                return moment.isMoment(d) ? d.unix() : d;
            };

            $scope.$watchGroup(['simplifyMoment(task.model.from)', 'simplifyMoment(task.model.to)'], function() {
                $scope.task.updatePosAndSize();
            });
        };
        return builder.build();
    }]);
}());
