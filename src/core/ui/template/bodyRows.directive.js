'use strict';
gantt.directive('ganttBodyRows', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttBodyRows');
    builder.controller = function($scope, $element) {
        $scope.gantt.body.rows.$element = $element;
    };
    return builder.build();
}]);
