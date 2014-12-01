(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollableHeader', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttScrollableHeader');
        builder.controller = function($scope) {
            var scrollBarWidth = layout.getScrollBarWidth();
            //var oldMaxHeightActivated = false;
            $scope.getScrollableHeaderCss = function() {
                var css = {};

                var maxHeightActivated = $scope.gantt.scroll.isVScrollbarVisible();
                var vScrollbarWidth = maxHeightActivated ? scrollBarWidth: 0;
                var columnWidth = this.gantt.options.value('columnWidth');
                var bodySmallerThanGantt = $scope.gantt.width === 0 ? false: $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();

                if (columnWidth !== undefined && bodySmallerThanGantt) {
                    css.width = ($scope.gantt.width - vScrollbarWidth + this.gantt.scroll.getBordersWidth()) + 'px';
                } else if (maxHeightActivated) {
                    css.width = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - vScrollbarWidth + 'px';
                }

                /*
                if (oldMaxHeightActivated !== maxHeightActivated) {
                    oldMaxHeightActivated = maxHeightActivated;
                    $scope.gantt.columnsManager.updateColumnsMeta();
                }
                */

                return css;
            };
        };
        return builder.build();
    }]);
}());

