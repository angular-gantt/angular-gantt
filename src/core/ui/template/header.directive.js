(function(){
    'use strict';
    angular.module('gantt').directive('ganttHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttHeader');
        builder.controller = function($scope, $element) {
            $scope.gantt.header.$element = $element;
            $scope.gantt.header.$scope = $scope;

            $scope.getHeaderCss = function() {
                var css = {};

                if ($scope.gantt.width - ($scope.showLabelsColumn ? $scope.gantt.labels.getWidth() : 0) > $scope.gantt.width) {
                    css.width = $scope.gantt.width + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());

