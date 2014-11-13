'use strict';
gantt.directive('ganttHeader', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttHeader');
    builder.controller = function($scope, $element) {
        $scope.gantt.header.$element = $element;

        $scope.getHeaderCss = function() {
            var css = {};

            if ($scope.ganttElementWidth - ($scope.showLabelsColumn ? $scope.labelsWidth : 0) > $scope.gantt.width) {
                css.width = $scope.gantt.width + 'px';
            }

            return css;
        };
    };
    return builder.build();
}]);
