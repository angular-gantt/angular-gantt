(function(){
    'use strict';
    angular.module('gantt').directive('ganttLabels', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttLabels');
        builder.controller = function($scope, $element) {
            $scope.gantt.labels.$element = $element;
            $scope.gantt.labels.$scope = $scope;
        };
        return builder.build();
    }]);
}());

