gantt.factory('Gantt', ['Row', 'ColumnGenerator', 'dateFunctions', function (Row, ColumnGenerator, df) {

    // Gantt logic. Manages the columns, rows and sorting functionality.
    var Gantt = function(viewScale, weekendDays, showWeekends, workHours, showNonWorkHours) {
        var self = this;

        self.rowsMap = {};
        self.rows = [];
        self.columns = [];
        self.highestRowOrder = 0;
        self.weekendDays = weekendDays;
        self.showWeekends = showWeekends;
        self.workHours = workHours;
        self.showNonWorkHours = showNonWorkHours;

        // TODO:
        // Calculate columns (most detailed level which is visible in Gantt, e.g. days)
        // Make lowest header level same as gantt columns
        // Calculate all other header based on the columns

        self.setViewScale = function(viewScale) {
            switch(viewScale) {
                case "hour": self.columnGenerator = new ColumnGenerator.HourGenerator(workHours, showNonWorkHours, weekendDays, showWeekends); break;
                case "day": self.columnGenerator = new ColumnGenerator.DayGenerator(weekendDays, showWeekends); break;
                case "week": self.columnGenerator = new ColumnGenerator.WeekGenerator(1); break; // TODO day of week must be dynamic
                case "month": self.columnGenerator = new ColumnGenerator.MonthGenerator(); break;
                default:
                    throw "Unsupported view scale: " + viewScale;
            }
        };

        self.setViewScale(viewScale);

        // Generates the Gantt columns according to the specified from - to date range. Uses the currently assigned column generator.
        self.expandColumns = function(from, to) {
            if (from === undefined || to === undefined) {
                throw "From and to date range cannot be undefined"
            }

            // Only expand if expand is necessary
            if (self.columns.length === 0) {
                self.columns = self.columnGenerator.generate(from, to);
            } else if (self.getFirstColumn().date > from || self.getLastColumn().date < to) {
                var minFrom = self.getFirstColumn().date > from ? from: self.getFirstColumn().date;
                var maxTo = self.getLastColumn().date < to ? to: self.getLastColumn().date;

                self.columns = self.columnGenerator.generate(minFrom, maxTo);
            }
        };

        self.getLastColumn = function() {
            if (self.columns.length > 0) {
                return self.columns[self.columns.length-1];
            } else {
                return null;
            }
        };

        self.getFirstColumn = function() {
            if (self.columns.length > 0) {
                return self.columns[0];
            } else {
                return null;
            }
        };

        // Removes all existing columns and re-generates them
        self.reGenerateColumns = function() {
            var from = self.getFirstColumn().date;
            var to = self.getLastColumn().date;

            self.columns = [];
            if (from !== undefined && to !== undefined) {
                self.expandColumns(from, to);
            }
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
            self.columns = new EmptyColumns();
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