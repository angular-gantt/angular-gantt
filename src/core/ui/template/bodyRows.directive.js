(function(){
    'use strict';
    angular.module('gantt').directive('ganttBodyRows', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttBodyRows');
        builder.controller = function($scope, $element) {
            $scope.gantt.body.rows.$element = $element;
            $scope.gantt.body.rows.$scope = $scope;
        };
        return builder.build();
    }]);
}());

