gantt.factory('Gantt', ['Row', 'ColumnGenerator', 'HeaderGenerator', 'TaskPlacementStrategy', 'dateFunctions', function (Row, ColumnGenerator, HeaderGenerator, TaskPlacement, df) {

    // Gantt logic. Manages the columns, rows and sorting functionality.
    var Gantt = function(viewScale, viewScaleFactor, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours) {
        var self = this;

        self.rowsMap = {};
        self.rows = [];
        self.columns = [];
        self.headers = {};
        self.width = 0;
        var defaultColumnRange;

        // Sets the Gantt view scale. Call reGenerateColumns to make changes visible after changing the view scale.
        // The headers are shown depending on the defined view scale.
        self.setViewScale = function(viewScale, viewScaleFactor, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours) {
            switch(viewScale) {
                case 'hour': self.columnGenerator = new ColumnGenerator.HourGenerator(viewScaleFactor, weekendDays, showWeekends, workHours, showNonWorkHours); break;
                case 'day': self.columnGenerator = new ColumnGenerator.DayGenerator(viewScaleFactor, weekendDays, showWeekends); break;
                case 'week': self.columnGenerator = new ColumnGenerator.WeekGenerator(viewScaleFactor, firstDayOfWeek); break; // TODO day of week must be dynamic
                case 'month': self.columnGenerator = new ColumnGenerator.MonthGenerator(viewScaleFactor); break;
                default:
                    throw "Unsupported view scale: " + viewScale;
            }

            self.headerGenerator = new HeaderGenerator.instance(viewScale);
            self.taskPlacement = new TaskPlacement.instance(viewScale, 4);
        };

        self.setViewScale(viewScale, viewScaleFactor, firstDayOfWeek, weekendDays, showWeekends, workHours, showNonWorkHours);

        // Sets the default column range. Even if there tasks are smaller the default range is shown.
        self.setDefaultColumnDateRange = function(from, to) {
            if (from !== undefined && to !== undefined) {
                defaultColumnRange = {};
                defaultColumnRange.from = df.clone(from);
                defaultColumnRange.to = df.clone(to);

                self.expandColumns(defaultColumnRange.from, defaultColumnRange.to);
            } else {
                defaultColumnRange = undefined;
            }
        };

        // Generates the Gantt columns according to the specified from - to date range. Uses the currently assigned column generator.
        self.expandColumns = function(from, to) {
            if (from === undefined || to === undefined) {
                throw "From and to date range cannot be undefined";
            }

            // Only expand if expand is necessary
            if (self.columns.length === 0) {
                expandColumnsNoCheck(from, to);
            } else if (self.getFirstColumn().date > from || self.getLastColumn().date < to) {
                var minFrom = self.getFirstColumn().date > from ? from: self.getFirstColumn().date;
                var maxTo = self.getLastColumn().date < to ? to: self.getLastColumn().date;

                expandColumnsNoCheck(minFrom, maxTo);
            }
        };

        var expandColumnsNoCheck = function(from ,to) {
            self.columns = self.columnGenerator.generate(from, to);
            self.headers = self.headerGenerator.generate(self.columns);
            self.updateTaskPlacement();

            var lastColumn = self.getLastColumn();
            self.width = lastColumn !== null ? lastColumn.left + lastColumn.width: 0;
        };

        // Removes all existing columns and re-generates them. E.g. after e.g. the view scale changed.
        self.reGenerateColumns = function() {
            self.columns = [];

            var taskRange = self.getTasksDateRange();
            if (taskRange !== undefined && defaultColumnRange === undefined) {
                self.expandColumns(taskRange.from, taskRange.to);
            } else if (taskRange === undefined && defaultColumnRange !== undefined) {
                self.expandColumns(defaultColumnRange.from, defaultColumnRange.to);
            } else if (taskRange !== undefined && defaultColumnRange !== undefined) {
                var from = defaultColumnRange.from < taskRange.from ? defaultColumnRange.from: taskRange.from;
                var to = defaultColumnRange.to > taskRange.to ? defaultColumnRange.to: taskRange.to;
                self.expandColumns(from, to);
            }
        };

        // Update the position/size of all tasks in the Gantt
        self.updateTaskPlacement = function() {
            for (var i = 0, l = self.rows.length; i < l; i++) {
                for (var j = 0, k = self.rows[i].tasks.length; j < k; j++) {
                    var task = self.rows[i].tasks[j];
                    self.taskPlacement.placeTask(task, self.columns);
                }
            }
        };

        // Returns the first Gantt column or null
        self.getLastColumn = function() {
            if (self.columns.length > 0) {
                return self.columns[self.columns.length-1];
            } else {
                return null;
            }
        };

        // Returns the last Gantt column or null
        self.getFirstColumn = function() {
            if (self.columns.length > 0) {
                return self.columns[0];
            } else {
                return null;
            }
        };

        // Returns the default Gantt column date range or undefined if it has not been defined
        self.getDefaultColumnDateRange = function() {
            if (defaultColumnRange === undefined) {
                return undefined;
            } else {
                return {
                    from: df.clone(defaultColumnRange.from),
                    to: df.clone(defaultColumnRange.to)
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

        // Adds a row to the list of rows. Merges the row and it tasks if there is already one with the same id
        self.addRow = function(rowData) {
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

                row = new Row(rowData.id, rowData.description, order, rowData.data);
                self.rowsMap[rowData.id] = row;
                self.rows.push(row);
            }

            if (rowData.tasks !== undefined) {
                for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                    var task = row.addTask(rowData.tasks[i]);
                    self.expandColumns(task.from, task.to);
                }
            }

            return isUpdate;
        };

        // Removes the complete row including all tasks
        self.removeRow = function(rowId) {
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
        };

        // Removes all rows and tasks
        self.removeRows = function() {
            self.rowsMap = {};
            self.rows = [];
            self.highestRowOrder = 0;
            self.columns = [];
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

        // Sort helper to sort by description name
        var sortByName = function (a, b) {
            if (a.description === b.description) {
                return 0;
            } else {
                return (a.description < b.description) ? -1 : 1;
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
        self.sortRows = function (mode) {
            switch (mode) {
                case "name":
                    self.rows.sort(sortByName);
                    break;
                case "custom":
                    self.rows.sort(sortByCustom);
                    break;
                default:
                    self.rows.sort(sortByDate);
                    break;
            }
        };
    };

    return Gantt;
}]);