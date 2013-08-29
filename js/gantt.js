/* 
 Project: Gantt chart for Angular.js
 Author: Marco Schweighauser (2013)
 License: MIT License. See README.md
*/

"use strict";

var gantt = angular.module('gantt', []);

gantt.directive('gantt', ['dateFunctions', function (df) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: function (tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return "template/gantt.tmpl.html";
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope: { viewScale: "=?",
                 sortMode: "=?",
                 autoExpand: "=?",
                 firstDayOfWeek: "=?",
                 weekendDays: "=?",
                 loadData: "&",
                 removeData: "&",
                 onGanttReady: "&",
                 onRowAdded: "&",
                 onRowClicked: "&",
                 onRowUpdated: "&",
                 onScroll: "&",
                 onTaskClicked: "&"
        },
        controller: ['$scope', '$element', '$timeout', function ($scope, $element, $timeout) {
            $scope.rows = [];    // Provides a sortable list with access to the Gantt rows
            $scope.rowsMap = {};   // Gantt rows data
            $scope.columns = [];
            $scope.viewScaleFactor = 2;
            $scope.ganttInnerWidth = 0;
            if ($scope.autoExpand === undefined) $scope.autoExpand = false;
            if ($scope.sortMode === undefined) $scope.sortMode = "name"; // name, date, custom
            if ($scope.viewScale === undefined) $scope.viewScale = "day"; // hour, day
            if ($scope.firstDayOfWeek === undefined) $scope.firstDayOfWeek = 1; // 0=Sunday, 1=Monday, ..
            if ($scope.weekendDays === undefined) $scope.weekendDays = [0,6]; // Array: 0=Sunday, 1=Monday, ..

            $scope.isViewHour = function () {
                return $scope.viewScale === "hour";
            }

            $scope.isViewDay = function () {
                return $scope.viewScale === "day";
            }

            $scope.isWeekend = function(day) {
                for (var i = 0, l = $scope.weekendDays.length; i < l; i++) {
                    if ($scope.weekendDays[i] === day) {
                        return true;
                    }
                }

                return false;
            }

            $scope.viewMonthFilter = function (a) {
                return (a.date.getDate() == 1 || a === $scope.columns[0]) && a.date.getHours() == 0;
            }

            $scope.viewWeekFilter = function (a) {
                return (a.date.getDay() == $scope.firstDayOfWeek || a === $scope.columns[0]) && a.date.getHours() == 0;
            }

            $scope.viewDayFilter = function (a) {
                return a.date.getHours() == 0 || a === $scope.columns[0];
            }

            $scope.viewColumnFilter = function (a) {
                if ($scope.isViewHour()) {
                    return true;
                } else {
                    return $scope.viewDayFilter(a);
                }
            }

            // Adds a row to the list of rows. Merges the row and it tasks if there is already one with the same id
            $scope.addRow = function (row) {
                // Copy to new row (add) or merge with existing (update)
                var ganttRow;
                var isAdd = false;

                if (row.id in $scope.rowsMap) {
                    ganttRow = $scope.rowsMap[row.id];
                } else {
                    isAdd = true;
                    ganttRow = { id: row.id, tasksMap: {}, tasks: [] };
                    $scope.rowsMap[ganttRow.id] = ganttRow;
                    $scope.rows.push(ganttRow);
                }

                ganttRow.description = row.description;
                ganttRow.order = row.order;

                for (var i = 0, l = row.tasks.length; i < l; i++) {
                    var task = row.tasks[i];
                    $scope.addTask(ganttRow, task);
                    $scope.expandColumnRange(task.from, task.to);
                    $scope.findEarliestFromDate(ganttRow, task);
                }

                if (isAdd === true) {
                    $scope.raiseRowAdded(ganttRow);
                } else {
                    $scope.raiseRowUpdated(ganttRow);
                }
            };

            // Adds a task to a specific row. Merges the task if there is already one with the same id
            $scope.addTask = function (row, task) {
                // Copy to new task (add) or merge with existing (update)
                var ganttTask;
                if (task.id in row.tasksMap) {
                    ganttTask = row.tasksMap[task.id];
                } else {
                    ganttTask = { id: task.id };
                    row.tasksMap[ganttTask.id] = ganttTask;
                    row.tasks.push(ganttTask);
                }

                ganttTask.subject = task.subject;
                ganttTask.color = task.color;
                ganttTask.from = df.clone(task.from);
                ganttTask.to = df.clone(task.to);
            }

            // Removes the complete row including all tasks
            $scope.removeRow = function(rowId) {
                if (rowId in $scope.rowsMap) {
                    delete $scope.rowsMap[rowId]; // Remove from map

                    for (var i = 0, l = $scope.rows.length; i < l; i++) {
                        if ($scope.rows[i].id === rowId) {
                            $scope.rows.splice(i, 1); // Remove from array
                            break;
                        }
                    }
                }
            }

            // Remove the specified task from the row
            $scope.removeTask = function(rowId, taskId) {
                if (rowId in $scope.rowsMap) {
                    var row = $scope.rowsMap[rowId];
                    if (taskId in row.tasksMap) {
                        delete row.tasksMap[taskId]; // Remove from map

                        for (var i = 0, l = row.tasks.length; i < l; i++) {
                            if (row.tasks[i].id === taskId) {
                                row.tasks.splice(i, 1); // Remove from array
                                break;
                            }
                        }

                        // Update earliest date info as this may have changed
                        row.minFromDate = undefined;
                        for (var i = 0, l = row.tasks.length; i < l; i++) {
                            $scope.findEarliestFromDate(row, row.tasks[i]);
                        }
                    }
                }
            }

            // Calculate the earliest from date of all tasks in a row
            $scope.findEarliestFromDate = function (row, task) {
                if (row.minFromDate === undefined) {
                    row.minFromDate = task.from;
                } else if (task.from < row.minFromDate) {
                    row.minFromDate = task.from;
                }
            }

            // Expands the range of columns according to the form - to date.
            // Its save to call this function twice with the same or an overlapping range.
            $scope.expandColumnRange = function (from, to) {
                if ($scope.columns.length == 0 || from < $scope.columns[0].date) {
                    $scope.addColumns(df.setTimeZero(from, true), $scope.columns.length == 0 ? df.setTimeZero(to, true) : df.addMilliseconds($scope.columns[0].date, -1, true));
                }

                if (to > $scope.columns[$scope.columns.length - 1].date) {
                    $scope.addColumns(df.addHours($scope.columns[$scope.columns.length - 1].date, 1, true), df.setTimeZero(to, true));
                }
            }

            // All dates including from - to are added to the column array.
            // Use expandColumnRange as addColumns does not check for existing columns
            $scope.addColumns = function (from, to) {
                var date = df.clone(from);
                while (date <= to) {
                    for (var i = 0; i < 24; i++) {
                        var column = { date: df.clone(date) };
                        $scope.columns.push(column);

                        df.addHours(date, 1);
                    }
                }

                $scope.columns.sort(function (a, b) {
                    return a.date > b.date ? 1 : -1;
                });
            }

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            $scope.swapRows = function (a, b) {
                // Assign to all rows an order
                for (var i = 0, l = $scope.rows.length; i < l; i++) {
                    $scope.rows[i].order = i;
                }

                // Swap the two rows
                var order = a.order;
                a.order = b.order;
                b.order = order;

                // Raise change events
                $scope.raiseRowUpdated(a);
                $scope.raiseRowUpdated(b);

                // Switch to custom sort mode and trigger sort
                if ($scope.sortMode !== "custom") {
                    $scope.sortMode = "custom"; // Sort will be triggered by the watcher
                } else {
                    $scope.sortRows();
                }
            }

            $scope.$watch("sortMode", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.sortRows();
                }
            });

            // Sort rows by the current sort mode
            $scope.sortRows = function () {
                switch ($scope.sortMode) {
                    case "name":
                        $scope.rows.sort($scope.sortByName);
                        break;
                    case "custom":
                        $scope.rows.sort($scope.sortByCustom);
                        break;
                    default:
                        $scope.rows.sort($scope.sortByDate);
                        break;
                }
            }

            // Sort helper to sort by description name
            $scope.sortByName = function (a, b) {
                if (a.description === b.description) {
                    return 0;
                } else {
                    return (a.description < b.description) ? -1 : 1;
                }
            }

            // Sort helper to sort by order.
            // If a row has no order move it at the end. If both rows have no order they will be sorted by name.
            $scope.sortByCustom = function (a, b) {
                if (a.order === undefined && b.order === undefined) {
                    return $scope.sortByName(a, b);
                } else if (a.order === undefined) {
                    return 1;
                } else if (b.order === undefined) {
                    return -1;
                } else {
                    return a.order - b.order;
                }
            }

            // Sort helper to sort by the date of the task with the earliest from date.
            // Rows with no min date will be sorted by name
            $scope.sortByDate = function (a, b) {
                if (a.minFromDate === undefined && b.minFromDate === undefined) {
                    return $scope.sortByName(a, b)
                } else if (a.minFromDate === undefined) {
                    return 1;
                } else if (b.minFromDate === undefined) {
                    return -1;
                } else {
                    return a.minFromDate - b.minFromDate;
                }
            }

            $scope.$watch("viewScale", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.updateBounds();
                }
            });

            // Update all task and column bounds.
            $scope.updateBounds = function() {
                for (var i = 0, l = $scope.columns.length; i < l; i++) {
                    $scope.updateColumnBounds($scope.columns[i]);
                }

                for (var i = 0, l = $scope.rows.length; i < l; i++) {
                    var row = $scope.rows[i];
                    for (var j = 0, k = row.tasks.length; j < k; j++) {
                        $scope.updateTaskBounds(row.tasks[j]);
                    }
                }

                $scope.ganttInnerWidth = ($scope.isViewDay() ? $scope.columns.length / 24: $scope.columns.length) * $scope.viewScaleFactor;
            }

            // Returns the width as number of the specified time span
            $scope.calcWidth = function (timespan) {
                if ($scope.isViewHour()) {
                    return timespan * $scope.viewScaleFactor / 3600000.0;
                } else {
                    return timespan * $scope.viewScaleFactor / 86400000.0;
                }
            }

            // Calculate the bounds of a task and publishes it as properties
            $scope.updateTaskBounds = function(task) {
                task.x = $scope.calcTaskX(task);
                task.width = $scope.calcTaskWidth(task);
            }

            // Returns the x position of a specific task
            $scope.calcTaskX = function (task) {
                return $scope.calcWidth(task.from - $scope.columns[0].date);
            }

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
            }

            // Calculate the bounds of a column and publishes it as properties
            $scope.updateColumnBounds = function(column) {
                if ($scope.viewMonthFilter(column)) column.widthMonth = $scope.calcColWidth(column, 'month');
                if ($scope.viewWeekFilter(column)) column.widthWeek = $scope.calcColWidth(column, 'week');
                column.widthDay = $scope.isViewHour() ? $scope.calcColWidth(column, 'day') : $scope.viewScaleFactor;
                column.isWeekend = $scope.isWeekend(column.date.getDay());
            }

            // Returns the width of a column. Scale = 'hour', 'day', 'week', 'month'
            $scope.calcColWidth = function (column, scale) {
                var width = $scope.calcWidth(df.addHours(column.date, 1, true) - column.date);
                var lastColumnDate = $scope.columns[$scope.columns.length - 1].date;

                if (scale === "hour") {
                    return width; // Hour header shall be 1 hour wide
                } else if (scale === "day") {
                    if ($scope.isViewHour()) {
                        // Day header shall be 24 hours wide but no longer than the last hour shown
                        var endHour = df.addHours(column.date, 24, true) > lastColumnDate ? lastColumnDate.getHours() + 1 : 24.0;
                        return width * endHour;
                    } else if ($scope.isViewDay()) {
                        return width * 24; // Day header shall be one day wide
                    }
                } else if (scale === "week") {
                    // Week header shall be as wide as there are days in the week but no longer as the last date shown
                    var startDay = column.date;
                    var firstDayInWeek = df.setToDayOfWeek(startDay, $scope.firstDayOfWeek, true);
                    var lastDayInWeek = df.addWeeks(firstDayInWeek, 1);
                    var endDay = lastDayInWeek > lastColumnDate ? df.addHours(lastColumnDate, 1, true) : lastDayInWeek;
                    return $scope.calcWidth(endDay - startDay);
                } else if (scale === "month") {
                    // Month header shall be as wide as there are days in the month but no longer as the last date shown
                    var startDay = column.date;
                    var lastDayInMonth = df.addMonths(df.setToFirstDayOfMonth(startDay, true), 1);
                    var endDay = lastDayInMonth > lastColumnDate ? df.addHours(lastColumnDate, 1, true) : lastDayInMonth;
                    return $scope.calcWidth(endDay - startDay);
                }
            }

            // Expands the date area when the user scroll to either left or right end.
            // May be used for the write mode in the future.
            $scope.autoExpandColumns = function(el, from, to) {
                if ($scope.autoExpand !== true) {
                    return;
                }

                var oldScrollLeft = el.scrollLeft == 0 ? ((to - from) * el.scrollWidth) / ($scope.columns[$scope.columns.length-1].date - $scope.columns[0].date) : el.scrollLeft;
                $scope.expandColumnRange(from, to);
                $scope.updateBounds();

                // Show Gantt at the same position as it was before expanding the date area
                el.scrollLeft = oldScrollLeft;
            }

            $scope.raiseRowAdded = function(row) {
                $scope.onRowAdded({ event: { row: row } });
            }

            $scope.raiseRowClicked = function(e, row) {
                $scope.onRowClicked({ event: { row: row } });

                e.stopPropagation();
                e.preventDefault();
            }

            $scope.raiseRowUpdated = function(row) {
                $scope.onRowUpdated({ event: { row: row } });
            }

            $scope.raiseScrollEvent = function() {
                var el = $scope.ganttScroll[0];
                var pos = undefined;
                var date = undefined;
                var from, to = undefined;

                if (el.scrollLeft == 0) {
                    pos = 'left';
                    date = df.clone($scope.columns[0].date);
                } else if (el.offsetWidth + el.scrollLeft >= el.scrollWidth) {
                    pos = 'right';
                    date = df.clone($scope.columns[$scope.columns.length-1].date);
                }

                if (pos !== undefined) {
                    // Timeout is a workaround to because of the horizontal scroll wheel problem on OSX.
                    // It seems that there is a scroll momentum which will continue the scroll when we add new data
                    // left or right of the Gantt directly in the scroll event.
                    // => Tips how to improve this are appreciated :)
                    $timeout(function() {
                        $scope.autoExpandColumns(el, from, to);
                        $scope.onScroll({ event: { date: date, position: pos }});
                    }, 500, true);
                }
            }

            $scope.raiseTaskClicked = function(e, row, task) {
                $scope.onTaskClicked({ event: {row: row, task: task } });

                e.stopPropagation();
                e.preventDefault();
            }

            // Add a watcher if the week day settings are changed from outside of the Gantt. Update the grid accordingly if so.
            $scope.$watch('firstDayOfWeek+weekendDays', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    $scope.updateBounds();
                }
            });

            // Bind scroll event
            $scope.ganttScroll = angular.element($element.children()[1]);
            $scope.ganttScroll.bind('scroll', $scope.raiseScrollEvent);

            // Gantt is initialized. Load data.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: function(rows) {
                var el = $scope.ganttScroll[0];
                var oldRange = $scope.columns.length > 0 ? $scope.columns[$scope.columns.length-1].date - $scope.columns[0].date: 1;
                var oldWidth = el.scrollWidth;

                for (var i = 0, l = rows.length; i < l; i++) {
                    $scope.addRow(rows[i]);
                }

                $scope.updateBounds();
                $scope.sortRows();

                // Show Gantt at the same position as it was before adding the new data
                var oldScrollLeft = el.scrollLeft == 0 ? (($scope.columns[$scope.columns.length-1].date - $scope.columns[0].date) * oldWidth) / oldRange - oldWidth : el.scrollLeft;
                el.scrollLeft = oldScrollLeft;
            }});

            // Remove data. If a row has no tasks inside the complete row will be deleted.
            $scope.removeData({ fn: function(rows) {
                for (var i = 0, l = rows.length; i < l; i++) {
                    var row = rows[i];

                    if (row.tasks !== undefined && row.tasks.length > 0) {
                        // Only delete the specified tasks but not the row and the other tasks
                        for (var j = 0, k = row.tasks.length; j < k; j++) {
                            $scope.removeTask(row.id, row.tasks[j].id);
                        }
                    } else {
                        // Delete the complete row
                        $scope.removeRow(row.id);
                    }
                }

                $scope.updateBounds();
                $scope.sortRows();
            }})

            // Signal that the Gantt is ready
            $scope.onGanttReady();
        }
    ]};
}]);

gantt.service('dateFunctions', [ function () {
    // Date calculations from: http://www.datejs.com/ | MIT License
    return {
        firstDayOfWeek: 1,
        clone: function(date) {
            return new Date(date.getTime());
        },
        setTimeZero: function(date, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setHours(0);
            res.setMinutes(0);
            res.setMilliseconds(0);
            return res;
        },
        setToFirstDayOfMonth: function(date, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setDate(1);
            return res;
        },
        setToDayOfWeek: function(date, dayOfWeek, clone) {
            var res = clone === true ? this.clone(date) : date;
            if (res.getDay() === dayOfWeek) {
                return res;
            } else {
                var orient = -1;
                var diff = (dayOfWeek - res.getDay() + 7 * (orient || +1)) % 7;
                return this.addDays(res, (diff === 0) ? diff += 7 * (orient || +1) : diff);
            }
        },
        addMonths: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setDate(1);
            res.setMonth(res.getMonth() + val);
            return res;
        },
        addWeeks: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setDate(res.getDate() + val * 7);
            return res;
        },
        addDays: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setDate(res.getDate() + val);
            return res;
        },
        addHours: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setHours(date.getHours() + val);
            return res;
        },
        addMinutes: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setMinutes(date.getMinutes() + val);
            return res;
        },
        addMilliseconds: function(date, val, clone) {
            var res = clone === true ? this.clone(date) : date;
            res.setMilliseconds(date.getMilliseconds() + val);
            return res;
        },
        getWeek: function(date) {
            /* Returns the number of the week. The number is calculated according to ISO 8106 */
            var $y, $m, $d;
            var a, b, c, d, e, f, g, n, s, w;

            $y = date.getFullYear();
            $m = date.getMonth() + 1;
            $d = date.getDate();

            if ($m <= 2) {
                a = $y - 1;
                b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
                c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
                s = b - c;
                e = 0;
                f = $d - 1 + (31 * ($m - 1));
            } else {
                a = $y;
                b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
                c = ((a - 1) / 4 | 0) - ((a - 1) / 100 | 0) + ((a - 1) / 400 | 0);
                s = b - c;
                e = s + 1;
                f = $d + ((153 * ($m - 3) + 2) / 5) + 58 + s;
            }

            g = (a + b) % 7;
            d = (f + g - e) % 7;
            n = (f + 3 - d) | 0;

            if (n < 0) {
                w = 53 - ((g - s) / 5 | 0);
            } else if (n > 364 + s) {
                w = 1;
            } else {
                w = (n / 7 | 0) + 1;
            }

            $y = $m = $d = null;

            return w;
        }
    };
}]);

gantt.filter('dateWeek', ['dateFunctions', function (df) {
    return function (date) {
        return df.getWeek(date);
    }
}]);

gantt.directive('ganttInfo', ['dateFilter', '$timeout', '$document', function (dateFilter, $timeout, $document) {
    return {
        restrict: "E",
        template: "<div ng-mouseenter='mouseEnter($event)' ng-mouseleave='mouseLeave($event)'>" +
            "<div ng-show='visible' class='gantt-task-info' ng-style='css'>" +
            "<div class='gantt-task-info-content'>" +
            "{{ task.subject }}</br>" +
            "<small>" +
            "{{ task.to - task.from === 0 &&" +
            " (task.from | date:'MMM d, HH:mm') ||" +
            " (task.from | date:'MMM d, HH:mm') + ' - ' + (task.to | date:'MMM d, HH:mm') }}" +
            "</small>" +
            "</div>" +
            "</div>" +
            "<div ng-transclude></div>" +
            "</div>",
        replace: true,
        transclude: true,
        scope: { task: "=ngModel" },
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.visible = false;
            $scope.css = {};

            $scope.mouseEnter = function (e) {
                $scope.visible = true;

                $timeout(function(){
                    var elTip = angular.element($element.children()[0]);

                    elTip.removeClass('gantt-task-infoArrow');
                    elTip.removeClass('gantt-task-infoArrowR');

                    // Check if info is overlapping with view port
                    if (e.clientX + elTip[0].offsetWidth > $scope.getViewPortWidth()) {
                        $scope.css.left = (e.clientX + 20 - elTip[0].offsetWidth) + "px";
                        elTip.addClass('gantt-task-infoArrowR'); // Right aligned info
                    } else {
                        $scope.css.left = (e.clientX - 20) + "px";
                        elTip.addClass('gantt-task-infoArrow');
                    }
                    $scope.css.top = $element[0].getBoundingClientRect().top + "px";
                    $scope.css.marginTop = -elTip[0].offsetHeight - 8 + "px";
                    $scope.css.opacity = 1;
                },1, true);
            }

            $scope.mouseLeave = function (e) {
                $scope.css.opacity = 0;
                $scope.visible = false;
            };

            $scope.getViewPortWidth = function() {
                var d = $document[0];
                return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
            }
        }]
    };
}]);

gantt.service('sortableState', [ function () {
    return { startRow: undefined };
}]);

gantt.directive('ganttSortable', ['$document', 'sortableState', function ($document, sortableState) {
    return {
        restrict: "E",
        template: "<div ng-transclude></div>",
        replace: true,
        transclude: true,
        scope: { row: "=ngModel", swap: "&" },
        controller: ['$scope', '$element', function ($scope, $element) {
            $element.bind("mousedown", function (e) {
                enableDragMode();

                var disableHandler = function () {
                    angular.element($document[0].body).unbind('mouseup', disableHandler);
                    disableDragMode();
                };
                angular.element($document[0].body).bind("mouseup", disableHandler);
            });

            $element.bind("mousemove", function (e) {
                if (isInDragMode()) {
                    var elementBelowMouse = angular.element($document[0].elementFromPoint(e.clientX, e.clientY));
                    var targetRow = elementBelowMouse.controller("ngModel").$modelValue;

                    $scope.$apply(function() {
                        $scope.swap({a: targetRow, b: sortableState.startRow});
                    });
                }
            });

            var isInDragMode = function () {
                return sortableState.startRow !== undefined && !angular.equals($scope.row, sortableState.startRow);
            }

            var enableDragMode = function () {
                sortableState.startRow = $scope.row;
                $element.css("cursor", "move");
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': 'no-drop'
                });
            };

            var disableDragMode = function () {
                sortableState.startRow = undefined;
                $element.css("cursor", "pointer");
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': 'auto'
                });
            };
        }]
    };
}]);