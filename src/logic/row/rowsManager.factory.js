'use strict';
gantt.factory('GanttRowsManager', ['GanttRow', '$filter', 'moment', 'GANTT_EVENTS', function(Row, $filter, moment, GANTT_EVENTS) {
    var RowsManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.rowsMap = {};
        this.rows = [];
        this.filteredRows = [];
        this.visibleRows = [];

        this.gantt.$scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

        this.gantt.$scope.$watch('filterTask+filterTaskComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

       this.gantt.$scope.$watch('filterRow+filterRowComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleRows();
            }
        });

        this.gantt.$scope.$watch('sortMode', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.sortRows();
            }
        });

        this.updateVisibleObjects();
    };

    RowsManager.prototype.addRow = function(rowData) {
        // Copy to new row (add) or merge with existing (update)
        var row, isUpdate = false;

        if (rowData.id in this.rowsMap) {
            row = this.rowsMap[rowData.id];
            row.copy(rowData);
            isUpdate = true;
            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
        } else {
            var order = rowData.order;

            // Check if the row has a order predefined. If not assign one
            if (order === undefined) {
                order = this.highestRowOrder;
            }

            if (order >= this.highestRowOrder) {
                this.highestRowOrder = order + 1;
            }

            row = new Row(rowData.id, this, rowData.name, order, rowData.height, rowData.color, rowData.classes, rowData.data);
            this.rowsMap[rowData.id] = row;
            this.rows.push(row);
            this.filteredRows.push(row);
            this.visibleRows.push(row);
            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_ADDED, {'row': row});
        }

        if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
            for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                row.addTask(rowData.tasks[i]);
            }
        }
        return isUpdate;
    };

    RowsManager.prototype.removeRow = function(rowId) {
        if (rowId in this.rowsMap) {
            delete this.rowsMap[rowId]; // Remove from map

            var removedRow;
            var row;
            for (var i = this.rows.length - 1; i >= 0; i--) {
                row = this.rows[i];
                if (row.id === rowId) {
                    removedRow = row;
                    this.rows.splice(i, 1); // Remove from array
                }
            }

            for (i = this.filteredRows.length - 1; i >= 0; i--) {
                row = this.filteredRows[i];
                if (row.id === rowId) {
                    this.filteredRows.splice(i, 1); // Remove from filtered array
                }
            }

            for (i = this.visibleRows.length - 1; i >= 0; i--) {
                row = this.visibleRows[i];
                if (row.id === rowId) {
                    this.visibleRows.splice(i, 1); // Remove from visible array
                }
            }

            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_REMOVED, {'row': removedRow});
            return row;
        }

        return undefined;
    };

    RowsManager.prototype.removeData = function(data) {
        for (var i = 0, l = data.length; i < l; i++) {
            var rowData = data[i];
            var row;

            if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                // Only delete the specified tasks but not the row and the other tasks

                if (rowData.id in this.rowsMap) {
                    row = this.rowsMap[rowData.id];

                    for (var j = 0, k = rowData.tasks.length; j < k; j++) {
                        row.removeTask(rowData.tasks[j].id);
                    }

                    this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
                }
            } else {
                // Delete the complete row
                row = this.removeRow(rowData.id);
            }
        }
        this.updateVisibleObjects();
    };

    RowsManager.prototype.removeAll = function() {
        this.rowsMap = {};
        this.rows = [];
        this.filteredRows = [];
        this.visibleRows = [];
    };

    RowsManager.prototype.sortRows = function() {
        var expression = this.gantt.$scope.sortMode;

        var reverse = false;
        if (expression.charAt(0) === '-') {
            reverse = true;
            expression = expression.substr(1);
        }

        var angularOrderBy = $filter('orderBy');
        if (expression === 'custom') {
            this.rows = angularOrderBy(this.rows, 'order', reverse);
        } else {
            this.rows = angularOrderBy(this.rows, expression, reverse);
        }

        this.updateVisibleRows();
    };

    // Swaps two rows and changes the sort order to custom to display the swapped rows
    RowsManager.prototype.swapRows = function(a, b) {
        // Swap the two rows
        var order = a.order;
        a.order = b.order;
        b.order = order;

        // Raise change events
        this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': a});
        this.gantt.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': a});
        this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': b});
        this.gantt.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': b});

        // Switch to custom sort mode and trigger sort
        if (this.gantt.$scope.sortMode !== 'custom') {
            this.gantt.$scope.sortMode = 'custom'; // Sort will be triggered by the watcher
        } else {
            this.sortRows();
        }
    };

    RowsManager.prototype.updateVisibleObjects = function() {
        this.updateVisibleRows();
        this.updateVisibleTasks();
    };

    RowsManager.prototype.updateVisibleRows = function() {
        var oldFilteredRows = this.filteredRows;
        if (this.gantt.$scope.filterRow) {
            this.filteredRows = $filter('filter')(this.rows, this.gantt.$scope.filterRow, this.gantt.$scope.filterRowComparator);
        } else {
            this.filteredRows = this.rows.slice(0);
        }

        var filterEventData;
        if (!angular.equals(oldFilteredRows, this.filteredRows)) {
            filterEventData = {rows: this.rows, filteredRows: this.filteredRows};
        }

        // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
        this.visibleRows = this.filteredRows;
        if (filterEventData !== undefined) {
            this.gantt.$scope.$emit(GANTT_EVENTS.ROWS_FILTERED, filterEventData);
        }
    };

    RowsManager.prototype.updateVisibleTasks = function() {
        var oldFilteredTasks = [];
        var filteredTasks = [];
        var tasks = [];

        angular.forEach(this.filteredRows, function(row) {
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
            this.gantt.$scope.$emit(GANTT_EVENTS.TASKS_FILTERED, filterEventData);
        }
    };

    // Update the position/size of all tasks in the Gantt
    RowsManager.prototype.updateTasksPosAndSize = function() {
        for (var i = 0, l = this.rows.length; i < l; i++) {
            this.rows[i].updateTasksPosAndSize();
        }
    };

    RowsManager.prototype.getExpandedFrom = function(from) {
        from = from ? moment(from) : from;

        var minRowFrom = from;
        angular.forEach(this.rows, function(row) {
            if (minRowFrom === undefined || minRowFrom > row.from) {
                minRowFrom = row.from;
            }
        });
        if (minRowFrom && (!from || minRowFrom < from)) {
            return minRowFrom;
        }
        return from;
    };

    RowsManager.prototype.getExpandedTo = function(to) {
        to = to ? moment(to) : to;

        var maxRowTo = to;
        angular.forEach(this.rows, function(row) {
            if (maxRowTo === undefined || maxRowTo < row.to) {
                maxRowTo = row.to;
            }
        });
        if (maxRowTo && (!this.gantt.$scope.toDate || maxRowTo > this.gantt.$scope.toDate)) {
            return maxRowTo;
        }
        return to;
    };

    RowsManager.prototype.getDefaultFrom = function() {
        var defaultFrom;
        angular.forEach(this.rows, function(row) {
            if (defaultFrom === undefined || row.from < defaultFrom) {
                defaultFrom = row.from;
            }
        });
        return defaultFrom;
    };

    RowsManager.prototype.getDefaultTo = function() {
        var defaultTo;
        angular.forEach(this.rows, function(row) {
            if (defaultTo === undefined || row.to > defaultTo) {
                defaultTo = row.to;
            }
        });
        return defaultTo;
    };

    return RowsManager;
}]);
