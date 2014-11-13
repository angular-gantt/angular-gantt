'use strict';
gantt.directive('ganttColumn', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttColumn');
    builder.controller = function($scope, $element) {
        $scope.column.$element = $element;
    };
    return builder.build();
}]);
