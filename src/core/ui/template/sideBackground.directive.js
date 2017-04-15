(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideBackground', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttSideBackground');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getMaxHeightCss = function() {
                var css = {};

                var maxHeight = $scope.maxHeight;
                if (!maxHeight) {
                    maxHeight = $scope.gantt.getContainerHeight();
                }

                var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                css['max-height'] = maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';

                return css;
            };
        };
        return builder.build();
    }]);
}());

