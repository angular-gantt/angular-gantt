(function(){
    'use strict';
    angular.module('gantt').directive('ganttHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttHeader');
        builder.controller = function($scope, $element) {
            $scope.gantt.header.$element = $element;
            $scope.gantt.header.$scope = $scope;
        };
        return builder.build();
    }]);
}());

