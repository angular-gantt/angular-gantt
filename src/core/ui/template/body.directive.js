(function(){
    'use strict';
    angular.module('gantt').directive('ganttBody', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBody');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.$element = $element;
            $scope.gantt.body.$scope = $scope;
        };
        return builder.build();
    }]);
}());

