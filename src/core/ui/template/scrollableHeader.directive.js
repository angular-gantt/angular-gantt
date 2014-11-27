(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollableHeader', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttScrollableHeader');
        builder.controller = function($scope) {
            var scrollBarWidth = layout.getScrollBarWidth();
            $scope.getScrollableHeaderCss = function() {
                var css = {};

                if ($scope.maxHeight > 0) {
                    css.width = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - scrollBarWidth + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());

