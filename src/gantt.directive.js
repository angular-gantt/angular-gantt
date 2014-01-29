/*
 Project: Gantt chart for Angular.js
 Author: Marco Schweighauser (2013)
 License: MIT License. See README.md
 */

var gantt = angular.module('gantt', []);

gantt.directive('gantt', ['Gantt', 'dateFunctions', 'mouseOffset', function (Gantt, df, mouseOffset) {
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
            columnWidth: "=?", // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
            columnSubScale: "=?", // Defines how precise tasks should be positioned inside columns. 4 = in quarter steps, 2 = in half steps, ... Use values higher than 24 or 60 (hour view) to display them very accurate. Default (4)
            allowTaskMoving: "=?", // Set to true if tasks should be moveable by the user.
            allowTaskResizing: "=?", // Set to true if tasks should be resizable by the user.
            allowRowOrdering: "=?", // Set to true if the user should be able to re-order rows.
            fromDate: "=?", // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: "=?", // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            firstDayOfWeek: "=?", // 0=Sunday, 1=Monday, ... Default (1)
            weekendDays: "=?", // Array of days: 0=Sunday, 1=Monday, ... Default ([0,6])
            showWeekends: "=?", // True if the weekends shall be displayed Default (true)
            workHours: "=?", // Array of valid work hours. Default ([8,9,..,16] equals a 8am - 17pm workday)
            showNonWorkHours: "=?", // True if the non work hours shall be displayed Default (true)
            autoExpand: "=?", // Set this true if the date range shall expand if the user scroll to the left or right end.
            maxHeight: "=?", // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
            labelsWidth: "=?", // Define the width of the labels section. Changes when the user resizes the labels width
            data: "=?",
            loadData: "&",
            removeData: "&",
            clearData: "&",
            centerDate: "&",
            onGanttReady: "&",
            onRowAdded: "&",
            onRowClicked: "&",
            onRowUpdated: "&",
            onScroll: "&",
            onTaskClicked: "&",
            onTaskUpdated: "&"
        },
        controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
            // Initialize defaults
            if ($scope.sortMode === undefined) $scope.sortMode = "name";
            if ($scope.viewScale === undefined) $scope.viewScale = "day";
            if ($scope.columnWidth === undefined) $scope.columnWidth = 2;
            if ($scope.columnSubScale === undefined) $scope.columnSubScale = 4;
            if ($scope.allowTaskMoving === undefined) $scope.allowTaskMoving = true;
            if ($scope.allowTaskResizing === undefined) $scope.allowTaskResizing = true;
            if ($scope.allowRowOrdering === undefined) $scope.allowRowOrdering = true;
            if ($scope.firstDayOfWeek === undefined) $scope.firstDayOfWeek = 1;
            if ($scope.weekendDays === undefined) $scope.weekendDays = [0,6];
            if ($scope.showWeekends === undefined) $scope.showWeekends = true;
            if ($scope.workHours === undefined) $scope.workHours = [8,9,10,11,12,13,14,15,16];
            if ($scope.showNonWorkHours === undefined) $scope.showNonWorkHours = true;
            if ($scope.maxHeight === undefined) $scope.maxHeight = 0;
            if ($scope.autoExpand === undefined) $scope.autoExpand = false;
            if ($scope.labelsWidth === undefined) $scope.labelsWidth = 0;

            // Gantt logic
            $scope.gantt = new Gantt($scope.viewScale, $scope.columnWidth, $scope.columnSubScale, $scope.firstDayOfWeek, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
            $scope.gantt.setDefaultColumnDateRange($scope.fromDate, $scope.toDate);

            $scope.getPxToEmFactor = function() {
                return $scope.ganttScroll.children()[0].offsetWidth / $scope.gantt.width;
            };

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            $scope.swapRows = function (a, b) {
                $scope.gantt.swapRows(a, b);

                // Raise change events
                $scope.raiseRowUpdatedEvent(a);
                $scope.raiseRowUpdatedEvent(b);

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

            $scope.$watch("sortMode", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.sortRows();
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
            $scope.$watch('viewScale+columnWidth+columnSubScale+fromDate+toDate+firstDayOfWeek+weekendDays+showWeekends+workHours+showNonWorkHours', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.setViewScale($scope.viewScale, $scope.columnWidth, $scope.columnSubScale, $scope.firstDayOfWeek, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
                    $scope.gantt.reGenerateColumns();
                }
            });

            $scope.$watch('fromDate+toDate', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.setDefaultColumnDateRange($scope.fromDate, $scope.toDate);
                    $scope.gantt.reGenerateColumns();
                }
            });

            // Scroll to the specified x
            $scope.scrollTo = function(x) {
                $scope.ganttScroll[0].scrollLeft = x;
            };

            // Scroll to the left side by specified x
            $scope.scrollLeft = function(x) {
                $scope.ganttScroll[0].scrollLeft -= x;
            };

            // Scroll to the right side by specified x
            $scope.scrollRight = function(x) {
                $scope.ganttScroll[0].scrollLeft += x;
            };

            // Tries to center the specified date
            $scope.scrollToDate = function(date) {
                var column = $scope.gantt.getColumnByDate(date);
                if (column !== undefined) {
                    var x = (column.left + column.width / 2) * $scope.getPxToEmFactor();
                    $scope.ganttScroll[0].scrollLeft = x - $scope.ganttScroll[0].offsetWidth/2;
                }
            };

            $scope.centerDate({ fn: $scope.scrollToDate});

            // Expands the date area when the user scroll to either left or right end.
            // May be used for the write mode in the future.
            $scope.autoExpandColumns = function(el, date, direction) {
                if ($scope.autoExpand !== true) {
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

                var oldScrollLeft = el.scrollLeft === 0 ? ((to - from) * el.scrollWidth) / ($scope.gantt.getLastColumn().date - $scope.gantt.getFirstColumn().date) : el.scrollLeft;
                $scope.gantt.expandColumns(from, to);

                // Show Gantt at the same position as it was before expanding the date area
                el.scrollLeft = oldScrollLeft;
            };

            $scope.raiseRowAddedEvent = function(row) {
                $scope.onRowAdded({ event: { row: row } });
            };

            $scope.raiseDOMRowClickedEvent = function(e, row) {
                var x = mouseOffset.getOffset(e).x;
                var xInEm = x / $scope.getPxToEmFactor();
                var clickedColumn = $scope.gantt.getColumnByPosition(xInEm);
                var date = $scope.gantt.getDateByPosition(xInEm);

                $scope.raiseRowClickedEvent(row, clickedColumn, date);

                e.stopPropagation();
                e.preventDefault();
            };

            $scope.raiseRowClickedEvent = function(row, column, date) {
                $scope.onRowClicked({ event: { row: row, column: column.clone(), date: date } });
            };

            $scope.raiseRowUpdatedEvent = function(row) {
                $scope.onRowUpdated({ event: { row: row } });
            };

            $scope.raiseScrollEvent = function() {
                var el = $scope.ganttScroll[0];
                var direction;
                var column;

                if (el.scrollLeft === 0) {
                    direction = 'left';
                    column = $scope.gantt.getFirstColumn();
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    direction = 'right';
                    column = $scope.gantt.getLastColumn();
                }

                if (column !== undefined) {
                    // Timeout is a workaround to because of the horizontal scroll wheel problem on OSX.
                    // It seems that there is a scroll momentum which will continue the scroll when we add new data
                    // left or right of the Gantt directly in the scroll event.
                    // => Tips how to improve this are appreciated :)
                    $timeout(function() {
                        var date = df.clone(column.date);
                        $scope.autoExpandColumns(el, date, direction);
                        $scope.onScroll({ event: { date: date, direction: direction }});
                    }, 500, true);
                }
            };

            $scope.raiseDOMTaskClickedEvent = function(e, task) {
                $scope.raiseTaskClickedEvent(task);

                e.stopPropagation();
                e.preventDefault();
            };

            $scope.raiseTaskClickedEvent = function(task) {
                $scope.onTaskClicked({ event: { task: task } });
            };

            $scope.raiseTaskUpdatedEvent = function(task) {
                $scope.onTaskUpdated({ event: { task: task } });
            };

            // Clear all existing rows and tasks
            $scope.removeAllData = function() {
                $scope.gantt.removeRows();
            };

            // Bind scroll event
            $scope.ganttScroll = angular.element($element.children()[2]);
            $scope.ganttScroll.bind('scroll', $scope.raiseScrollEvent);
            $scope.setData = function (data) {
                var el = $scope.ganttScroll[0];
                var oldDateRange = $scope.gantt.columns.length > 0 ? $scope.gantt.getLastColumn().date - $scope.gantt.getFirstColumn().date : 1;
                var oldWidth = el.scrollWidth;

                for (var i = 0, l = data.length; i < l; i++) {
                    var rowData = data[i];
                    var isUpdate = $scope.gantt.addRow(rowData);
                    var row = $scope.gantt.rowsMap[rowData.id];

                    if (isUpdate === true) {
                        $scope.raiseRowUpdatedEvent(row);
                    } else {
                        $scope.raiseRowAddedEvent(row);
                    }
                }

                $scope.sortRows();

                // Show Gantt at the same position as it was before adding the new data
                el.scrollLeft = el.scrollLeft === 0 && $scope.gantt.columns.length > 0 ? (($scope.gantt.getLastColumn().date - $scope.gantt.getFirstColumn().date) * oldWidth) / oldDateRange - oldWidth : el.scrollLeft;
            };

            // Load data handler.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: $scope.setData});

            // Remove data handler.
            // If a row has no tasks inside the complete row will be deleted.
            $scope.removeData({ fn: function(data) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var rowData = data[i];

                    if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                        // Only delete the specified tasks but not the row and the other tasks

                        if (rowData.id in $scope.gantt.rowsMap) {
                            var row = $scope.gantt.rowsMap[rowData.id];

                            for (var j = 0, k = rowData.tasks.length; j < k; j++) {
                                row.removeTask(rowData.tasks[j].id);
                            }

                            $scope.raiseRowUpdatedEvent(row);
                        }
                    } else {
                        // Delete the complete row
                        $scope.gantt.removeRow(rowData.id);
                    }
                }

                $scope.sortRows();
            }});

            // Clear data handler.
            $scope.clearData({ fn: $scope.removeAllData});

            // Gantt is initialized. Signal that the Gantt is ready.
            $scope.onGanttReady();
        }
    ]};
}]);
