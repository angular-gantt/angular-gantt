(function(){
    'use strict';
    angular.module('gantt').factory('GanttRowsManager', ['GanttRow', 'ganttArrays', '$filter', 'moment', function(Row, arrays, $filter, moment) {
        var RowsManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.rowsMap = {};
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.visibleRows = [];
            this.rowsTaskWatchers = [];

            this.gantt.$scope.$watchGroup(['filterTask', 'filterTaskComparator'], function(oldValues, newValues) {
                if (oldValues !== newValues) {
                    self.updateVisibleTasks();
                }
            });

            this.gantt.$scope.$watchGroup(['filterRow', 'filterRowComparator'], function(oldValues, newValues) {
                if (oldValues !== newValues) {
                    self.updateVisibleRows();
                }
            });

            this.gantt.$scope.$watch('sortMode', function(oldValues, newValues) {
                if (oldValues !== newValues) {
                    self.sortRows();
                }
            });

            this.gantt.api.registerMethod('rows', 'sort', RowsManager.prototype.sortRows, this);
            this.gantt.api.registerMethod('rows', 'applySort', RowsManager.prototype.applySort, this);
            this.gantt.api.registerMethod('rows', 'refresh', RowsManager.prototype.updateVisibleObjects, this);

            this.gantt.api.registerEvent('tasks', 'add');
            this.gantt.api.registerEvent('tasks', 'change');
            this.gantt.api.registerEvent('tasks', 'rowChange');
            this.gantt.api.registerEvent('tasks', 'remove');
            this.gantt.api.registerEvent('tasks', 'filter');

            this.gantt.api.registerEvent('rows', 'add');
            this.gantt.api.registerEvent('rows', 'change');
            this.gantt.api.registerEvent('rows', 'remove');
            this.gantt.api.registerEvent('rows', 'move');

            this.gantt.api.registerEvent('rows', 'filter');

            this.updateVisibleObjects();
        };

        RowsManager.prototype.addRow = function(rowModel) {
            // Copy to new row (add) or merge with existing (update)
            var row, i, l, isUpdate = false;

            this.gantt.objectModel.cleanRow(rowModel);

            if (rowModel.id in this.rowsMap) {
                row = this.rowsMap[rowModel.id];
                if (row.model === rowModel) {
                    return;
                }

                var toRemoveIds = arrays.getRemovedIds(rowModel.tasks, row.model.tasks);
                for (i= 0, l=toRemoveIds.length; i<l; i++) {
                    var toRemoveId = toRemoveIds[i];
                    row.removeTask(toRemoveId);
                }

                row.model = rowModel;
                isUpdate = true;
            } else {
                row = new Row(this, rowModel);
                this.rowsMap[rowModel.id] = row;
                this.rows.push(row);
                this.sortedRows.push(row);
                this.filteredRows.push(row);
                this.visibleRows.push(row);

                if (this.gantt.$scope.data.indexOf(rowModel) === -1) {
                    this.gantt.$scope.data.push(rowModel);
                }

            }

            if (rowModel.tasks !== undefined && rowModel.tasks.length > 0) {
                for (i = 0, l = rowModel.tasks.length; i < l; i++) {
                    var taskModel = rowModel.tasks[i];
                    row.addTask(taskModel);
                }
            }

            if (isUpdate) {
                this.gantt.api.rows.raise.change(row);
            } else {
                this.gantt.api.rows.raise.add(row);
            }

            if (!isUpdate) {
                var watcher = this.gantt.$scope.$watchCollection(function() {return rowModel.tasks;}, function(newTasks, oldTasks) {
                    if (newTasks !== oldTasks) {
                        var i, l;

                        var toRemoveIds = arrays.getRemovedIds(newTasks, oldTasks);
                        for (i= 0, l = toRemoveIds.length; i<l; i++) {
                            var toRemove = toRemoveIds[i];
                            row.removeTask(toRemove);
                        }

                        if (newTasks !== undefined) {
                            for (i= 0, l = newTasks.length; i<l; i++) {
                                var toAdd = newTasks[i];
                                row.addTask(toAdd);
                            }
                        }
                    }
                });

                this.rowsTaskWatchers.push(watcher);
            }

            return isUpdate;
        };

        RowsManager.prototype.removeRow = function(rowId) {
            if (rowId in this.rowsMap) {
                delete this.rowsMap[rowId]; // Remove from map

                var removedRow;
                var row;

                var indexOf = arrays.indexOfId(this.rows, rowId, ['model', 'id']);
                if (indexOf > -1) {
                    removedRow = this.rows.splice(indexOf, 1)[0]; // Remove from array
                    var deregisterFunction = this.rowsTaskWatchers.splice(indexOf, 1)[0]; // Remove watcher
                    deregisterFunction();
                }

                arrays.removeId(this.sortedRows, rowId, ['model', 'id']);
                arrays.removeId(this.filteredRows, rowId, ['model', 'id']);
                arrays.removeId(this.visibleRows, rowId, ['model', 'id']);
                arrays.remove(this.gantt.$scope.data, removedRow.model);

                this.gantt.api.rows.raise.remove(removedRow);
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

                        this.gantt.api.rows.raise.change(row);
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
            this.sortedRows = [];
            this.filteredRows = [];
            this.visibleRows = [];
            var data = this.gantt.$scope.data;
            while(data > 0) {
                data.pop();
            }
            for (var i= 0, l=this.rowsTaskWatchers.length; i<l; i++) {
                var deregisterFunction = this.rowsTaskWatchers[i];
                deregisterFunction();
            }
            this.rowsTaskWatchers = [];
        };

        RowsManager.prototype.sortRows = function() {
            var expression = this.gantt.$scope.sortMode;

            if (expression !== undefined) {
                var reverse = false;
                if (expression.charAt(0) === '-') {
                    reverse = true;
                    expression = expression.substr(1);
                }

                var angularOrderBy = $filter('orderBy');
                this.sortedRows = angularOrderBy(this.rows, expression, reverse);
            } else {
                this.sortedRows = this.rows.slice();
            }

            this.updateVisibleRows();
        };

        /**
         * Applies current view sort to data model.
         */
        RowsManager.prototype.applySort = function() {
            var data = this.gantt.$scope.data;
            while(data > 0) {
                data.pop();
            }
            var rows = [];
            for (var i = 0, l = this.sortedRows.length; i < l; i++) {
                data.push(this.sortedRows[i].model);
                rows.push(this.sortedRows[i]);
            }

            this.rows = rows;
        };

        RowsManager.prototype.moveRow = function(row, targetRow) {
            if (this.gantt.$scope.sortMode !== undefined) {
                // Apply current sort to model
                this.applySort();

                this.gantt.$scope.sortMode = undefined;
            }

            var targetRowIndex = this.rows.indexOf(targetRow);
            var rowIndex = this.rows.indexOf(row);

            if (targetRowIndex > -1 && rowIndex > -1 && targetRowIndex !== rowIndex) {
                arrays.moveToIndex(this.rows, rowIndex, targetRowIndex);
                arrays.moveToIndex(this.rowsTaskWatchers, rowIndex, targetRowIndex);
                arrays.moveToIndex(this.gantt.$scope.data, rowIndex, targetRowIndex);

                this.gantt.api.rows.raise.change(row);
                this.gantt.api.rows.raise.move(row, rowIndex, targetRowIndex);

                this.updateVisibleObjects();
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
                var filterRow = this.gantt.$scope.filterRow;
                if (typeof(filterRow) === 'object') {
                    filterRow = {model: filterRow};
                }

                var filterRowComparator = this.gantt.$scope.filterRowComparator;
                if (typeof(filterRowComparator) === 'function') {
                    filterRowComparator = function(actual, expected) {
                        return this.gantt.$scope.filterRowComparator(actual.model, expected.model);
                    };
                }

                this.filteredRows = $filter('filter')(this.sortedRows, filterRow, filterRowComparator);
            } else {
                this.filteredRows = this.sortedRows.slice(0);
            }


            var raiseEvent = !angular.equals(oldFilteredRows, this.filteredRows);

            // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
            this.visibleRows = this.filteredRows;
            if (raiseEvent) {
                this.gantt.api.rows.raise.filter(this.sortedRows, this.filteredRows);
            }
        };

        RowsManager.prototype.updateVisibleTasks = function() {
            var oldFilteredTasks = [];
            var filteredTasks = [];
            var tasks = [];

            angular.forEach(this.rows, function(row) {
                oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
                row.updateVisibleTasks();
                filteredTasks = filteredTasks.concat(row.filteredTasks);
                tasks = tasks.concat(row.tasks);
            });

            var filterEvent = !angular.equals(oldFilteredTasks, filteredTasks);

            if (filterEvent) {
                this.gantt.api.tasks.raise.filter(tasks, filteredTasks);
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
}());
