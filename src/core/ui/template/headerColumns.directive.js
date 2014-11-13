'use strict';
gantt.directive('ganttHeaderColumns', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttHeaderColumns');
    builder.controller = function($scope, $element) {
        $scope.gantt.header.columns.$element = $element;
    };
    return builder.build();
}]);
