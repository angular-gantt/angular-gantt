'use strict';
gantt.directive('ganttTask', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttTask');
    builder.controller = function($scope, $element) {
        $scope.task.$element = $element;

        $scope.$watchGroup(['task.model.from', 'task.model.to'], function() {
            $scope.task.updatePosAndSize();
        });
    };
    return builder.build();
}]);
