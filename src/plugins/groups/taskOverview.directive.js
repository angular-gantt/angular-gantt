(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskOverview', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskOverview', 'plugins/groups/taskOverview.tmpl.html');
        builder.controller = function($scope, $element) {
            $scope.task.$element = $element;
            $scope.task.$scope = $scope;
            $scope.task.updatePosAndSize();
        };
        return builder.build();
    }]);
}());
