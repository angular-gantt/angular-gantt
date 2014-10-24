'use strict';
gantt.factory('Gantt', ['$filter', 'GanttRow', 'GanttTimespan', 'GanttColumnGenerator', 'GanttHeaderGenerator', 'moment', 'ganttBinarySearch', function($filter, Row, Timespan, ColumnGenerator, HeaderGenerator, moment, bs) {

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

        self.from = undefined;
        self.to = undefined;

        // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
        // All those changes need a recalculation of the header columns
        $scope.$watch('viewScale+width+labelsWidth+columnWidth+timeFramesWorkingMode+timeFramesNonWorkingMode+columnMagnet', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.buildGenerators();
                self.clearColumns();
                self.updateColumns();
            }
        });

        $scope.$watch('fromDate+toDate+autoExpand+taskOutOfRange', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateColumns();
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

        var getExpandedFrom = function(from) {
            from = from ? moment(from) : from;

            var minRowFrom = from;
            angular.forEach(self.rows, function(row) {
                if (minRowFrom === undefined || minRowFrom > row.from) {
                    minRowFrom = row.from;
                }
            });
            if (minRowFrom && (!from || minRowFrom < from)) {
                return minRowFrom;
            }
            return from;
        };

        var getExpandedTo = function(to) {
            to = to ? moment(to) : to;

            var maxRowTo = to;
            angular.forEach(self.rows, function(row) {
                if (maxRowTo === undefined || maxRowTo < row.to) {
                    maxRowTo = row.to;
                }
            });
            if (maxRowTo && (!$scope.toDate || maxRowTo > $scope.toDate)) {
                return maxRowTo;
            }
            return to;
        };

        // Generates the Gantt columns according to the specified from - to date range. Uses the currently assigned column generator.
        var generateColumns = function(from, to) {
            if (!from) {
                from = getDefaultFrom();
                if (!from) {
                    return false;
                }
            }

            if (!to) {
                to = getDefaultTo();
                if (!to) {
                    return false;
                }
            }

            if (self.from === from && self.to === to) {
                return false;
            }

            self.from = from;
            self.to = to;

            self.columns = self.columnGenerator.generate(from, to);
            self.headers = self.headerGenerator.generate(self.columns);
            if (self._currentDate !== undefined) {
                self.setCurrentDate(self._currentDate);
            }
            self.previousColumns = [];
            self.nextColumns = [];

            var lastColumn = self.getLastColumn();
            self.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

            self.updateTasksPosAndSize();
            self.updateTimespansPosAndSize();

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
                    self.previousColumns = self.columnGenerator.generate(from, undefined, -x, 0, true);
                }
                return true;
            } else if (x > self.width) {
                var lastColumn = self.getLastColumn();
                var endDate = lastColumn.getDateByPosition(lastColumn.width);
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                    self.nextColumns = self.columnGenerator.generate(endDate, undefined, x - self.width, self.width, false);
                }
                return true;
            }
            return false;
        };

        var expandExtendedColumnsForDate = function(date) {
            var firstColumn = self.getFirstColumn();
            var from;
            if (firstColumn) {
                from = firstColumn.date;
            }

            var lastColumn = self.getLastColumn();
            var endDate;
            if (lastColumn) {
                endDate = lastColumn.getDateByPosition(lastColumn.width);
            }

            if (from && date < from) {
                var firstExtendedColumn = self.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                    self.previousColumns = self.columnGenerator.generate(from, date, undefined, 0, true);
                }
                return true;
            } else if (endDate && date > endDate) {
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || endDate < lastExtendedColumn) {
                    self.nextColumns = self.columnGenerator.generate(endDate, date, undefined, self.width, false);
                }
                return true;
            }
            return false;
        };

        // Sets the Gantt view scale. Call reGenerateColumns to make changes visible after changing the view scale.
        // The headers are shown depending on the defined view scale.
        self.buildGenerators = function() {
            var columnMagnetValue;
            var columnMagnetUnit;

            if ($scope.columnMagnet) {
                var splittedColumnMagnet = $scope.columnMagnet.trim().split(' ');
                if (splittedColumnMagnet.length > 1) {
                    columnMagnetValue = parseInt(splittedColumnMagnet[0]);
                    columnMagnetUnit = splittedColumnMagnet[splittedColumnMagnet.length-1];
                }
            }

            self.columnGenerator = new ColumnGenerator($scope.width, $scope.columnWidth, $scope.viewScale, $scope.calendar, $scope.timeFramesWorkingMode, $scope.timeFramesNonWorkingMode, columnMagnetValue, columnMagnetUnit);
            self.headerGenerator = new HeaderGenerator.instance($scope);
        };

        var getDefaultFrom = function() {
            var defaultFrom;
            angular.forEach(self.timespans, function(timespan) {
                if (defaultFrom === undefined || timespan.from < defaultFrom) {
                    defaultFrom = timespan.from;
                }
            });

            angular.forEach(self.rows, function(row) {
                if (defaultFrom === undefined || row.from < defaultFrom) {
                    defaultFrom = row.from;
                }
            });
            return defaultFrom;
        };

        var getDefaultTo = function() {
            var defaultTo;
            angular.forEach(self.timespans, function(timespan) {
                if (defaultTo === undefined || timespan.to > defaultTo) {
                    defaultTo = timespan.to;
                }
            });

            angular.forEach(self.rows, function(row) {
                if (defaultTo === undefined || row.to > defaultTo) {
                    defaultTo = row.to;
                }
            });
            return defaultTo;
        };

        self.updateColumns = function() {
            var from = $scope.fromDate;
            var to = $scope.toDate;
            if ($scope.taskOutOfRange === 'expand') {
                from = getExpandedFrom(from);
                to = getExpandedTo(to);
            }
            generateColumns(from, to);
            updateVisibleColumns();
        };

        // Removes all existing columns and re-generates them. E.g. after e.g. the view scale changed.
        // Rows can be re-generated only if there is a data-range specified. If the re-generation failed the function returns false.
        self.clearColumns = function() {
            self.from = undefined;
            self.to = undefined;
            self.columns = [];
            self.previousColumns = [];
            self.nextColumns = [];
        };

        // Update the position/size of all tasks in the Gantt
        self.updateTasksPosAndSize = function() {
            for (var i = 0, l = self.rows.length; i < l; i++) {
                self.rows[i].updateTasksPosAndSize();
            }
        };

        // Update the position/size of all timespans in the Gantt
        self.updateTimespansPosAndSize = function() {
            for (var i = 0, l = self.timespans.length; i < l; i++) {
                self.timespans[i].updatePosAndSize();
            }
        };

        // Returns the last Gantt column or undefined
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

        // Returns the first Gantt column or undefined
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
        self.getDateByPosition = function(x, magnet) {
            var column = self.getColumnByPosition(x);
            if (column !== undefined) {
                return column.getDateByPosition(x - column.left, magnet);
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

            self.updateColumns();
            self.updateTasksPosAndSize();
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
                    row.addTask(rowData.tasks[i]);
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

            self.updateColumns();
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
            self.clearColumns();
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
                timespan.updatePosAndSize();
            }
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

        self.setCurrentDate = function(currentDate) {
            self._currentDate = currentDate;
            angular.forEach(self.columns, function(column) {
                if (column.containsDate(currentDate)) {
                    column.currentDate = currentDate;
                } else {
                    delete column.currentDate;
                }
            });
        };
        self.setCurrentDate($scope.currentDateValue);

        self.buildGenerators();
        self.clearColumns();
        self.updateColumns();
    };

    return Gantt;
}]);
