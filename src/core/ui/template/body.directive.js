'use strict';
gantt.directive('ganttBody', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttBody');
    builder.controller = function($scope, $element) {
        $scope.gantt.body.$element = $element;
    };
    return builder.build();
}]);
