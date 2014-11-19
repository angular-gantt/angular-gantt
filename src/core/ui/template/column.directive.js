(function(){
    'use strict';
    angular.module('gantt').directive('ganttColumn', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttColumn');
        builder.controller = function($scope, $element) {
            $scope.column.$element = $element;
            $scope.column.$scope = $scope;
            $scope.column.updateView();
        };
        return builder.build();
    }]);
}());

