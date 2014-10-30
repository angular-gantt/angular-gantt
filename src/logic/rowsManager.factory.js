'use strict';
gantt.factory('GanttRowsManager', ['GanttRow', '$filter', 'moment', 'GANTT_EVENTS', function(Row, $filter, moment, GANTT_EVENTS) {
    var RowsManager = function(gantt) {
        var self = this;

        self.gantt = gantt;

        self.rowsMap = {};
        self.rows = [];
        self.filteredRows = [];
        self.visibleRows = [];

        self.gantt.$scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

        self.gantt.$scope.$watch('filterTask+filterTaskComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

       self.gantt.$scope.$watch('filterRow+filterRowComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleRows();
            }
        });

        self.addRow = function(rowData) {
            // Copy to new row (add) or merge with existing (update)
            var row, isUpdate = false;

            if (rowData.id in self.rowsMap) {
                row = self.rowsMap[rowData.id];
                row.copy(rowData);
                isUpdate = true;
                self.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
            } else {
                var order = rowData.order;

                // Check if the row has a order predefined. If not assign one
                if (order === undefined) {
                    order = self.highestRowOrder;
                }

                if (order >= self.highestRowOrder) {
                    self.highestRowOrder = order + 1;
                }

                row = new Row(rowData.id, self, rowData.name, order, rowData.height, rowData.color, rowData.classes, rowData.data);
                self.rowsMap[rowData.id] = row;
                self.rows.push(row);
                self.filteredRows.push(row);
                self.visibleRows.push(row);
                self.gantt.$scope.$emit(GANTT_EVENTS.ROW_ADDED, {'row': row});
            }

            if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                    row.addTask(rowData.tasks[i]);
                }
            }
            return isUpdate;
        };

        self.removeRow = function(rowId) {
            if (rowId in self.rowsMap) {
                delete self.rowsMap[rowId]; // Remove from map

                var removedRow;
                var row;
                for (var i = self.rows.length - 1; i >= 0; i--) {
                    row = self.rows[i];
                    if (row.id === rowId) {
                        removedRow = row;
                        self.rows.splice(i, 1); // Remove from array
                    }
                }

                for (i = self.filteredRows.length - 1; i >= 0; i--) {
                    row = self.filteredRows[i];
                    if (row.id === rowId) {
                        self.filteredRows.splice(i, 1); // Remove from filtered array
                    }
                }

                for (i = self.visibleRows.length - 1; i >= 0; i--) {
                    row = self.visibleRows[i];
                    if (row.id === rowId) {
                        self.visibleRows.splice(i, 1); // Remove from visible array
                    }
                }

                self.gantt.$scope.$emit(GANTT_EVENTS.ROW_REMOVED, {'row': removedRow});
                return row;
            }

            return undefined;
        };

        self.removeData = function(data) {
            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];
                var row;

                if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                    // Only delete the specified tasks but not the row and the other tasks

                    if (rowData.id in self.rowsMap) {
                        row = self.rowsMap[rowData.id];

                        for (var j = 0, k = rowData.tasks.length; j < k; j++) {
                            row.removeTask(rowData.tasks[j].id);
                        }

                        self.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
                    }
                } else {
                    // Delete the complete row
                    row = self.removeRow(rowData.id);
                }
            }
            self.updateVisibleObjects();
        };

        self.removeAll = function() {
            self.rowsMap = {};
            self.rows = [];
            self.filteredRows = [];
            self.visibleRows = [];
        };

        self.sortRows = function(expression) {
            var reverse = false;
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

            self.updateVisibleRows();
        };

        self.updateVisibleObjects = function() {
            self.updateVisibleRows();
            self.updateVisibleTasks();
        };

        self.updateVisibleRows = function() {
            var oldFilteredRows = self.filteredRows;
            if (self.gantt.$scope.filterRow) {
                self.filteredRows = $filter('filter')(self.rows, self.gantt.$scope.filterRow, self.gantt.$scope.filterRowComparator);
            } else {
                self.filteredRows = self.rows.slice(0);
            }

            var filterEventData;
            if (!angular.equals(oldFilteredRows, self.filteredRows)) {
                filterEventData = {rows: self.rows, filteredRows: self.filteredRows};
            }

            // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
            self.visibleRows = self.filteredRows;
            if (filterEventData !== undefined) {
                self.gantt.$scope.$emit(GANTT_EVENTS.ROWS_FILTERED, filterEventData);
            }
        };

        self.updateVisibleTasks = function() {
            var oldFilteredTasks = [];
            var filteredTasks = [];
            var tasks = [];

            angular.forEach(self.filteredRows, function(row) {
                oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
                row.updateVisibleTasks();
                filteredTasks = filteredTasks.concat(row.filteredTasks);
                tasks = tasks.concat(row.tasks);
            });

            var filterEventData;
            if (!angular.equals(oldFilteredTasks, filteredTasks)) {
                filterEventData = {tasks: tasks, filteredTasks: filteredTasks};
            }

            if (filterEventData !== undefined) {
                self.gantt.$scope.$emit(GANTT_EVENTS.TASKS_FILTERED, filterEventData);
            }
        };

        // Update the position/size of all tasks in the Gantt
        self.updateTasksPosAndSize = function() {
            for (var i = 0, l = self.rows.length; i < l; i++) {
                self.rows[i].updateTasksPosAndSize();
            }
        };

        self.getExpandedFrom = function(from) {
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

        self.getExpandedTo = function(to) {
            to = to ? moment(to) : to;

            var maxRowTo = to;
            angular.forEach(self.rows, function(row) {
                if (maxRowTo === undefined || maxRowTo < row.to) {
                    maxRowTo = row.to;
                }
            });
            if (maxRowTo && (!self.gantt.$scope.toDate || maxRowTo > self.gantt.$scope.toDate)) {
                return maxRowTo;
            }
            return to;
        };

        self.getDefaultFrom = function() {
            var defaultFrom;
            angular.forEach(self.rows, function(row) {
                if (defaultFrom === undefined || row.from < defaultFrom) {
                    defaultFrom = row.from;
                }
            });
            return defaultFrom;
        };

        self.getDefaultTo = function() {
            var defaultTo;
            angular.forEach(self.rows, function(row) {
                if (defaultTo === undefined || row.to > defaultTo) {
                    defaultTo = row.to;
                }
            });
            return defaultTo;
        };

        self.updateVisibleObjects();
    };
    return RowsManager;
}]);
