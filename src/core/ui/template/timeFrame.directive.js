'use strict';
gantt.directive('ganttTimeFrame', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttTimeFrame');
    builder.controller = function($scope, $element) {
        $scope.timeFrame.$element = $element;

        $scope.getClass = function() {
            var classes = ['gantt-timeframe' + ($scope.timeFrame.working ? '' : '-non') + '-working'];

            if ($scope.timeFrame.classes) {
                classes = classes.concat($scope.timeFrame.classes);
            }
            return classes;
        };
    };
    return builder.build();
}]);
