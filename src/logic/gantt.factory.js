'use strict';
gantt.factory('Gantt', ['$filter', 'Row', 'Timespan', 'ColumnGenerator', 'HeaderGenerator', 'moment', 'binarySearch', function($filter, Row, Timespan, ColumnGenerator, HeaderGenerator, moment, bs) {

    // Gantt logic. Manages the columns, rows and sorting functionality.
    var Gantt = function($scope, $element) {
        var self = this;
        self.$element = $element;

        self.rowsMap = {};
        self.rows = [];

        self.timespansMap = {};
        self.timespans = [];

        self.columns = [];

        self.headers = {};

        self.previousColumns = [];
        self.nextColumns = [];

        self.width = 0;
        var dateRange;

        // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
        // All those changes need a recalculation of the header columns
        $scope.$watch('viewScale+width+labelsWidth+columnWidth+columnSubScale+firstDayOfWeek+weekendDays+showWeekends+workHours+showNonWorkHours', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.requestDateRange($scope.fromDate, $scope.toDate);
                self.buildGenerators();
                self.reGenerateColumns();
            }
        });

        $scope.$watch('fromDate+toDate+autoExpand+taskOutOfRange', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.requestDateRange($scope.fromDate, $scope.toDate);
            }
        });

        $scope.$watch('currentDate+currentDateValue', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.setCurrentDate($scope.currentDateValue);
            }
        });

        var updateVisibleColumns = function() {
            angular.forEach(self.columns, function(column) {
                column.hidden = true;
            });
            var columns = $filter('ganttColumnLimit')(self.columns, $scope.scrollLeft, $scope.scrollWidth);
            angular.forEach(columns, function(column) {
                column.hidden = false;
            });

            angular.forEach(self.headers, function(headers, key) {
                if (self.headers.hasOwnProperty(key)) {
                    angular.forEach(headers, function(header) {
                        header.hidden = true;
                    });
                    var visibleHeaders = $filter('ganttColumnLimit')(headers, $scope.scrollLeft, $scope.scrollWidth);
                    angular.forEach(visibleHeaders, function(header) {
                        header.hidden = false;
                    });
                }
            });
        };

        var updateVisibleRows = function() {
            angular.forEach(self.rows, function(row) {
                row.hidden = true;
            });
            var visibleRows = $filter('ganttRowLimit')(self.rows, $scope.filterRow, $scope.filterRowComparator);
            angular.forEach(visibleRows, function(row) {
                row.hidden = false;
            });
        };

        var updateVisibleTasks = function() {
            angular.forEach(self.rows, function(row) {
                angular.forEach(row.tasks, function(task) {
                    task.hidden = true;
                });
                var visibleTasks = $filter('ganttTaskLimit')(row.tasks, $scope.scrollLeft, $scope.scrollWidth, self, $scope.filterTask, $scope.filterTaskComparator);
                angular.forEach(visibleTasks, function(task) {
                    task.hidden = false;
                });
            });
        };

        var updateVisibleObjects = function() {
            updateVisibleRows();
            updateVisibleTasks();
        };

        updateVisibleColumns();
        updateVisibleObjects();

        $scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                updateVisibleColumns();
                updateVisibleTasks();
            }
        });

        $scope.$watch('filterTask+filterTaskComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                updateVisibleTasks();
            }
        });

        $scope.$watch('filterRow+filterRowComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                updateVisibleRows();
            }
        });

        // Sets the Gantt view scale. Call reGenerateColumns to make changes visible after changing the view scale.
        // The headers are shown depending on the defined view scale.
        self.buildGenerators = function() {
            switch ($scope.viewScale) {
                case 'hour':
                    self.columnGenerator = new ColumnGenerator.HourGenerator($scope.width, $scope.columnWidth, $scope.columnSubScale, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
                    break;
                case 'day':
                    self.columnGenerator = new ColumnGenerator.DayGenerator($scope.width, $scope.columnWidth, $scope.columnSubScale, $scope.weekendDays, $scope.showWeekends, $scope.workHours, $scope.showNonWorkHours);
                    break;
                case 'week':
                    self.columnGenerator = new ColumnGenerator.WeekGenerator($scope.width, $scope.columnWidth, $scope.columnSubScale);
                    break;
                case 'month':
                    self.columnGenerator = new ColumnGenerator.MonthGenerator($scope.width, $scope.columnWidth, $scope.columnSubScale);
                    break;
                default:
                    throw 'Unsupported view scale: ' + $scope.viewScale;
            }

            self.headerGenerator = new HeaderGenerator.instance($scope);
        };
        self.buildGenerators();

        self.requestDateRange = function(from, to) {
            if (from && to) {
                if ($scope.taskOutOfRange === 'expand') {
                    setExpandedDateRange(from, to);
                    expandColumns();
                } else {
                    setDateRange(from, to);
                    generateColumns(dateRange.from, dateRange.to);
                }
            }
        };

        var setDateRange = function(from, to) {
            from = moment(from);
            to = moment(to);

            if (dateRange === undefined) {
                dateRange = {};
                dateRange.from = from;
                dateRange.to = to;
            } else {
                dateRange.from = from;
                dateRange.to = to;
            }
        };

        var setExpandedDateRange = function(from, to) {
            from = from ? moment(from) : from;
            to = to ? moment(to) : to;

            if (!dateRange && from && to) {
                dateRange = {};
                dateRange.from = from;
                dateRange.to = to;
            } else if (dateRange) {
                if (from && from < dateRange.from) {
                    dateRange.from = from;
                }
                var minTaskFrom = dateRange.from;
                angular.forEach(self.rows, function(row) {
                    angular.forEach(row.tasks, function(task) {
                        if (minTaskFrom === null || minTaskFrom > task.from) {
                            minTaskFrom = task.from;
                        }
                    });
                });
                if (minTaskFrom && minTaskFrom < dateRange.from) {
                    dateRange.from = minTaskFrom;
                }
                if (to && to > dateRange.to) {
                    dateRange.to = to;
                }
                var maxTaskTo = null;
                angular.forEach(self.rows, function(row) {
                    angular.forEach(row.tasks, function(task) {
                        if (maxTaskTo === null || maxTaskTo < task.to) {
                            maxTaskTo = task.to;
                        }
                    });
                });
                if (maxTaskTo && maxTaskTo > dateRange.to) {
                    dateRange.to = maxTaskTo;
                }
            }
        };

        // Generates the Gantt columns according to dateRange. The columns are generated if necessary only.
        var expandColumns = function() {
            if (dateRange === undefined) {
                return false;
            }

            // Only expand if expand is necessary
            if (self.columns.length === 0) {
                return generateColumns(dateRange.from, dateRange.to);
            } else if (self.columnGenerator.columnExpandNecessary(self.getFirstColumn().date, self.getLastColumn().date, dateRange.from, dateRange.to)) {
                var minFrom = self.getFirstColumn().date > dateRange.from ? dateRange.from : self.getFirstColumn().date;
                var maxTo = self.getLastColumn().date < dateRange.to ? dateRange.to : self.getLastColumn().date;

                return generateColumns(minFrom, maxTo);
            }
        };
        self.requestDateRange($scope.fromDate, $scope.toDate);

        self.setCurrentDate = function(currentDate) {
            self._currentDate = currentDate;
            angular.forEach(self.columns, function(column) {
                if (currentDate >= column.date && currentDate < column.getEndDate()) {
                    column.currentDate = currentDate;
                } else {
                    delete column.currentDate;
                }
            });
        };
        self.setCurrentDate($scope.currentDateValue);

        // Generates the Gantt columns according to the specified from - to date range. Uses the currently assigned column generator.
        var generateColumns = function(from, to) {
            self.columns = self.columnGenerator.generate(from, to);
            self.headers = self.headerGenerator.generate(self.columns);
            if (self._currentDate) {
                self.setCurrentDate(self._currentDate);
            }
            self.previousColumns = [];
            self.nextColumns = [];

            var lastColumn = self.getLastColumn();
            self.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

            self.updateTasksPosAndSize();
            self.updateTimespansPosAndSize();

            setDateRange(from, to);
            $scope.fromDate = from;
            $scope.toDate = to;

            updateVisibleColumns();
            updateVisibleObjects();

            return true;
        };

        var expandExtendedColumnsForPosition = function(x) {
            if (x < 0) {
                var firstColumn = self.getFirstColumn();
                var from = firstColumn.date;
                var firstExtendedColumn = self.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                    self.previousColumns = self.columnGenerator.generate(from, null, -x, 0, true);
                }
                return true;
            } else if (x > self.width) {
                var lastColumn = self.getLastColumn();
                var endDate = lastColumn.getDateByPosition(lastColumn.width);
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                    self.nextColumns = self.columnGenerator.generate(endDate, null, x - self.width, self.width, false);
                }
                return true;
            }
            return false;
        };

        var expandExtendedColumnsForDate = function(date) {
            var firstColumn = self.getFirstColumn();
            var from = null;
            if (firstColumn) {
                from = firstColumn.date;
            }

            var lastColumn = self.getLastColumn();
            var endDate = null;
            if (lastColumn) {
                endDate = lastColumn.getDateByPosition(lastColumn.width);
            }

            if (from && date < from) {
                var firstExtendedColumn = self.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                    self.previousColumns = self.columnGenerator.generate(from, date, null, 0, true);
                }
                return true;
            } else if (endDate && date > endDate) {
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || endDate < lastExtendedColumn) {
                    self.nextColumns = self.columnGenerator.generate(endDate, date, null, self.width, false);
                }
                return true;
            }
            return false;
        };

        // Removes all existing columns and re-generates them. E.g. after e.g. the view scale changed.
        // Rows can be re-generated only if there is a data-range specified. If the re-generation failed the function returns false.
        self.reGenerateColumns = function() {
            self.columns = [];
            self.previousColumns = [];
            self.nextColumns = [];

            if (dateRange !== undefined) {
                expandColumns();
                return true;
            } else {
                return false;
            }
        };

        // Update the position/size of all tasks in the Gantt
        self.updateTasksPosAndSize = function() {
            for (var i = 0, l = self.rows.length; i < l; i++) {
                for (var j = 0, k = self.rows[i].tasks.length; j < k; j++) {
                    self.rows[i].tasks[j].updatePosAndSize();
                }
            }
        };

        // Update the position/size of all timespans in the Gantt
        self.updateTimespansPosAndSize = function() {
            for (var i = 0, l = self.timespans.length; i < l; i++) {
                self.timespans[i].updatePosAndSize();
            }
        };

        // Returns the first Gantt column or undefined
        self.getLastColumn = function(extended) {
            var columns = self.columns;
            if (extended) {
                columns = self.nextColumns;
            }
            if (columns && columns.length > 0) {
                return columns[columns.length - 1];
            } else {
                return undefined;
            }
        };

        // Returns the last Gantt column or undefined
        self.getFirstColumn = function(extended) {
            var columns = self.columns;
            if (extended) {
                columns = self.previousColumns;
            }

            if (columns && columns.length > 0) {
                return columns[0];
            } else {
                return undefined;
            }
        };

        // Returns the column at the given or next possible date
        self.getColumnByDate = function(date) {
            expandExtendedColumnsForDate(date);
            var extendedColumns = self.previousColumns.concat(self.columns, self.nextColumns);
            var columns = bs.get(extendedColumns, date, function(c) {
                return c.date;
            });
            return columns[0] !== undefined ? columns[0] : columns[1];
        };

        // Returns the column at the given position x (in em)
        self.getColumnByPosition = function(x) {
            expandExtendedColumnsForPosition(x);
            var extendedColumns = self.previousColumns.concat(self.columns, self.nextColumns);
            return bs.get(extendedColumns, x, function(c) {
                return c.left;
            })[0];
        };

        // Returns the exact column date at the given position x (in em)
        self.getDateByPosition = function(x, snapForward) {
            var column = self.getColumnByPosition(x);
            if (column !== undefined) {
                if (snapForward !== undefined) {
                    return column.getDateByPosition(x - column.left, snapForward);
                }
                else {
                    return column.getDateByPosition(x - column.left);
                }
            } else {
                return undefined;
            }
        };

        // Returns the position inside the Gantt calculated by the given date
        self.getPositionByDate = function(date) {
            if (date === undefined) {
                return undefined;
            }

            if (!moment.isMoment(moment)) {
                date = moment(date);
            }

            var column = self.getColumnByDate(date);
            if (column !== undefined) {
                return column.getPositionByDate(date);
            } else {
                return undefined;
            }
        };

        // Returns the current Gantt date range or undefined if it has not been defined
        self.getDateRange = function() {
            if (dateRange === undefined) {
                return undefined;
            } else {
                return {
                    from: moment(dateRange.from),
                    to: moment(dateRange.to)
                };
            }
        };

        // Returns the min and max date of all loaded tasks or undefined if there are no tasks loaded
        self.getTasksDateRange = function() {
            if (self.rows.length === 0) {
                return undefined;
            } else {
                var minDate, maxDate;

                for (var i = 0, l = self.rows.length; i < l; i++) {
                    var row = self.rows[i];

                    if (minDate === undefined || row.from < minDate) {
                        minDate = row.from;
                    }

                    if (maxDate === undefined || row.to > maxDate) {
                        maxDate = row.to;
                    }
                }

                return {
                    from: minDate,
                    to: maxDate
                };
            }
        };

        // Returns the number of active headers
        self.getActiveHeadersCount = function() {
            var size = 0, key;
            for (key in self.headers) {
                if (self.headers.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        };

        // Adds or update rows and tasks.
        self.addData = function(data, addEventFn, updateEventFN) {
            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];
                var isUpdate = addRow(rowData);
                var row = self.rowsMap[rowData.id];

                if (isUpdate === true && updateEventFN !== undefined) {
                    updateEventFN(row);
                } else if (addEventFn !== undefined) {
                    addEventFn(row);
                }
            }

            expandColumns();
            updateVisibleObjects();
        };

        // Adds a row or merges the row and its tasks if there is already one with the same id
        var addRow = function(rowData) {
            // Copy to new row (add) or merge with existing (update)
            var row, isUpdate = false;

            if (rowData.id in self.rowsMap) {
                row = self.rowsMap[rowData.id];
                row.copy(rowData);
                isUpdate = true;
            } else {
                var order = rowData.order;

                // Check if the row has a order predefined. If not assign one
                if (order === undefined) {
                    order = self.highestRowOrder;
                }

                if (order >= self.highestRowOrder) {
                    self.highestRowOrder = order + 1;
                }

                row = new Row(rowData.id, self, rowData.name, order, rowData.data);
                self.rowsMap[rowData.id] = row;
                self.rows.push(row);
            }

            if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                    var task = row.addTask(rowData.tasks[i]);

                    if ($scope.taskOutOfRange === 'expand') {
                        setExpandedDateRange(task.from, task.to);
                        expandColumns();
                    }

                    task.updatePosAndSize();
                }
            }

            return isUpdate;
        };

        // Removes specified rows or tasks.
        // If a row has no tasks inside the complete row will be deleted.
        self.removeData = function(data, updateEventFn) {
            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];

                if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                    // Only delete the specified tasks but not the row and the other tasks

                    if (rowData.id in self.rowsMap) {
                        var row = self.rowsMap[rowData.id];

                        for (var j = 0, k = rowData.tasks.length; j < k; j++) {
                            row.removeTask(rowData.tasks[j].id);
                        }

                        if (updateEventFn !== undefined) {
                            updateEventFn(row);
                        }
                    }
                } else {
                    // Delete the complete row
                    removeRow(rowData.id);
                }
            }
            updateVisibleObjects();
        };

        // Removes the complete row including all tasks
        var removeRow = function(rowId) {
            if (rowId in self.rowsMap) {
                delete self.rowsMap[rowId]; // Remove from map

                for (var i = 0, l = self.rows.length; i < l; i++) {
                    var row = self.rows[i];
                    if (row.id === rowId) {
                        self.rows.splice(i, 1); // Remove from array
                        return row;
                    }
                }
            }

            return undefined;
        };

        // Removes all rows and tasks
        self.removeAllRows = function() {
            self.rowsMap = {};
            self.rows = [];
            self.highestRowOrder = 0;
            self.columns = [];
            self.headers = {};
            dateRange = undefined;
        };

        // Removes all timespans
        self.removeAllTimespans = function() {
            self.timespansMap = {};
            self.timespans = [];
        };

        // Swaps two rows and changes the sort order to custom to display the swapped rows
        self.swapRows = function(a, b) {
            // Swap the two rows
            var order = a.order;
            a.order = b.order;
            b.order = order;
        };

        // Sort rows by the specified sort mode (name, order, custom)
        // and by Ascending or Descending
        self.sortRows = function(expression) {
            var reverse = false;
            expression = expression;
            if (expression.charAt(0) === '-') {
                reverse = true;
                expression = expression.substr(1);
            }

            var angularOrderBy = $filter('orderBy');
            if (expression === 'custom') {
                self.rows = angularOrderBy(self.rows, 'order', reverse);
            } else {
                self.rows = angularOrderBy(self.rows, expression, reverse);
            }
        };

        // Adds or updates timespans
        self.addTimespans = function(timespans, addEventFn, updateEventFN) {
            for (var i = 0, l = timespans.length; i < l; i++) {
                var timespanData = timespans[i];
                var isUpdate = addTimespan(timespanData);
                var timespan = self.timespansMap[timespanData.id];

                if (isUpdate === true && updateEventFN !== undefined) {
                    updateEventFN(timespan);
                } else if (addEventFn !== undefined) {
                    addEventFn(timespan);
                }

                setExpandedDateRange(timespan.from, timespan.to);
                timespan.updatePosAndSize();
            }

            expandColumns();
        };

        // Adds a timespan or merges the timespan if there is already one with the same id
        var addTimespan = function(timespanData) {
            // Copy to new timespan (add) or merge with existing (update)
            var timespan, isUpdate = false;

            if (timespanData.id in self.timespansMap) {
                timespan = self.timespansMap[timespanData.id];
                timespan.copy(timespanData);
                isUpdate = true;
            } else {
                timespan = new Timespan(timespanData.id, self, timespanData.name, timespanData.color,
                    timespanData.classes, timespanData.priority, timespanData.from, timespanData.to, timespanData.data);
                self.timespansMap[timespanData.id] = timespan;
                self.timespans.push(timespan);
            }

            return isUpdate;
        };
    };

    return Gantt;
}]);
