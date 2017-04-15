(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideContent', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttSideContent');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getSideCss = function() {
                var css = {};

                var maxHeight = $scope.maxHeight;
                if (!maxHeight) {
                    maxHeight = $scope.gantt.getContainerHeight();
                }

                var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                css['max-height'] = maxHeight - bodyScrollBarHeight + 'px';

                return css;
            };
        };
        return builder.build();
    }]);
}());

