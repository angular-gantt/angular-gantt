'use strict';
/*global gantt: true*/
var gantt = angular.module('gantt', ['ganttTemplates', 'angularMoment']);
gantt.constant('GANTT_EVENTS',
    {
        'READY': 'event:gantt-ready',
        'SCROLL': 'event:gantt-scroll',

        'TASK_CHANGED': 'event:gantt-task-changed',
        'TASK_MOVE_BEGIN': 'event:gantt-task-move-begin',
        'TASK_MOVE': 'event:gantt-task-move',
        'TASK_MOVE_END': 'event:gantt-task-move-end',
        'TASK_RESIZE_BEGIN': 'event:gantt-task-resize-begin',
        'TASK_RESIZE': 'event:gantt-task-resize',
        'TASK_RESIZE_END': 'event:gantt-task-resize-end',
        'TASK_CLICKED': 'event:gantt-task-clicked',
        'TASK_DBL_CLICKED': 'event:gantt-task-dblclicked',
        'TASK_CONTEXTMENU': 'event:gantt-task-contextmenu',

        'COLUMN_CLICKED': 'event:gantt-column-clicked',
        'COLUMN_DBL_CLICKED': 'event:gantt-column-dblclicked',
        'COLUMN_CONTEXTMENU': 'event:gantt-column-contextmenu',

        'ROW_MOUSEDOWN': 'event:gantt-row-mousedown',
        'ROW_MOUSEUP': 'event:gantt-row-mouseup',
        'ROW_CLICKED': 'event:gantt-row-clicked',
        'ROW_DBL_CLICKED': 'event:gantt-row-dblclicked',
        'ROW_CONTEXTMENU': 'event:gantt-row-contextmenu',
        'ROW_CHANGED': 'event:gantt-row-changed',
        'ROW_ADDED': 'event:gantt-row-added',
        'ROW_ORDER_CHANGED': 'event:gantt-row-order-changed',

        'ROW_LABEL_MOUSEDOWN': 'event:gantt-row-label-mousedown',
        'ROW_LABEL_MOUSEUP': 'event:gantt-row-label-mouseup',
        'ROW_LABEL_CLICKED': 'event:gantt-row-label-clicked',
        'ROW_LABEL_DBL_CLICKED': 'event:gantt-row-label-dblclicked',
        'ROW_LABEL_CONTEXTMENU': 'event:gantt-row-label-contextmenu',

        'ROW_HEADER_MOUSEDOWN': 'event:gantt-row-header-mousedown',
        'ROW_HEADER_MOUSEUP': 'event:gantt-row-header-mouseup',
        'ROW_HEADER_CLICKED': 'event:gantt-row-header-clicked',
        'ROW_HEADER_DBL_CLICKED': 'event:gantt-row-header-dblclicked',
        'ROW_HEADER_CONTEXTMENU': 'event:gantt-row-header-contextmenu',

        'ROW_LABELS_RESIZED': 'event:gantt-row-labels-resized',

        'TIMESPAN_ADDED': 'event:gantt-timespan-added',
        'TIMESPAN_CHANGED': 'event:gantt-timespan-changed'
    });

gantt.directive('gantt', ['Gantt', 'moment', 'ganttMouseOffset', 'GanttEvents', 'ganttEnableNgAnimate', 'GANTT_EVENTS', function(Gantt, moment, mouseOffset, Events, enableNgAnimate, GANTT_EVENTS) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.gantt.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope: {
            sortMode: '=?', // Possible modes: 'name', 'date', 'custom'
            filterTask: '=?', // Task filter as a angularJS expression
            filterTaskComparator: '=?', // Comparator to use for the task filter
            filterRow: '=?', // Row filter as a angularJS expression
            filterRowComparator: '=?', // Comparator to use for the row filter
            viewScale: '=?', // Possible scales: 'hour', 'day', 'week', 'month'
            width: '=?', // Defines the preferred width of gantt. If defined, columns will be resized accordingly.
            columnWidth: '=?', // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
            columnSubScale: '=?', // Defines how precise tasks should be positioned inside columns. 4 = in quarter steps, 2 = in half steps, ... Use values higher than 24 or 60 (hour view) to display them very accurate. Default (4)
            allowTaskMoving: '=?', // Set to true if tasks should be moveable by the user.
            allowTaskResizing: '=?', // Set to true if tasks should be resizable by the user.
            allowTaskRowSwitching: '=?', // If false then tasks can be moved inside their current row only. The user can not move it to another row.
            allowRowSorting: '=?', // Set to true if the user should be able to re-order rows.
            allowLabelsResizing: '=?', // Set to true if the user should be able to resize the label section.
            fromDate: '=?', // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: '=?', // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            currentDateValue: '=?', // If specified, the current date will be displayed
            currentDate: '=?', // The display of currentDate ('none', 'line' or 'column').
            weekendDays: '=?', // Array of days: 0=Sunday, 1=Monday, ... Default ([0,6])
            showWeekends: '=?', // True if the weekends shall be displayed Default (true)
            workHours: '=?', // Array of valid work hours. Default ([8,9,..,16] equals a 8am - 17pm workday)
            showNonWorkHours: '=?', // True if the non work hours shall be displayed Default (true)
            autoExpand: '=?', // Set this both, left or right if the date range shall expand if the user scroll to the left or right end. Otherwise set to false or none.
            taskOutOfRange: '=?', // Set this to expand or truncate to define the behavior of tasks going out of visible range.
            maxHeight: '=?', // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
            labelsWidth: '=?', // Define the width of the labels section. Changes when the user is resizing the labels width
            showLabelsColumn: '=?', // Whether to show column with labels or not. Default (true)
            showTooltips: '=?', // True when tooltips shall be enabled. Default (true)
            headerShowMonth: '=?',
            headerShowWeek: '=?',
            headerShowDay: '=?',
            headerShowHour: '=?',
            headerFormatMonth: '=?',
            headerFormatWeek: '=?',
            headerFormatDay: '=?',
            headerFormatHour: '=?',
            tooltipDateFormat: '=?',
            timespans: '=?',
            data: '=?',
            loadTimespans: '&',
            loadData: '&',
            removeData: '&',
            clearData: '&',
            centerDate: '&'
        },
        controller: ['$scope', '$element', function($scope, $element) {
            // Initialize defaults
            if ($scope.sortMode === undefined) {
                $scope.sortMode = 'name';
            }
            if ($scope.viewScale === undefined) {
                $scope.viewScale = 'day';
            }
            if ($scope.width === undefined) {
                $scope.width = 0;
            }
            if ($scope.columnWidth === undefined) {
                $scope.columnWidth = 30;
            }
            if ($scope.columnSubScale === undefined) {
                $scope.columnSubScale = 4;
            }
            if ($scope.allowTaskMoving === undefined) {
                $scope.allowTaskMoving = true;
            }
            if ($scope.allowTaskResizing === undefined) {
                $scope.allowTaskResizing = true;
            }
            if ($scope.allowTaskRowSwitching === undefined) {
                $scope.allowTaskRowSwitching = true;
            }
            if ($scope.allowRowSorting === undefined) {
                $scope.allowRowSorting = true;
            }
            if ($scope.allowLabelsResizing === undefined) {
                $scope.allowLabelsResizing = true;
            }
            if ($scope.currentDateValue === undefined) {
                $scope.currentDateValue = moment();
            }
            if ($scope.currentDate === undefined) {
                $scope.currentDate = 'line';
            }
            if ($scope.weekendDays === undefined) {
                $scope.weekendDays = [0, 6];
            }
            if ($scope.showWeekends === undefined) {
                $scope.showWeekends = true;
            }
            if ($scope.workHours === undefined) {
                $scope.workHours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
            }
            if ($scope.showNonWorkHours === undefined) {
                $scope.showNonWorkHours = true;
            }
            if ($scope.maxHeight === undefined) {
                $scope.maxHeight = 0;
            }
            if ($scope.autoExpand === undefined) {
                $scope.autoExpand = 'none';
            }
            if ($scope.taskOutOfRange === undefined) {
                $scope.taskOutOfRange = 'truncate';
            }
            if ($scope.labelsWidth === undefined) {
                $scope.labelsWidth = 0;
            }
            if ($scope.showLabelsColumn === undefined) {
                $scope.showLabelsColumn = true;
            }
            if ($scope.showTooltips === undefined) {
                $scope.showTooltips = true;
            }
            if ($scope.headerShowMonth === undefined) {
                $scope.headerShowMonth = true;
            }
            if ($scope.headerShowWeek === undefined) {
                $scope.headerShowWeek = true;
            }
            if ($scope.headerShowDay === undefined) {
                $scope.headerShowDay = true;
            }
            if ($scope.headerShowHour === undefined) {
                $scope.headerShowHour = true;
            }
            if ($scope.headerFormatMonth === undefined) {
                $scope.headerFormatMonth = 'MMMM YYYY';
            }
            if ($scope.headerFormatWeek === undefined) {
                $scope.headerFormatWeek = 'w';
            }
            if ($scope.headerFormatDay === undefined) {
                $scope.headerFormatDay = 'D';
            }
            if ($scope.headerFormatHour === undefined) {
                $scope.headerFormatHour = 'H';
            }

            // Disable animation if ngAnimate is present, as it drops down performance.
            enableNgAnimate(false, $element);

            // Gantt logic
            $scope.template = {};
            $scope.gantt = new Gantt($scope, $element);

            $scope.$watch('sortMode', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.sortRows();
                }
            });

            $scope.$watch('timespans', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.removeAllTimespans();
                    $scope.setTimespans(newValue);
                }
            });

            $scope.$watch('data', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.removeAllData();
                    $scope.setData(newValue);
                }
            });

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            $scope.swapRows = function(a, b) {
                $scope.gantt.swapRows(a, b);

                // Raise change events
                $scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': a});
                $scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': a});
                $scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': b});
                $scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': b});

                // Switch to custom sort mode and trigger sort
                if ($scope.sortMode !== 'custom') {
                    $scope.sortMode = 'custom'; // Sort will be triggered by the watcher
                } else {
                    $scope.sortRows();
                }
            };

            // Sort rows by the current sort mode
            $scope.sortRows = function() {
                $scope.gantt.sortRows($scope.sortMode);
            };

            // Scroll to the specified x
            $scope.scrollTo = function(x) {
                $scope.template.scrollable.$element[0].scrollLeft = x;
                $scope.template.scrollable.$element.triggerHandler('scroll');
            };

            // Scroll to the left side by specified x
            $scope.scrollToLeft = function(x) {
                $scope.template.scrollable.$element[0].scrollLeft -= x;
                $scope.template.scrollable.$element.triggerHandler('scroll');
            };

            // Scroll to the right side by specified x
            $scope.scrollToRight = function(x) {
                $scope.template.scrollable.$element[0].scrollLeft += x;
                $scope.template.scrollable.$element.triggerHandler('scroll');
            };

            // Tries to center the specified date
            $scope.scrollToDate = function(date) {
                var position = $scope.gantt.getPositionByDate(date);

                if (position !== undefined) {
                    $scope.template.scrollable.$element[0].scrollLeft = position - $scope.template.scrollable.$element[0].offsetWidth / 2;
                }
            };

            var lastAutoExpand;
            var autoExpandCoolDownPeriod = 500;
            $scope.autoExpandColumns = function(el, date, direction) {
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

            // Add or update rows and tasks
            $scope.setData = function(data) {
                $scope.gantt.addData(data,
                    function(row) {
                        $scope.$emit(GANTT_EVENTS.ROW_ADDED, {'row': row});
                    }, function(row) {
                        $scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
                    });

                $scope.sortRows();
            };

            // Remove specified rows and tasks.
            $scope.removeData({ fn: function(data) {
                $scope.gantt.removeData(data, function(row) {
                    $scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
                });

                $scope.sortRows();
            }});

            // Clear all existing rows and tasks
            $scope.removeAllData = function() {
                // Clears rows, task and columns
                $scope.gantt.removeAllRows();
                // Restore default columns
                $scope.gantt.updateColumns();
            };

            // Clear all existing timespans
            $scope.removeAllTimespans = function() {
                // Clears rows, task and columns
                $scope.gantt.removeAllTimespans();
                // Restore default columns
                $scope.gantt.updateColumns();
            };

            // Add or update timespans
            $scope.setTimespans = function(timespans) {
                $scope.gantt.addTimespans(timespans,
                    function(timespan) {
                        $scope.$emit(GANTT_EVENTS.TIMESPAN_ADDED, {timespan: timespan});
                    }, function(timespan) {
                        $scope.$emit(GANTT_EVENTS.TIMESPAN_CHANGED, {timespan: timespan});
                    });
            };

            // Load data handler.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: $scope.setData});
            $scope.loadTimespans({ fn: $scope.setTimespans});

            // Clear data handler.
            $scope.clearData({ fn: $scope.removeAllData});

            // Scroll to specified date handler.
            $scope.centerDate({ fn: $scope.scrollToDate});

            // Gantt is initialized. Signal that the Gantt is ready.
            $scope.$emit(GANTT_EVENTS.READY);
        }
        ]};
}]);
