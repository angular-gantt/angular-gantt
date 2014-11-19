(function(){
    'use strict';
    angular.module('gantt').directive('ganttTimeFrame', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTimeFrame');
        builder.controller = function($scope, $element) {
            $scope.timeFrame.$element = $element;
            $scope.timeFrame.$scope = $scope;
            $scope.timeFrame.updateView();
        };
        return builder.build();
    }]);
}());

