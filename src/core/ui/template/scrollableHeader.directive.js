(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollableHeader', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttScrollableHeader');
        builder.controller = function($scope) {
            var scrollBarWidth = layout.getScrollBarWidth();
            $scope.getScrollableHeaderCss = function() {
                var css = {};

                var maxHeightActivated = $scope.gantt.options.value('maxHeight') > 0;
                var vScrollbarWidth = maxHeightActivated ? scrollBarWidth: 0;
                var columnWidth = this.gantt.options.value('columnWidth');
                var bodySmallerThanGantt = $scope.gantt.width === 0 ? false: $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();

                if (columnWidth !== undefined && bodySmallerThanGantt) {
                    css.width = ($scope.gantt.width - vScrollbarWidth + this.gantt.scroll.getBordersWidth()) + 'px';
                } else if (maxHeightActivated) {
                    css.width = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - vScrollbarWidth + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());

