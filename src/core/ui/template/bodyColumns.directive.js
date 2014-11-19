(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyColumns', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyColumns');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.columns.$element = $element;
            $scope.gantt.body.background.$scope = $scope;
        };
        return builder.build();
    }]);
}());

