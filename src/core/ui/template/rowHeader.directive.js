'use strict';
gantt.directive('ganttRowHeader', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttRowHeader');
    builder.controller = function($scope, $element) {
        $scope.gantt.rowHeader.$element = $element;
    };
    return builder.build();
}]);
