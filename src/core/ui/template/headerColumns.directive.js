(function(){
    'use strict';
    angular.module('gantt').directive('ganttHeaderColumns', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttHeaderColumns');
        builder.controller = function($scope, $element) {
            $scope.gantt.header.columns.$element = $element;
            $scope.gantt.header.columns.$scope = $scope;
        };
        return builder.build();
    }]);
}());

