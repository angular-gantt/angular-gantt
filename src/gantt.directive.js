'use strict';
/*global gantt: true*/
var gantt = angular.module('gantt', ['ganttTemplates', 'angularMoment']);
gantt.constant('GANTT_EVENTS',
    {
        'READY': 'event:gantt-ready',
        'SCROLL': 'event:gantt-scroll',

        'TASK_ADDED': 'event:gantt-task-added',
        'TASK_CHANGED': 'event:gantt-task-changed',
        'TASK_REMOVED': 'event:gantt-task-removed',
        'TASK_MOVED': 'event:gantt-task-moved',
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
        'ROW_REMOVED': 'event:gantt-row-removed',
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
        'TIMESPAN_CHANGED': 'event:gantt-timespan-changed',

        'TASKS_FILTERED': 'event:gantt-tasks-filtered',
        'ROWS_FILTERED': 'event:gantt-rows-filtered'
    });

gantt.directive('gantt', ['Gantt', 'GanttCalendar', 'moment', 'ganttMouseOffset', 'ganttDebounce', 'GanttEvents', 'ganttEnableNgAnimate', 'GANTT_EVENTS', function(Gantt, Calendar, moment, mouseOffset, debounce, Events, enableNgAnimate, GANTT_EVENTS) {
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
            columnWidth: '=?', // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
            allowTaskMoving: '=?', // Set to true if tasks should be moveable by the user.
            allowTaskResizing: '=?', // Set to true if tasks should be resizable by the user.
            allowTaskRowSwitching: '=?', // If false then tasks can be moved inside their current row only. The user can not move it to another row.
            allowRowSorting: '=?', // Set to true if the user should be able to re-order rows.
            allowLabelsResizing: '=?', // Set to true if the user should be able to resize the label section.
            fromDate: '=?', // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: '=?', // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            currentDateValue: '=?', // If specified, the current date will be displayed
            currentDate: '=?', // The display of currentDate ('none', 'line' or 'column').
            autoExpand: '=?', // Set this both, left or right if the date range shall expand if the user scroll to the left or right end. Otherwise set to false or none.
            taskOutOfRange: '=?', // Set this to expand or truncate to define the behavior of tasks going out of visible range.
            maxHeight: '=?', // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
            labelsWidth: '=?', // Define the width of the labels section. Changes when the user is resizing the labels width
            showLabelsColumn: '=?', // Whether to show column with labels or not. Default (true)
            showTooltips: '=?', // True when tooltips shall be enabled. Default (true)
            headers: '=?', // An array of units for headers.
            headersFormats: '=?', // An array of corresponding formats for headers.
            timeFrames: '=?',
            dateFrames: '=?',
            timeFramesWorkingMode: '=?',
            timeFramesNonWorkingMode: '=?',
            tooltipDateFormat: '=?',
            timespans: '=?',
            columnMagnet: '=?',
            data: '=?',
            loadTimespans: '&',
            clearTimespans: '&',
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
            if ($scope.columnMagnet === undefined) {
                $scope.columnMagnet = '15 minutes';
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
            if ($scope.timeFramesWorkingMode === undefined) {
                $scope.timeFramesWorkingMode = 'hidden';
            }
            if ($scope.timeFramesNonWorkingMode === undefined) {
                $scope.timeFramesNonWorkingMode = 'visible';
            }
            if ($scope.columnMagnet === undefined) {
                $scope.columnMagnet = '15 minutes';
            }
            if ($scope.tooltipDateFormat === undefined) {
                $scope.tooltipDateFormat = 'MMM DD, HH:mm';
            }

            // Disable animation if ngAnimate is present, as it drops down performance.
            enableNgAnimate(false, $element);

            $scope.calendar = new Calendar();
            $scope.calendar.registerTimeFrames($scope.timeFrames);
            $scope.calendar.registerDateFrames($scope.dateFrames);

            $scope.$watch('timeFrames', function() {
                $scope.calendar.clearTimeFrames();
                $scope.calendar.registerTimeFrames($scope.timeFrames);
            });

            $scope.$watch('dateFrames', function() {
                $scope.calendar.clearDateFrames();
                $scope.calendar.registerDateFrames($scope.dateFrames);
            });

            $scope.gantt = new Gantt($scope, $element);

            // Remove specified rows and tasks.
            $scope.removeData({ fn: function(data) {$scope.gantt.removeData(data);}});

            // Load data handler.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: function(data) {$scope.gantt.loadData(data);}});
            $scope.loadTimespans({ fn: function(timespans) {$scope.gantt.timespansManager.loadTimespans(timespans);}});

            // Clear data handler.
            $scope.clearData({ fn: function() {$scope.gantt.clearData();}});
            $scope.clearTimespans({ fn: function() {$scope.gantt.timespansManager.clearTimespans();}});

            // Scroll to specified date handler.
            $scope.centerDate({ fn: function(date) {$scope.gantt.scroll.scrollToDate(date);}});

            // Gantt is initialized. Signal that the Gantt is ready.
            $scope.$emit(GANTT_EVENTS.READY);
        }
        ]};
}]);
