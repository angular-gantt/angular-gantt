(function(){
    'use strict';
    angular.module('gantt').directive('ganttTimespan', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTimespan');
        builder.controller = function($scope, $element) {
            $scope.timespan.$element = $element;
            $scope.timespan.$scope = $scope;
            $scope.timespan.updateView();
        };
        return builder.build();
    }]);
}());

