(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollable', ['GanttDirectiveBuilder', 'ganttDebounce', 'ganttLayout', 'moment', function(Builder, debounce, layout, moment) {
        var builder = new Builder('ganttScrollable');
        builder.controller = function($scope, $element) {
            $scope.gantt.scroll.$element = $element;

            var scrollBarWidth = layout.getScrollBarWidth();
            var lastScrollLeft;

            var lastAutoExpand;
            var autoExpandCoolDownPeriod = 500;
            var autoExpandColumns = function(el, date, direction) {
                if ($scope.autoExpand !== 'both' && $scope.autoExpand !== true && $scope.autoExpand !== direction) {
                    return;
                }

                if (Date.now() - lastAutoExpand < autoExpandCoolDownPeriod) {
                    return;
                }

                var from, to;
                var expandHour = 1, expandDay = 31;

                if (direction === 'left') {
                    from = $scope.viewScale === 'hour' ? moment(date).add(-expandHour, 'day') : moment(date).add(-expandDay, 'day');
                    to = date;
                } else {
                    from = date;
                    to = $scope.viewScale === 'hour' ? moment(date).add(expandHour, 'day') : moment(date).add(expandDay, 'day');
                }

                $scope.fromDate = from;
                $scope.toDate = to;
                lastAutoExpand = Date.now();
            };

            $element.bind('scroll', debounce(function() {
                var el = $element[0];
                var direction;
                var date;

                if (el.scrollLeft < lastScrollLeft && el.scrollLeft === 0) {
                    direction = 'left';
                    date = $scope.gantt.columnsManager.from;
                } else if (el.scrollLeft > lastScrollLeft && el.offsetWidth + el.scrollLeft >= el.scrollWidth - 1) {
                    direction = 'right';
                    date = $scope.gantt.columnsManager.to;
                }

                lastScrollLeft = el.scrollLeft;
                $scope.gantt.columnsManager.updateVisibleColumns();
                $scope.gantt.rowsManager.updateVisibleTasks();

                if (date !== undefined) {
                    autoExpandColumns(el, date, direction);
                    $scope.gantt.api.scroll.raise.scroll(el.scrollLeft, date, direction);
                } else {
                    $scope.gantt.api.scroll.raise.scroll(el.scrollLeft);
                }
            }, 5));

            $scope.getScrollableCss = function() {
                var css = {};

                if ($scope.gantt.width > 0 && $scope.gantt.width - ($scope.showLabelsColumn ? $scope.gantt.labels.getWidth() : 0) > $scope.gantt.width + scrollBarWidth) {
                    css.width = $scope.gantt.width + scrollBarWidth + 'px';
                }

                if ($scope.maxHeight > 0) {
                    css['max-height'] = $scope.maxHeight - $scope.gantt.header.getHeight() + 'px';
                    css['overflow-y'] = 'auto';
                } else {
                    css['overflow-y'] = 'hidden';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());

