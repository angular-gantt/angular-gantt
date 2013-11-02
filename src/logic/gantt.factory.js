gantt.factory('Gantt', ['Row', 'Column', 'dateFunctions', function (Row, Column, df) {
    var Gantt = function() {
        var self = this;

        self.columns = [];
        self.rowsMap = {};
        self.rows = [];
        self.highestRowOrder = 0;

        self.getFirstColumn = function() {
            return self.columns[0];
        };

        self.getColumn = function (date) {
            for (var i = 0; i < self.columns.length; i++) {
                var column = self.columns[i];
                if(column.fromDate <= date && column.toDate >= date) {
                    return column;
                }
            }
            //no column match found
            return null;
        };

        self.getLastColumn = function() {
            return self.columns[self.columns.length-1];
        };

        var addColumns = function (from, to) {
            var date = df.clone(from);
            while (date <= to) {
                for (var i = 0; i < 24; i++) {
                    var column = new Column(df.clone(date), df.addMilliseconds(df.addHours(date, 1, true), -1, false));
                    self.columns.push(column);

                    var old = date.getTime();
                    df.addHours(date, 1);

                    if (date.getTime() === old) {
                        // Issue with Chrome when there is the change to summer time. +1h will not change the time, do +2h.
                        df.addHours(date, 2);
                    }
                }
            }

            self.columns.sort(function (col1, col2) {
                return col1.fromDate > col2.fromDate ? 1 : -1;
            });
        };

        // Expands the range of columns according to the form - to date.
        // Its save to call this function twice with the same or an overlapping range.
        self.expandColumnRange = function (from, to) {
            if (self.columns.length === 0 || from < self.getFirstColumn().fromDate) {
                addColumns(df.setTimeZero(from, true), self.columns.length === 0 ? df.setTimeZero(to, true) : df.addMilliseconds(self.getFirstColumn().fromDate, -1, true));
            }

            if (to > self.getLastColumn().fromDate) {
                addColumns(df.addHours(self.getLastColumn().fromDate, 1, true), df.setTimeZero(to, true));
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
                    self.expandColumnRange(task.from, task.to);
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
            self.columns = [];
            self.rowsMap = {};
            self.rows = [];
            self.highestRowOrder = 0;
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