gantt.factory('Gantt', ['Row', 'Column', 'dateFunctions', function (Row, Column, df) {
    // Gantt logic. Manages the columns, rows and sorting functionality.

    var Gantt = function(weekendDays, showWeekends, workHours, showNonWorkHours) {
        var self = this;

        self.rowsMap = {};
        self.rows = [];
        self.highestRowOrder = 0;
        self.weekendDays = weekendDays;
        self.showWeekends = showWeekends;
        self.workHours = workHours;
        self.showNonWorkHours = showNonWorkHours;

        var EmptyColumns = function() {
            var self = this;

            self.months = [];
            self.weeks = [];
            self.days = [];
            self.hours = [];
            self.getLast = function() {
                if (self.hours.length > 0) {
                    return self.hours[self.hours.length-1];
                } else {
                    return null;
                }
            };
            self.getFirst = function() {
                if (self.hours.length > 0) {
                    return self.hours[0];
                } else {
                    return null;
                }
            };
            // Prepends columns to existing columns
            self.prepend = function(columns) {
                // Remove overlapping week or month column
                if (self.weeks[0].week === columns.weeks[columns.weeks.length-1].week) {
                    columns.weeks.splice(columns.weeks.length-1, 1);
                }
                if (self.months[0].date.getMonth() === columns.months[columns.months.length-1].date.getMonth()) {
                    columns.months.splice(columns.months.length-1, 1);
                }

                self.hours.unshift.apply(self.hours, columns.hours);
                self.days.unshift.apply(self.days, columns.days);
                self.weeks.unshift.apply(self.weeks, columns.weeks);
                self.months.unshift.apply(self.months, columns.months);
            };
        };

        self.columns = new EmptyColumns();

        // Adds new a header columns specified by a from, to range.
        // Only new, non existing columns for a specific date will be added.
        self.expandColumns = function(from, to) {
            var first = self.columns.getFirst();
            var last = self.columns.getLast();

            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            if (self.columns.hours.length === 0) {
                generateColumns(from, to);
            } else {
                if (from < first.date) {
                    generateColumns(from, df.addDays(df.setTimeZero(first.date, true), -1));
                } else if (to > last.date) {
                    generateColumns(df.addDays(df.setTimeZero(last.date, true), 1), to);
                }
            }
        };

        // Generates the header column according to the specified from and to date.
        // Attention:
        // This function shall not be called if the dates between from - do already exist.
        // Use expandColumns to quickly add a range;
        var generateColumns = function(from, to) {
            var date = df.clone(from);
            var columns;

            if (self.columns.hours.length === 0 || from > self.columns.getFirst().date) {
                columns = self.columns; // Append. New columns are after existing
            } else {
                columns = new EmptyColumns(); // Prepend columns.
            }

            while(to - date >= 0) {
                var isWeekend = self.isWeekend(date.getDay());
                var hourAdded = false;
                for (var i = 0; i<24; i++) {
                    var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i, 0, 0);
                    var isWorkHour = self.isWorkHour(i);

                    if ((isWeekend && self.showWeekends || !isWeekend) && (!isWorkHour && self.showNonWorkHours || isWorkHour)) {
                        columns.hours.push(new Column.Hour(cDate, isWeekend, isWorkHour));
                        hourAdded = true;
                    }
                }

                if (hourAdded) {
                    // Add day to days column if it wasn't already
                    var days = columns.days;
                    if (days.length === 0 || days[days.length-1].date.getDate() !== date.getDate()) {
                        days.push(new Column.Day(new Date(date.getFullYear(), date.getMonth(), date.getDate(),0,0,0), isWeekend));
                    }

                    // Add week to weeks column if it wasn't already
                    var weeks = columns.weeks;
                    var currentWeek = df.getWeek(date);
                    if (weeks.length === 0 || weeks[weeks.length-1].week !== currentWeek) {
                        weeks.push(new Column.Week(new Date(date.getFullYear(), date.getMonth(), date.getDate(),0,0,0), currentWeek));
                    }

                    // Add month to months column if it wasn't already
                    var months = columns.months;
                    if (months.length === 0 || months[months.length-1].date.getMonth() !== date.getMonth()) {
                        months.push(new Column.Month(new Date(date.getFullYear(), date.getMonth(), date.getDate(),0,0,0)));
                    }
                }

                date = df.addDays(date, 1);
            }

            if (self.columns != columns) {
                self.columns.prepend(columns);
            }
        };

        // Removes all existing columns and re-generates them
        self.reGenerateColumns = function() {
            var from = self.columns.getFirst().date;
            var to = self.columns.getLast().date;

            self.columns = new EmptyColumns();
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

        // Returns true if the given day is a weekend day
        self.isWeekend = function(day) {
            for (var i = 0, l = self.weekendDays.length; i < l; i++) {
                if (self.weekendDays[i] === day) {
                    return true;
                }
            }

            return false;
        };

        // Returns true if the given hour is a work hour
        self.isWorkHour = function(hour) {
            for (var i = 0, l = self.workHours.length; i < l; i++) {
                if (self.workHours[i] === hour) {
                    return true;
                }
            }

            return false;
        };
    };

    return Gantt;
}]);