(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyForeground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyForeground');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.foreground.$element = $element;
            $scope.gantt.body.foreground.$scope = $scope;
        };
        return builder.build();
    }]);
}());

