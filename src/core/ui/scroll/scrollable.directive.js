(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollable', ['GanttDirectiveBuilder', 'ganttDebounce', 'moment', function(Builder, debounce, moment) {
        var builder = new Builder('ganttScrollable');
        builder.controller = function($scope, $element) {
            $scope.gantt.scroll.$element = $element;
            var lastScrollLeft;

            var lastAutoExpand;
            var autoExpandCoolDownPeriod = 500;
            var autoExpandColumns = function(el, date, direction) {
                var autoExpand = $scope.gantt.options.value('autoExpand');
                if (autoExpand !== 'both' && autoExpand !== true && autoExpand !== direction) {
                    return;
                }

                if (Date.now() - lastAutoExpand < autoExpandCoolDownPeriod) {
                    return;
                }

                var from, to;
                var expandHour = 1, expandDay = 31;

                var viewScale = $scope.gantt.options.value('viewScale');

                if (direction === 'left') {
                    from = viewScale === 'hour' ? moment(date).add(-expandHour, 'day') : moment(date).add(-expandDay, 'day');
                    to = date;
                } else {
                    from = date;
                    to = viewScale === 'hour' ? moment(date).add(expandHour, 'day') : moment(date).add(expandDay, 'day');
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

                var maxHeight = $scope.gantt.options.value('maxHeight');
                if (maxHeight > 0) {
                    css['max-height'] = maxHeight - $scope.gantt.header.getHeight() + 'px';
                    css['overflow-y'] = 'auto';

                    if ($scope.gantt.scroll.isVScrollbarVisible()) {
                        css['border-right'] = 'none';
                    }
                }

                var columnWidth = this.gantt.options.value('columnWidth');
                var bodySmallerThanGantt = $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth();
                if (columnWidth !== undefined && bodySmallerThanGantt) {
                    css.width = ($scope.gantt.width + this.gantt.scroll.getBordersWidth()) + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());

