/*
 Project: Gantt chart for Angular.js
 Author: Marco Schweighauser (2013)
 License: MIT License. See README.md
 */

var gantt = angular.module('gantt', []);

gantt.directive('gantt', ['Gantt', 'dateFunctions', function (Gantt, df) {
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
        scope: { viewScale: "=?",
            viewScaleFactor: "=?", // How wide are the columns, 1 being 1em per unit (hour or day depending on scale),
            sortMode: "=?",
            autoExpand: "=?",
            fromDate: "=?", // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: "=?", // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            firstDayOfWeek: "=?",
            weekendDays: "=?",
            maxHeight: "=?",
            data: "=?",
            loadData: "&",
            removeData: "&",
            clearData: "&",
            onGanttReady: "&",
            onRowAdded: "&",
            onRowClicked: "&",
            onRowUpdated: "&",
            onScroll: "&",
            onTaskClicked: "&"
        },
        controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
            $scope.gantt = new Gantt();
            $scope.viewScaleFactor = 2;
            $scope.ganttInnerWidth = 0;
            if ($scope.autoExpand === undefined) $scope.autoExpand = false;
            if ($scope.sortMode === undefined) $scope.sortMode = "name"; // name, date, custom
            if ($scope.viewScale === undefined) $scope.viewScale = "day"; // hour, day
            if ($scope.viewScaleFactor === undefined) $scope.viewScaleFactor = 2; // hour, day
            if ($scope.firstDayOfWeek === undefined) $scope.firstDayOfWeek = 1; // 0=Sunday, 1=Monday, ..
            if ($scope.maxHeight === undefined) $scope.maxHeight = 0; // > 0 to activate max height behaviour
            if ($scope.weekendDays === undefined) $scope.weekendDays = [0,6]; // Array: 0=Sunday, 1=Monday, ..

            $scope.isViewHour = function () {
                return $scope.viewScale === "hour";
            };

            $scope.isViewDay = function () {
                return $scope.viewScale === "day";
            };

            $scope.isWeekend = function(day) {
                for (var i = 0, l = $scope.weekendDays.length; i < l; i++) {
                    if ($scope.weekendDays[i] === day) {
                        return true;
                    }
                }

                return false;
            };

            $scope.viewMonthFilter = function (column) {
                return (column.fromDate.getDate() === 1 || column === $scope.gantt.getFirstColumn()) && column.fromDate.getHours() === 0;
            };

            $scope.viewWeekFilter = function (column) {
                return (column.fromDate.getDay() === $scope.firstDayOfWeek || column === $scope.gantt.getFirstColumn()) && column.fromDate.getHours() === 0;
            };

            $scope.viewDayFilter = function (column) {
                return column.fromDate.getHours() === 0 || column === $scope.gantt.getFirstColumn();
            };

            $scope.viewColumnFilter = function (a) {
                if ($scope.isViewHour()) {
                    return true;
                } else {
                    return $scope.viewDayFilter(a);
                }
            };

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            $scope.swapRows = function (a, b) {
                $scope.gantt.swapRows(a, b);

                // Raise change events
                $scope.raiseRowUpdated(a);
                $scope.raiseRowUpdated(b);

                // Switch to custom sort mode and trigger sort
                if ($scope.sortMode !== "custom") {
                    $scope.sortMode = "custom"; // Sort will be triggered by the watcher
                } else {
                    $scope.sortRows();
                }
            };

            $scope.$watch("sortMode", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.sortRows();
                }
            });
            $scope.$watch("viewScaleFactor", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.viewScaleFactor = newValue;
                    $scope.updateBounds();
                }
            });
            $scope.$watch("data", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.removeAllData();
                    $scope.setData(newValue);
                }
            });

            // Sort rows by the current sort mode
            $scope.sortRows = function () {
                $scope.gantt.sortRows($scope.sortMode);
            };

            $scope.$watch("viewScale", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.updateBounds();
                }
            });

            // Add a watcher if the week day settings are changed from outside of the Gantt. Update the grid accordingly if so.
            $scope.$watch('firstDayOfWeek+weekendDays', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.updateBounds();
                }
            });

            // Update all task and column bounds.
            $scope.updateBounds = function() {
                var i, l;

                for (i = 0, l = $scope.gantt.columns.length; i < l; i++) {
                    $scope.updateColumnBounds($scope.gantt.columns[i]);
                }

                for (i = 0, l = $scope.gantt.rows.length; i < l; i++) {
                    var row = $scope.gantt.rows[i];
                    for (var j = 0, k = row.tasks.length; j < k; j++) {
                        $scope.updateTaskBounds(row.tasks[j]);
                    }
                }

                $scope.ganttInnerWidth = ($scope.isViewDay() ? $scope.gantt.columns.length / 24: $scope.gantt.columns.length) * $scope.viewScaleFactor;
            };

            // Returns the width as number of the specified time span
            $scope.calcWidth = function (timespan) {
                if ($scope.isViewHour()) {
                    return timespan * $scope.viewScaleFactor / 3600000.0;
                } else {
                    return timespan * $scope.viewScaleFactor / 86400000.0;
                }
            };

            // Calculate the bounds of a task and publishes it as properties
            $scope.updateTaskBounds = function(task) {
                task.x = $scope.calcTaskX(task);
                task.width = $scope.calcTaskWidth(task);
            };

            // Returns the x position of a specific task
            $scope.calcTaskX = function (task) {
                return $scope.calcWidth(task.from - $scope.gantt.getFirstColumn().fromDate);
            };

            // Returns the width of a specific task
            $scope.calcTaskWidth = function (task) {
                var width;

                if (task.from === task.to) {
                    // If task is  milestone make 1h wide
                    width = $scope.isViewDay() ? $scope.viewScaleFactor / 24 : $scope.viewScaleFactor;
                } else {
                    // Else calculate width according to dates
                    width = $scope.calcWidth(task.to - task.from);

                    if ($scope.isViewDay()) {
                        // Make sure every task is at least half a day wide (for better visibility)
                        if (width < $scope.viewScaleFactor / 2) {
                            var adjTo = df.addHours(task.to, 12, true);
                            var nextDay = df.setTimeZero(df.addDays(task.to, 1, true));

                            // Make sure the extended task does not overflow to the next day
                            if (adjTo - nextDay > 0) {
                                width = $scope.calcWidth(nextDay - task.from);
                            } else {
                                width = $scope.viewScaleFactor / 2;
                            }
                        }
                    }
                }

                return width;
            };

            // Calculate the bounds of a column and publishes it as properties
            $scope.updateColumnBounds = function(column) {
                // These properties are used for styling the headers
                if ($scope.viewMonthFilter(column)) column.widthMonth = $scope.calcColWidth(column, 'month');
                if ($scope.viewWeekFilter(column)) column.widthWeek = $scope.calcColWidth(column, 'week');
                column.widthDay = $scope.isViewHour() ? $scope.calcColWidth(column, 'day') : $scope.viewScaleFactor;
                column.isWeekend = $scope.isWeekend(column.fromDate.getDay());
                column.toDate = $scope.isViewHour() ? df.addHours(column.fromDate, 1, true) : df.addDays(column.fromDate, 1, true);
            };

            // Returns the width of a column. Scale = 'hour', 'day', 'week', 'month'
            $scope.calcColWidth = function (column, scale) {
                var width = $scope.calcWidth(df.addHours(column.fromDate, 1, true) - column.fromDate);
                var lastColumnDate = $scope.gantt.getLastColumn().fromDate;
                var startDay = column.fromDate;
                var endDay;

                if (scale === "hour") {
                    return width; // Hour header shall be 1 hour wide
                } else if (scale === "day") {
                    if ($scope.isViewHour()) {
                        // Day header shall be 24 hours wide but no longer than the last hour shown
                        var endHour = df.addHours(column.fromDate, 24, true) > lastColumnDate ? lastColumnDate.getHours() + 1 : 24.0;
                        return width * endHour;
                    } else if ($scope.isViewDay()) {
                        return width * 24; // Day header shall be one day wide
                    }
                } else if (scale === "week") {
                    // Week header shall be as wide as there are days in the week but no longer as the last date shown
                    startDay = column.fromDate;
                    var firstDayInWeek = df.setToDayOfWeek(startDay, $scope.firstDayOfWeek, true);
                    var lastDayInWeek = df.addWeeks(firstDayInWeek, 1);
                    endDay = lastDayInWeek > lastColumnDate ? df.addHours(lastColumnDate, 1, true) : lastDayInWeek;

                    if (startDay.getTimezoneOffset() !== endDay.getTimezoneOffset()) {
                        // There is a time zone difference in between, e.g. summer time change. Skip it.
                        df.addMinutes(endDay, startDay.getTimezoneOffset() - endDay.getTimezoneOffset());
                    }

                    return $scope.calcWidth(endDay - startDay);
                } else if (scale === "month") {
                    // Month header shall be as wide as there are days in the month but no longer as the last date shown
                    startDay = column.fromDate;
                    var lastDayInMonth = df.addMonths(df.setToFirstDayOfMonth(startDay, true), 1);
                    endDay = lastDayInMonth > lastColumnDate ? df.addHours(lastColumnDate, 1, true) : lastDayInMonth;

                    if (startDay.getTimezoneOffset() !== endDay.getTimezoneOffset()) {
                        // There is a time zone difference in between, e.g. summer time change. Skip it.
                        df.addMinutes(endDay, startDay.getTimezoneOffset() - endDay.getTimezoneOffset());
                    }

                    return $scope.calcWidth(endDay - startDay);
                }
            };

            // Expands the date area when the user scroll to either left or right end.
            // May be used for the write mode in the future.
            $scope.autoExpandColumns = function(el, from, to) {
                if ($scope.autoExpand !== true) {
                    return;
                }

                var oldScrollLeft = el.scrollLeft === 0 ? ((to - from) * el.scrollWidth) / ($scope.gantt.getLastColumn().fromDate - $scope.gantt.getFirstColumn().fromDate) : el.scrollLeft;
                $scope.expandColumnRange(from, to);
                $scope.updateBounds();

                // Show Gantt at the same position as it was before expanding the date area
                el.scrollLeft = oldScrollLeft;
            };

            $scope.raiseRowAdded = function(row) {
                $scope.onRowAdded({ event: { row: row.clone() } });
            };

            // Calculate date from the given x position
            $scope.calcDate = function (x) {
                var emPxFactor = $scope.ganttScroll.children()[0].offsetWidth / $scope.ganttInnerWidth;
                var timespan;

                if ($scope.isViewHour()) {
                    timespan = x / ($scope.viewScaleFactor*emPxFactor / 3600000.0);
                } else {
                    timespan = x / ($scope.viewScaleFactor*emPxFactor / 86400000.0);
                }
                var date = df.addMilliseconds($scope.gantt.getFirstColumn().fromDate, timespan, true);
                return date;
            };

            // Support for lesser browsers (read IE 8)
            $scope.getOffset = function getOffset(evt) {
                if(evt.layerX && evt.layerY) {
                    return {x: evt.layerX, y: evt.layerY};
                }
                else {
                    var el = evt.target, x,y;
                    x=y=0;
                    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                        x += el.offsetLeft - el.scrollLeft;
                        y += el.offsetTop - el.scrollTop;
                        el = el.offsetParent;
                    }
                    x = evt.clientX - x;
                    y = evt.clientY - y;
                    return { x: x, y: y };
                }
            };

            $scope.raiseRowClicked = function(e, row) {
                var clickedDate = $scope.calcDate($scope.getOffset(e).x);
                $scope.onRowClicked({ event: { row: row.clone(), column: $scope.gantt.getColumn(clickedDate), date: clickedDate } });

                e.stopPropagation();
                e.preventDefault();
            };

            $scope.raiseRowUpdated = function(row) {
                $scope.onRowUpdated({ event: { row: row.clone() } });
            };

            $scope.raiseScrollEvent = function() {
                var el = $scope.ganttScroll[0];
                var pos = null;
                var date;
                var from, to;

                if (el.scrollLeft === 0) {
                    pos = 'left';
                    date = df.clone($scope.gantt.getFirstColumn().fromDate);
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    pos = 'right';
                    date = df.clone($scope.gantt.getLastColumn().fromDate);
                }

                if (pos !== null) {
                    // Timeout is a workaround to because of the horizontal scroll wheel problem on OSX.
                    // It seems that there is a scroll momentum which will continue the scroll when we add new data
                    // left or right of the Gantt directly in the scroll event.
                    // => Tips how to improve this are appreciated :)
                    $timeout(function() {
                        $scope.autoExpandColumns(el, from, to);
                        $scope.onScroll({ event: { date: date, position: pos }});
                    }, 500, true);
                }
            };

            $scope.raiseTaskClicked = function(e, row, task) {
                var rClone = row.clone();

                $scope.onTaskClicked({ event: {row: rClone, task: rClone.tasksMap[task.id] } });

                e.stopPropagation();
                e.preventDefault();
            };

            // Bind scroll event
            $scope.ganttScroll = angular.element($element.children()[2]);
            $scope.ganttScroll.bind('scroll', $scope.raiseScrollEvent);
            $scope.setData = function (data) {
                var el = $scope.ganttScroll[0];
                var oldRange = $scope.gantt.columns.length > 0 ? $scope.gantt.getLastColumn().fromDate - $scope.gantt.getFirstColumn().fromDate : 1;
                var oldWidth = el.scrollWidth;

                for (var i = 0, l = data.length; i < l; i++) {
                    var rowData = data[i];
                    var isUpdate = $scope.gantt.addRow(rowData);
                    var row = $scope.gantt.rowsMap[rowData.id];

                    if (isUpdate === true) {
                        $scope.raiseRowUpdated(row);
                    } else {
                        $scope.raiseRowAdded(row);
                    }
                }


                // This currently will only expand the range it doesn't have the ability to "shrink" it at this point
                if($scope.fromDate || $scope.toDate) {
                    var firstDate = $scope.fromDate ? $scope.fromDate : $scope.gantt.getFirstColumn().fromDate;
                    var lastDate =  $scope.toDate ? $scope.toDate : $scope.gantt.getLastColumn().fromDate;
                    $scope.gantt.expandColumnRange(firstDate, lastDate);
                }
                $scope.updateBounds();
                $scope.sortRows();

                // Show Gantt at the same position as it was before adding the new data
                el.scrollLeft = el.scrollLeft === 0 && $scope.gantt.columns.length > 0 ? (($scope.gantt.getLastColumn().fromDate - $scope.gantt.getFirstColumn().fromDate) * oldWidth) / oldRange - oldWidth : el.scrollLeft;
            };
            // Gantt is initialized. Load data.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: $scope.setData});

            // Remove data. If a row has no tasks inside the complete row will be deleted.
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

                            $scope.raiseRowUpdated(row);
                        }
                    } else {
                        // Delete the complete row
                        $scope.gantt.removeRow(rowData.id);
                    }
                }

                $scope.updateBounds();
                $scope.sortRows();
            }});

            // Clear all existing rows and tasks
            $scope.removeAllData = function() {
                $scope.gantt.removeRows();
                $scope.updateBounds();
            };
            $scope.clearData({ fn: $scope.removeAllData});

            // Signal that the Gantt is ready
            $scope.onGanttReady();
        }
        ]};
}]);
