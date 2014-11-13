'use strict';
gantt.directive('ganttBodyForeground', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttBodyForeground');
    builder.controller = function($scope, $element) {
        $scope.gantt.body.foreground.$element = $element;
    };
    return builder.build();
}]);
