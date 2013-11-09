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
        scope: {
            viewScale: "=?", // Possible scales: 'hour', 'day'
            viewScaleFactor: "=?", // How wide are the columns, 1 being 1em per unit (hour or day depending on scale),
            sortMode: "=?", // Possible modes: 'name', 'date', 'custom'
            autoExpand: "=?",
            fromDate: "=?", // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: "=?", // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            firstDayOfWeek: "=?", // 0=Sunday, 1=Monday, ... Default (1)
            weekendDays: "=?", // Array of days: 0=Sunday, 1=Monday, ... Default ([0,6])
            showWeekends: "=?", // True if the weekends shall be displayed Default (true)
            workHours: "=?", // Array of valid work hours. Default ([8,9,..,16] equals a 8am - 17pm workday)
            showNonWorkHours: "=?", // True if the non work hours shall be displayed Default (true)
            maxHeight: "=?", // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
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
            // Initialize defaults
            if ($scope.autoExpand === undefined) $scope.autoExpand = false;
            if ($scope.sortMode === undefined) $scope.sortMode = "name";
            if ($scope.viewScale === undefined) $scope.viewScale = "day";
            if ($scope.viewScaleFactor === undefined) $scope.viewScaleFactor = 0.1;
            if ($scope.firstDayOfWeek === undefined) $scope.firstDayOfWeek = 1;
            if ($scope.maxHeight === undefined) $scope.maxHeight = 0;
            if ($scope.weekendDays === undefined) $scope.weekendDays = [0,6];
            if ($scope.showWeekends === undefined) $scope.showWeekends = true;
            if ($scope.workHours === undefined) $scope.workHours = [8,9,10,11,12,13,14,15,16];
            if ($scope.showNonWorkHours === undefined) $scope.showNonWorkHours = true;
            $scope.ganttInnerWidth = 0;

            // Gantt logic
            $scope.gantt = new Gantt($scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);

            // Returns the columns (Day or Hour) which currently are displayed in the Gantt body
            $scope.getBodyColumns = function () {
                if ($scope.viewScale === "hour") {
                    return $scope.gantt.columns.hours;
                } else {
                    return $scope.gantt.columns.days;
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

            // Add a watcher if a view related setting changed from outside of the Gantt. Update the grid accordingly if so.
            $scope.$watch('viewScale+viewScaleFactor+firstDayOfWeek', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.updateBounds();
                }
            });

            // Add a watcher if a view related setting changed from outside of the Gantt. Update the grid accordingly if so.
            // Those changes need a recalculation of the header columns
            $scope.$watch('weekendDays+showWeekends+workHours+showNonWorkHours', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.gantt.weekendDays = $scope.weekendDays;
                    $scope.gantt.showWeekends = $scope.showWeekends;
                    $scope.gantt.workHours = $scope.workHours;
                    $scope.gantt.showNonWorkHours = $scope.showNonWorkHours;
                    $scope.gantt.reGenerateColumns();
                    $scope.updateBounds();
                }
            });

            // Update all task and column bounds.
            $scope.updateBounds = function() {
                var i, l;

                $scope.updateColumnBounds();

                for (i = 0, l = $scope.gantt.rows.length; i < l; i++) {
                    var row = $scope.gantt.rows[i];
                    for (var j = 0, k = row.tasks.length; j < k; j++) {
                        $scope.updateTaskBounds(row.tasks[j]);
                    }
                }

                var last = $scope.gantt.columns.getLast();
                $scope.ganttInnerWidth = last !== null ? last.left + last.width: 0;
            };

            // Calculate the bounds of a task and publishes it as properties
            $scope.updateTaskBounds = function(task) {
                var cmp =  function(c) { return c.date; };
                var cFrom = $scope.calcClosestColumns(task.from, cmp);
                var cTo = $scope.calcClosestColumns(task.to, cmp);

                // Tasks are as wide as a day or hour column
                //task.left = cFrom[0].left;
                //task.width = ($scope.viewScale === "hour" || cTo[1] === undefined ? cTo[0].left : cTo[1].left) - cFrom[0].left;

                // Task bounds are calculated according to their time
                if (cFrom[1] === undefined) {
                    task.left = cFrom[0].left;
                } else {
                    task.left = cFrom[0].left + (cFrom[1].left - cFrom[0].left) * getTaskExactPosition(task.from);
                }

                if (cTo[1] === undefined) {
                    task.width = cTo[0].left - task.left;
                } else {
                    task.width = (cTo[0].left - task.left) + (cTo[1].left - cTo[0].left) * getTaskExactPosition(task.to);
                }
            };

            var getTaskExactPosition = function(date) {
                return $scope.viewScale === "hour" ? date.getMinutes() / 60 : date.getHours() / 24;
            };

            // Calculate the bounds of a column and publishes it as properties
            $scope.updateColumnBounds = function() {
                var i, l, left = 0;
                var currentDay = -1, currentWeek = -1, currentMonth = -1;

                for (i = 0, l = $scope.gantt.columns.hours.length; i < l; i++) {
                    var hourColumn = $scope.gantt.columns.hours[i];

                    // Possible enhancement: Column may have different width if weekend or non work hour
                    hourColumn.width = $scope.viewScaleFactor;
                    hourColumn.left = left;
                    left = Math.round((left + hourColumn.width) * 10) / 10;

                    // Set day column left and width (if not already)
                    currentDay = setColumnBound($scope.gantt.columns.days, currentDay, hourColumn.width, currentDay > -1 ? $scope.gantt.columns.days[currentDay].date.getDate() !== hourColumn.date.getDate(): true);

                    // Set month column left and width (if not already)
                    currentWeek = setColumnBound($scope.gantt.columns.weeks, currentWeek, hourColumn.width, currentWeek > -1 ? $scope.gantt.columns.weeks[currentWeek].week !== df.getWeek(hourColumn.date): true);

                    // Set month column left and width (if not already)
                    currentMonth = setColumnBound($scope.gantt.columns.months, currentMonth, hourColumn.width, currentMonth > -1 ? $scope.gantt.columns.months[currentMonth].date.getMonth() !== hourColumn.date.getMonth(): true);
                }
            };

            var setColumnBound = function(cols, curIndex, width, goToNextCol) {
                var col = cols[curIndex];
                if (col === undefined || goToNextCol) {
                    curIndex += 1;
                    col = cols[curIndex];
                    col.left = Math.round((curIndex > 0 ? cols[curIndex-1].left + cols[curIndex-1].width: 0)*10)/10;
                    col.width = width;
                } else {
                    col.width = Math.round((col.width + width) * 10)/10;
                }

                return curIndex;
            };

            // Expands the date area when the user scroll to either left or right end.
            // May be used for the write mode in the future.
            $scope.autoExpandColumns = function(el, date, direction) {
                if ($scope.autoExpand !== true) {
                    return;
                }

                var from, to;
                var expandHour = 1, expandDay = 30;

                if (direction === "left") {
                    from = $scope.viewScale === "hour" ? df.addDays(date, -expandHour, true) : df.addDays(date, -expandDay, true);
                    to = date;
                } else {
                    from = date;
                    to =  $scope.viewScale === "hour" ? df.addDays(date, expandHour, true) : df.addDays(date, expandDay, true);
                }

                var oldScrollLeft = el.scrollLeft === 0 ? ((to - from) * el.scrollWidth) / ($scope.gantt.columns.getLast().date - $scope.gantt.columns.getFirst().date) : el.scrollLeft;
                $scope.gantt.expandColumns(from, to);
                $scope.updateBounds();

                // Show Gantt at the same position as it was before expanding the date area
                el.scrollLeft = oldScrollLeft;
            };

            $scope.raiseRowAdded = function(row) {
                $scope.onRowAdded({ event: { row: row.clone() } });
            };

            // Return the column on the left and right using the given cmp function.
            // The compare function defined which property of the column to compare to x (e.g.: c => c.left)
            $scope.calcClosestColumns = function(x, cmp) {
                var a = $scope.getBodyColumns();

                var lo = -1, hi = a.length;
                while (hi - lo > 1) {
                    var mid = Math.floor((lo + hi)/2);
                    if (cmp(a[mid]) <= x) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (a[lo] !== undefined && cmp(a[lo]) === x) hi = lo;
                return [a[lo], a[hi]];
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
                var emPxFactor = $scope.ganttScroll.children()[0].offsetWidth / $scope.ganttInnerWidth;
                var clickedColumn = $scope.calcClosestColumns($scope.getOffset(e).x / emPxFactor, function(c) { return c.left; })[0];
                $scope.onRowClicked({ event: { row: row.clone(), column: clickedColumn.clone(), date: df.clone(clickedColumn.date) } });

                e.stopPropagation();
                e.preventDefault();
            };

            $scope.raiseRowUpdated = function(row) {
                $scope.onRowUpdated({ event: { row: row.clone() } });
            };

            $scope.raiseScrollEvent = function() {
                var el = $scope.ganttScroll[0];
                var direction = null;
                var date;

                if (el.scrollLeft === 0) {
                    direction = 'left';
                    date = df.clone($scope.gantt.columns.getFirst().date);
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    direction = 'right';
                    date = df.clone($scope.gantt.columns.getLast().date);
                }

                if (direction !== null) {
                    // Timeout is a workaround to because of the horizontal scroll wheel problem on OSX.
                    // It seems that there is a scroll momentum which will continue the scroll when we add new data
                    // left or right of the Gantt directly in the scroll event.
                    // => Tips how to improve this are appreciated :)
                    $timeout(function() {
                        $scope.autoExpandColumns(el, date, direction);
                        $scope.onScroll({ event: { date: date, direction: direction }});
                    }, 500, true);
                }
            };

            $scope.raiseTaskClicked = function(e, row, task) {
                var rClone = row.clone();

                $scope.onTaskClicked({ event: {row: rClone, task: rClone.tasksMap[task.id] } });

                e.stopPropagation();
                e.preventDefault();
            };

            // Clear all existing rows and tasks
            $scope.removeAllData = function() {
                $scope.gantt.removeRows();
                $scope.updateBounds();
            };

            // Bind scroll event
            $scope.ganttScroll = angular.element($element.children()[2]);
            $scope.ganttScroll.bind('scroll', $scope.raiseScrollEvent);
            $scope.setData = function (data) {
                var el = $scope.ganttScroll[0];
                var oldDateRange = $scope.gantt.columns.hours.length > 0 ? $scope.gantt.columns.getLast().date - $scope.gantt.columns.getFirst().date : 1;
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
                    var firstDate = $scope.fromDate ? $scope.fromDate : $scope.gantt.columns.getFirst().date;
                    var lastDate =  $scope.toDate ? $scope.toDate : $scope.gantt.columns.getLast().date;

                    if (firstDate !== undefined && lastDate !== undefined) {
                        $scope.gantt.expandColumns(firstDate, lastDate);
                    }
                }

                $scope.updateBounds();
                $scope.sortRows();

                // Show Gantt at the same position as it was before adding the new data
                el.scrollLeft = el.scrollLeft === 0 && $scope.gantt.columns.hours.length > 0 ? (($scope.gantt.columns.getLast().date - $scope.gantt.columns.getFirst().date) * oldWidth) / oldDateRange - oldWidth : el.scrollLeft;
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

            // Clear data handler.
            $scope.clearData({ fn: $scope.removeAllData});

            // Gantt is initialized. Signal that the Gantt is ready.
            $scope.onGanttReady();
        }
    ]};
}]);
