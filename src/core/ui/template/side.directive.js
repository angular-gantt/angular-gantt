(function(){
    'use strict';
    angular.module('gantt').directive('ganttSide', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSide');
        builder.controller = function($scope, $element) {
            $scope.gantt.side.$element = $element;
            $scope.gantt.side.$scope = $scope;
        };
        return builder.build();
    }]);
}());

