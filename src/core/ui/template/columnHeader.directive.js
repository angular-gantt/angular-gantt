(function(){
    'use strict';
    angular.module('gantt').directive('ganttColumnHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttColumnHeader');
        builder.controller = function($scope, $element) {
            $scope.column.$element = $element;
            $scope.column.$scope = $scope;
            $scope.column.updateView();
        };
        return builder.build();
    }]);
}());

