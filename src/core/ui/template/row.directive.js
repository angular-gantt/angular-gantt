'use strict';
gantt.directive('ganttRow', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttRow');
    builder.controller = function($scope, $element) {
        $scope.row.$element = $element;
    };
    return builder.build();
}]);
