'use strict';
/*global gantt: true*/
var gantt = angular.module('gantt', ['ganttTemplates', 'angularMoment']);
gantt.directive('gantt', ['Gantt', 'GanttCalendar', 'moment', 'ganttMouseOffset', 'ganttDebounce', 'GanttEvents', 'ganttEnableNgAnimate', function(Gantt, Calendar, moment, mouseOffset, debounce, Events, enableNgAnimate) {
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
            api: '=?'
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

            $scope.gantt = new Gantt($scope, $element);
        }
        ]};
}]);
