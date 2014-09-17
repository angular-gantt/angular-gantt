/*
 Project: angular-gant for AngularJS
 Author: Marco Schweighauser (2014)
 License: MIT License. See README.md
 */

var gantt = angular.module('gantt', []);

gantt.directive('gantt', ['Gantt', 'dateFunctions', 'mouseOffset', 'debounce', 'keepScrollPos', function (Gantt, df, mouseOffset, debounce, keepScrollPos) {
    return {
        restrict: "EA",
        replace: true,
        templateUrl: function (tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return "template/gantt.tmpl.html";
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope: {
            sortMode: "=?", // Possible modes: 'name', 'date', 'custom'
            viewScale: "=?", // Possible scales: 'hour', 'day', 'week', 'month'
            width: "=?", // Defines the preferred width of gantt. If defined, columns will be resized accordingly.
            columnWidth: "=?", // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
            columnSubScale: "=?", // Defines how precise tasks should be positioned inside columns. 4 = in quarter steps, 2 = in half steps, ... Use values higher than 24 or 60 (hour view) to display them very accurate. Default (4)
            allowTaskMoving: "=?", // Set to true if tasks should be moveable by the user.
            allowTaskResizing: "=?", // Set to true if tasks should be resizable by the user.
            allowTaskRowSwitching: "=?", // If false then tasks can be moved inside their current row only. The user can not move it to another row.
            allowRowSorting: "=?", // Set to true if the user should be able to re-order rows.
            allowLabelsResizing: "=?", // Set to true if the user should be able to resize the label section.
            fromDate: "=?", // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: "=?", // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            currentDateValue: "=?", // If specified, the current date will be displayed
            currentDate: "=?", // The display of currentDate ('none', 'line' or 'column').
            firstDayOfWeek: "=?", // 0=Sunday, 1=Monday, ... Default (1)
            weekendDays: "=?", // Array of days: 0=Sunday, 1=Monday, ... Default ([0,6])
            showWeekends: "=?", // True if the weekends shall be displayed Default (true)
            workHours: "=?", // Array of valid work hours. Default ([8,9,..,16] equals a 8am - 17pm workday)
            showNonWorkHours: "=?", // True if the non work hours shall be displayed Default (true)
            autoExpand: "=?", // Set this both, left or right if the date range shall expand if the user scroll to the left or right end. Otherwise set to false or none.
            taskOutOfRange: "=?", // Set this to auto-expand or truncate to define the behavior of tasks going out of visible range.
            maxHeight: "=?", // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
            labelsWidth: "=?", // Define the width of the labels section. Changes when the user is resizing the labels width
            showTooltips: "=?", // True when tooltips shall be enabled. Default (true)
            timespans: "=?",
            data: "=?",
            loadTimespans: "&",
            loadData: "&",
            removeData: "&",
            clearData: "&",
            centerDate: "&",
            onColumnDateClicked: "&",
            onColumnDateDblClicked: "&",
            onColumnDataContextClicked: "&",
            onLabelsResized: "&",
            onLabelClicked: "&",
            onLabelDblClicked: "&",
            onLabelContextClicked: "&",
            onLabelHeaderClicked: "&",
            onLabelHeaderDblClicked: "&",
            onLabelHeaderContextClicked: "&",
            onGanttReady: "&",
            onTimespanAdded: "&",
            onTimespanUpdated: "&",
            onRowAdded: "&",
            onRowClicked: "&",
            onRowDblClicked: "&",
            onRowContextClicked: "&",
            onRowUpdated: "&",
            onRowMouseDown: "&",
            onScroll: "&",
            onTaskClicked: "&",
            onTaskDblClicked: "&",
            onTaskContextClicked: "&",
            onTaskUpdated: "&",
            onTaskMoveBegin: "&",
            onTaskMoveEnd: "&",
            onTaskResizeBegin: "&",
            onTaskResizeEnd: "&"
        },
        controller: ['$scope', '$element', function ($scope, $element) {
            // Initialize defaults
            if ($scope.sortMode === undefined) $scope.sortMode = "name";
            if ($scope.viewScale === undefined) $scope.viewScale = "day";
            if ($scope.width === undefined) $scope.width = 0;
            if ($scope.columnWidth === undefined) $scope.columnWidth = 2;
            if ($scope.columnSubScale === undefined) $scope.columnSubScale = 4;
            if ($scope.allowTaskMoving === undefined) $scope.allowTaskMoving = true;
            if ($scope.allowTaskResizing === undefined) $scope.allowTaskResizing = true;
            if ($scope.allowTaskRowSwitching === undefined) $scope.allowTaskRowSwitching = true;
            if ($scope.allowRowSorting === undefined) $scope.allowRowSorting = true;
            if ($scope.allowLabelsResizing === undefined) $scope.allowLabelsResizing = true;
            if ($scope.currentDateValue === undefined) $scope.currentDateValue = new Date();
            if ($scope.currentDate === undefined) $scope.currentDate = "line";
            if ($scope.firstDayOfWeek === undefined) $scope.firstDayOfWeek = 1;
            if ($scope.weekendDays === undefined) $scope.weekendDays = [0,6];
            if ($scope.showWeekends === undefined) $scope.showWeekends = true;
            if ($scope.workHours === undefined) $scope.workHours = [8,9,10,11,12,13,14,15,16];
            if ($scope.showNonWorkHours === undefined) $scope.showNonWorkHours = true;
            if ($scope.maxHeight === undefined) $scope.maxHeight = 0;
            if ($scope.autoExpand === undefined) $scope.autoExpand = "none";
            if ($scope.taskOutOfRange === undefined) $scope.taskOutOfRange = "expand";
            if ($scope.labelsWidth === undefined) $scope.labelsWidth = 0;
            if ($scope.showTooltips === undefined) $scope.showTooltips = true;

            // Gantt logic
            $scope.gantt = new Gantt($scope.viewScale, $scope.autoExpand, $scope.taskOutOfRange, $scope.width, $scope.columnWidth, $scope.columnSubScale, $scope.firstDayOfWeek, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
            $scope.gantt.setDefaultDateRange($scope.fromDate, $scope.toDate);
            $scope.gantt.setCurrentDate($scope.currentDateValue);

            $scope.$watch("sortMode", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.sortRows();
                }
            });

            $scope.$watch("timespans", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.removeAllTimespans();
                    $scope.setTimespans(newValue);
                }
            });

            $scope.$watch("data", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.removeAllData();
                    $scope.setData(newValue);
                }
            });

            // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
            // All those changes need a recalculation of the header columns
            $scope.$watch('viewScale+autoExpand+taskOutOfRange+width+labelsWidth+columnWidth+columnSubScale+firstDayOfWeek+weekendDays+showWeekends+workHours+showNonWorkHours', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.setViewScale($scope.viewScale, $scope.autoExpand, $scope.taskOutOfRange, $scope.width - $scope.labelsWidth / $scope.getPxToEmFactor(), $scope.columnWidth, $scope.columnSubScale, $scope.firstDayOfWeek, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
                    if (!$scope.gantt.reGenerateColumns()) {
                        // Re-generate failed, e.g. because there was no previous date-range. Try to apply the default range.
                        $scope.gantt.setDefaultDateRange($scope.fromDate, $scope.toDate);
                    }
                }
            });

            $scope.$watch('fromDate+toDate', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.setDefaultDateRange($scope.fromDate, $scope.toDate);
                }
            });

            $scope.$watch('currentDate+currentDateValue', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.setCurrentDate($scope.currentDateValue);
                }
            });

            $scope.getPxToEmFactor = function() {
                return $scope.ganttScroll.children()[0].offsetWidth / $scope.gantt.width;
            };

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            $scope.swapRows = function (a, b) {
                $scope.gantt.swapRows(a, b);

                // Raise change events
                $scope.raiseRowUpdatedEvent(a, true);
                $scope.raiseRowUpdatedEvent(b, true);

                // Switch to custom sort mode and trigger sort
                if ($scope.sortMode !== "custom") {
                    $scope.sortMode = "custom"; // Sort will be triggered by the watcher
                } else {
                    $scope.sortRows();
                }
            };

            // Sort rows by the current sort mode
            $scope.sortRows = function () {
                $scope.gantt.sortRows($scope.sortMode);
            };

            // Scroll to the specified x
            $scope.scrollTo = function(x) {
                $scope.ganttScroll[0].scrollLeft = x;
                $scope.ganttScroll.triggerHandler('scroll');
            };

            // Scroll to the left side by specified x
            $scope.scrollLeft = function(x) {
                $scope.ganttScroll[0].scrollLeft -= x;
                $scope.ganttScroll.triggerHandler('scroll');
            };

            // Scroll to the right side by specified x
            $scope.scrollRight = function(x) {
                $scope.ganttScroll[0].scrollLeft += x;
                $scope.ganttScroll.triggerHandler('scroll');
            };

            // Tries to center the specified date
            $scope.scrollToDate = function(date) {
                var column = $scope.gantt.getColumnByDate(date);
                if (column !== undefined) {
                    var x = (column.left + column.width / 2) * $scope.getPxToEmFactor();
                    $scope.ganttScroll[0].scrollLeft = x - $scope.ganttScroll[0].offsetWidth/2;
                }
            };

            $scope.autoExpandColumns = keepScrollPos($scope, function(el, date, direction) {
                if ( $scope.autoExpand !== "both" && $scope.autoExpand !== true && $scope.autoExpand !== direction ){
                    return;
                }

                var from, to;
                var expandHour = 1, expandDay = 31;

                if (direction === "left") {
                    from = $scope.viewScale === "hour" ? df.addDays(date, -expandHour, true) : df.addDays(date, -expandDay, true);
                    to = date;
                } else {
                    from = date;
                    to =  $scope.viewScale === "hour" ? df.addDays(date, expandHour, true) : df.addDays(date, expandDay, true);
                }

                $scope.gantt.expandDefaultDateRange(from, to);
            });

            $scope.raiseColumnDateClickedEvent = function(evt, column) {
                $scope.onColumnDateClicked({ event: { evt: evt, column: column} });
            };

            $scope.raiseColumnDateDblClickedEvent = function(evt, column) {
                $scope.onColumnDateDblClicked({ event: { evt: evt, column: column} });
            };

            $scope.raiseColumnDateContextMenuEvent = function(evt, column) {
                $scope.onColumnDataContextClicked({ event: { evt: evt, column: column} });
            };

            $scope.raiseLabelsResized = function(width) {
                $scope.onLabelsResized({ event: { width: width } });
            };

            $scope.raiseLabelClickedEvent = function(evt, row) {
                $scope.onLabelClicked({ event: { evt: evt, row: row, userTriggered: true } });
            };

            $scope.raiseLabelDblClickedEvent = function(evt, row) {
                $scope.onLabelDblClicked({ event: { evt: evt, row: row, userTriggered: true } });
            };

            $scope.raiseLabelContextMenuEvent = function(evt, row) {
                $scope.onLabelContextClicked({ event: { evt: evt, row: row, userTriggered: true } });
            };

            $scope.raiseLabelHeaderClickedEvent = function(evt) {
                $scope.onLabelHeaderClicked({ event: { evt: evt, userTriggered: true } });
            };

            $scope.raiseLabelHeaderDblClickedEvent = function(evt) {
                $scope.onLabelHeaderDblClicked({ event: { evt: evt, userTriggered: true } });
            };

            $scope.raiseLabelHeaderContextMenuEvent = function(evt) {
                $scope.onLabelHeaderContextClicked({ event: { evt: evt, userTriggered: true } });
            };

            $scope.raiseRowAddedEvent = function(row, userTriggered) {
                $scope.onRowAdded({ event: { row: row, userTriggered: userTriggered } });
            };

            $scope.raiseDOMRowClickedEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);

                $scope.raiseRowClickedEvent(e, row, clickedColumn, date);
            };

            $scope.raiseRowClickedEvent = function(evt, row, column, date) {
                $scope.onRowClicked({ event: { evt: evt, row: row, column: column.clone(), date: date, userTriggered: true } });
            };

            $scope.raiseDOMRowDblClickedEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);

                $scope.raiseRowDblClickedEvent(e, row, clickedColumn, date);
            };

            $scope.raiseRowDblClickedEvent = function(evt, row, column, date) {
                $scope.onRowDblClicked({ event: { evt: evt, row: row, column: column.clone(), date: date, userTriggered: true } });
            };

            $scope.raiseDOMRowMouseDownEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);
                
                $scope.raiseRowMouseDownEvent(e, row, clickedColumn, date);
            };

            $scope.raiseRowMouseDownEvent = function(evt, row, column, date) {
                $scope.onRowMouseDown({ event: { evt: evt, row: row, column: column.clone(), date: date, userTriggered: true } });
            };

            $scope.raiseDOMRowClickedEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);

                $scope.raiseRowClickedEvent(e, row, clickedColumn, date);
            };

            $scope.raiseDOMRowContextMenuEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);

                $scope.raiseRowContextMenuEvent(e, row, clickedColumn, date);
            };

            $scope.raiseRowContextMenuEvent = function(evt, row, column, date) {
                $scope.onRowContextClicked({ event: { evt: evt, row: row, column: column.clone(), date: date, userTriggered: true } });
            };

            $scope.raiseRowUpdatedEvent = function(row, userTriggered) {
                $scope.onRowUpdated({ event: { row: row, userTriggered: userTriggered } });
            };

            $scope.raiseScrollEvent = debounce(function() {
                if ($scope.gantt.getDateRange() === undefined) {
                    return;
                }

                var el = $scope.ganttScroll[0];
                var direction;
                var date;

                if (el.scrollLeft === 0) {
                    direction = 'left';
                    date = $scope.gantt.getDateRange().from;
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    direction = 'right';
                    date = $scope.gantt.getDateRange().to;
                }

                if (date !== undefined) {
                    $scope.autoExpandColumns(el, date, direction);
                    $scope.onScroll({ event: { date: date, direction: direction, userTriggered: true }});
                }
            }, 5);

            $scope.raiseTaskUpdatedEvent = function(task, userTriggered) {
                $scope.onTaskUpdated({ event: { task: task, userTriggered: userTriggered } });
            };

            $scope.raiseTaskMoveStartEvent = function(task) {
                $scope.onTaskMoveBegin({ event: { task: task, userTriggered: true } });
            };

            $scope.raiseTaskMoveEndEvent = function(task) {
                $scope.onTaskMoveEnd({ event: { task: task, userTriggered: true } });
            };

            $scope.raiseTaskResizeStartEvent = function(task) {
                $scope.onTaskResizeBegin({ event: { task: task, userTriggered: true } });
            };

            $scope.raiseTaskResizeEndEvent = function(task) {
                $scope.onTaskResizeEnd({ event: { task: task, userTriggered: true } });
            };

            $scope.raiseTaskClickedEvent = function(evt, task) {
                var x = mouseOffset.getOffset(evt).x,
                    xInEm = x / $scope.getPxToEmFactor(),
                    clickedColumn = $scope.gantt.getColumnByPosition(xInEm + task.left),
                    date = $scope.gantt.getDateByPosition(xInEm + task.left);
                $scope.onTaskClicked({ event: {
                    evt: evt,
                    task: task,
                    column: clickedColumn,
                    date: date,
                    userTriggered: true
                } });
            };

            $scope.raiseTaskDblClickedEvent = function(evt, task) {
                $scope.onTaskDblClicked({ event: { evt: evt, task: task, userTriggered: true } });
            };

            $scope.raiseTaskContextMenuEvent = function(evt, task) {
                $scope.onTaskContextClicked({ event: { evt: evt, task: task, userTriggered: true } });
            };

            // Add or update rows and tasks
            $scope.setData = keepScrollPos($scope, function (data) {
                $scope.gantt.addData(data,
                function(row) {
                    $scope.raiseRowAddedEvent(row, false);
                }, function(row) {
                    $scope.raiseRowUpdatedEvent(row, false);
                });

                $scope.sortRows();
            });

            // Remove specified rows and tasks.
            $scope.removeData({ fn: function(data) {
                $scope.gantt.removeData(data, function(row) {
                    $scope.raiseRowUpdatedEvent(row, false);
                });

                $scope.sortRows();
            }});

            // Clear all existing rows and tasks
            $scope.removeAllData = function() {
                // Clears rows, task and columns
                $scope.gantt.removeAllRows();
                // Restore default columns
                $scope.gantt.setDefaultDateRange($scope.fromDate, $scope.toDate);
            };

            // Clear all existing timespans
            $scope.removeAllTimespans = function() {
                // Clears rows, task and columns
                $scope.gantt.removeAllTimespans();
                // Restore default columns
                $scope.gantt.expandDefaultDateRange($scope.fromDate, $scope.toDate);
            };

            // Add or update timespans
            $scope.setTimespans = keepScrollPos($scope, function (timespans) {
                $scope.gantt.addTimespans(timespans,
                function(timespan) {
                    $scope.raiseTimespanAddedEvent(timespan, false);
                }, function(timespan) {
                    $scope.raiseTimespanUpdatedEvent(timespan, false);
                });

                $scope.sortRows();
            });

            $scope.raiseTimespanAddedEvent = function(timespan, userTriggered) {
                $scope.onTimespanAdded({ event: { timespan: timespan, userTriggered: userTriggered } });
            };

            $scope.raiseTimespanUpdatedEvent = function(timespan, userTriggered) {
                $scope.onTimespanUpdated({ event: { timespan: timespan, userTriggered: userTriggered } });
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
            $scope.onGanttReady();
        }
    ]};
}]);
