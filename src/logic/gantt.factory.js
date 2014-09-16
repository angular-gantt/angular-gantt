gantt.factory('Gantt', ['Row', 'ColumnGenerator', 'HeaderGenerator', 'dateFunctions', 'binarySearch', function (Row, ColumnGenerator, HeaderGenerator, df, bs) {

    // Gantt logic. Manages the columns, rows and sorting functionality.
    var Gantt = function(viewScale, autoExpand, taskOutOfRange, width, columnWidth, columnSubScale, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours) {
        var self = this;

        self.rowsMap = {};
        self.rows = [];
        self.columns = [];
        self.headers = {};
        self.previousColumns = [];
        self.nextColumns = [];
        self.width = 0;
        self.autoExpand = autoExpand;
        self.taskOutOfRange = taskOutOfRange;
        var dateRange;

        // Sets the Gantt view scale. Call reGenerateColumns to make changes visible after changing the view scale.
        // The headers are shown depending on the defined view scale.
        self.setViewScale = function(viewScale, autoExpand, taskOutOfRange, width, columnWidth, columnSubScale, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours) {
            self.autoExpand = autoExpand;
            self.taskOutOfRange = taskOutOfRange;

            switch(viewScale) {
                case 'hour': self.columnGenerator = new ColumnGenerator.HourGenerator(width, columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours); break;
                case 'day': self.columnGenerator = new ColumnGenerator.DayGenerator(width, columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours); break;
                case 'week': self.columnGenerator = new ColumnGenerator.WeekGenerator(width, columnWidth, columnSubScale, firstDayOfWeek); break;
                case 'month': self.columnGenerator = new ColumnGenerator.MonthGenerator(width, columnWidth, columnSubScale); break;
                default:
                    throw "Unsupported view scale: " + viewScale;
            }

            self.headerGenerator = new HeaderGenerator.instance(viewScale);
        };

        self.setViewScale(viewScale, self.autoExpand, self.taskOutOfRange, width, columnWidth, columnSubScale, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours);

        self.setDefaultDateRange = function(from, to) {
            if (from !== undefined && to !== undefined) {
              setDateRange(from, to);
              expandColumnsNoCheck(dateRange.from, dateRange.to);
            }
        };

        var setDateRange = function(from, to) {
            from = df.clone(from);
            to = df.clone(to);

            if (dateRange === undefined) {
                dateRange = {};
                dateRange.from = from;
                dateRange.to = to;
            } else {
                dateRange.from = from;
                dateRange.to = to;
            }
        };

        // Expands the default date range. Even if there tasks are smaller the specified date range is shown.
        self.expandDefaultDateRange = function(from, to) {
            if (from !== undefined && to !== undefined) {
                expandDateRange(from, to);
                expandColumns();
            }
        };

        var expandDateRange = function(from, to) {
            from = from ? df.clone(from) : from;
            to = to ? df.clone(to) : to;

            if (dateRange === undefined && from && to) {
                dateRange = {};
                dateRange.from = from;
                dateRange.to = to;
            } else if (dateRange !== undefined) {
                if (from && from < dateRange.from) {
                    dateRange.from = from;
                }

                if (to && to > dateRange.to) {
                    dateRange.to = to;
                }
            }
        };

        // Generates the Gantt columns according to the current dateRange. The columns are generated if necessary only.
        var expandColumns = function() {
            if (dateRange === undefined) {
                throw "From and to date range cannot be undefined";
            }

            // Only expand if expand is necessary
            if (self.columns.length === 0) {
                expandColumnsNoCheck(dateRange.from, dateRange.to);
            } else if (self.columnGenerator.columnExpandNecessary(self.getFirstColumn().date, self.getLastColumn().date, dateRange.from, dateRange.to)) {
                var minFrom = self.getFirstColumn().date > dateRange.from ? dateRange.from: self.getFirstColumn().date;
                var maxTo = self.getLastColumn().date < dateRange.to ? dateRange.to: self.getLastColumn().date;

                expandColumnsNoCheck(minFrom, maxTo);
            }
        };

        // Generates the Gantt columns according to the specified from - to date range. Uses the currently assigned column generator.
        var expandColumnsNoCheck = function(from ,to) {
            self.columns = self.columnGenerator.generate(from, to);
            self.headers = self.headerGenerator.generate(self.columns);
            self.previousColumns = [];
            self.nextColumns = [];

            var lastColumn = self.getLastColumn();
            self.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width: 0;

            self.updateTasksPosAndSize();
        };

        var expandExtendedColumnsForPosition = function(x) {
            if (x < 0) {
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
                    self.nextColumns = self.columnGenerator.generate(endDate, null, x-self.width, self.width, false);
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

            if (from && date < from) {
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

        // Returns the first Gantt column or undefined
        self.getLastColumn = function(extended) {
            var columns = self.columns;
            if (extended) {
                columns = self.nextColumns;
            }
            if (columns && columns.length > 0) {
                return columns[columns.length-1];
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
            var columns = bs.get(extendedColumns, date, function(c) { return c.date; });
            return columns[0] !== undefined? columns[0]: columns[1];
        };

        // Returns the column at the given position x (in em)
        self.getColumnByPosition = function(x) {
            expandExtendedColumnsForPosition(x);
            var extendedColumns = self.previousColumns.concat(self.columns, self.nextColumns);
            return bs.get(extendedColumns, x, function(c) { return c.left; })[0];
        };

        // Returns the exact column date at the given position x (in em)
        self.getDateByPosition = function(x, snapForward) {
            var column = self.getColumnByPosition(x);
            if (column !== undefined) {
                if(snapForward !== undefined) return column.getDateByPosition(x - column.left, snapForward);
                else return column.getDateByPosition(x - column.left);
            } else {
                return undefined;
            }
        };

        // Returns the position inside the Gantt calculated by the given date
        self.getPositionByDate = function(date) {
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
                    from: df.clone(dateRange.from),
                    to: df.clone(dateRange.to)
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

                    if (minDate === undefined || row.minFromDate < minDate) {
                        minDate = row.minFromDate;
                    }

                    if (maxDate === undefined || row.maxToDate > maxDate) {
                        maxDate = row.maxToDate;
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
                if (self.headers.hasOwnProperty(key)) size++;
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

            if (dateRange !== undefined) {
                expandColumns();
            }
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

                row = new Row(rowData.id, self, rowData.description, order, rowData.data);
                self.rowsMap[rowData.id] = row;
                self.rows.push(row);
            }

            if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                    var task = row.addTask(rowData.tasks[i]);

                    if (self.taskOutOfRange === 'expand') {
                        expandDateRange(task.from, task.to);
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
            dateRange = undefined;
        };

        // Swaps two rows and changes the sort order to custom to display the swapped rows
        self.swapRows = function (a, b) {
            // Swap the two rows
            var order = a.order;
            a.order = b.order;
            b.order = order;
        };

        // Sort helper to sort by the date of the task with the earliest from date.
        // Rows with no min date will be sorted by name
        var sortByDate = function (a, b) {
            if (a.minFromDate === undefined && b.minFromDate === undefined) {
                return sortByName(a, b);
            } else if (a.minFromDate === undefined) {
                return 1;
            } else if (b.minFromDate === undefined) {
                return -1;
            } else {
                return a.minFromDate - b.minFromDate;
            }
        };

        // Sort helper to sort by description name (switch to localeCompare() in the future?)
        var sortByName = function (a, b) {
            if (a.description.toLowerCase() === b.description.toLowerCase()) {
                return 0;
            } else {
                return (a.description.toLowerCase() < b.description.toLowerCase()) ? -1 : 1;
            }
        };

        // Sort helper to sort by order.
        // If a row has no order move it at the end. If both rows have no order they will be sorted by name.
        var sortByCustom = function (a, b) {
            if (a.order === undefined && b.order === undefined) {
                return sortByName(a, b);
            } else if (a.order === undefined) {
                return 1;
            } else if (b.order === undefined) {
                return -1;
            } else {
                return a.order - b.order;
            }
        };

        // Sort rows by the specified sort mode (name, order, custom)
        // and by Ascending or Descending
        self.sortRows = function (mode) {
            switch (mode) {
                case "name":
                    self.rows.sort(sortByName);
                    break;
                case "-name":
                    self.rows.reverse(sortByName);
                    break;
                case "date":
                    self.rows.sort(sortByDate);
                    break;
                case "-date":
                    self.rows.reverse(sortByDate);
                    break;
                case "custom":
                    self.rows.sort(sortByCustom);
                    break;
                case "-custom":
                    self.rows.reverse(sortByCustom);
                    break;
                default:
                    self.rows.sort(sortByDate);
                    break;
            }
        };
    };

    return Gantt;
}]);