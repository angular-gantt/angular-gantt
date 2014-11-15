(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyBackground');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.background.$element = $element;
        };
        return builder.build();
    }]);
}());

