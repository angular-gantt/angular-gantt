(function(){
    'use strict';
    angular.module('gantt').factory('GanttRowsManager', ['GanttRow', 'ganttArrays', '$filter', '$timeout', 'moment', function(Row, arrays, $filter, $timeout, moment) {
        var RowsManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.rowsMap = {};
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];
            this.rowsTaskWatchers = [];

            this._defaultFilterImpl = function(sortedRows, filterRow, filterRowComparator) {
                return $filter('filter')(sortedRows, filterRow, filterRowComparator);
            };
            this.filterImpl = this._defaultFilterImpl;

            this.customRowSorters = [];
            this.customRowFilters = [];

            this.gantt.$scope.$watchGroup(['filterTask', 'filterTaskComparator'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.updateVisibleTasks();
                }
            });

            this.gantt.$scope.$watchGroup(['filterRow', 'filterRowComparator'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.updateVisibleRows();
                }
            });

            this.gantt.$scope.$watch('sortMode', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    self.sortRows();
                }
            });

            // Listen to vertical scrollbar visibility changes to update columns width
            var _oldVScrollbarVisible = this.gantt.scroll.isVScrollbarVisible();
            this.gantt.$scope.$watchGroup(['maxHeight', 'gantt.rowsManager.visibleRows.length'], function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $timeout(function() {
                        var newVScrollbarVisible = self.gantt.scroll.isVScrollbarVisible();
                        if (newVScrollbarVisible !== _oldVScrollbarVisible) {
                            _oldVScrollbarVisible = newVScrollbarVisible;
                            self.gantt.columnsManager.updateColumnsMeta();
                        }
                    });
                }
            });

            this.gantt.api.registerMethod('rows', 'sort', RowsManager.prototype.sortRows, this);
            this.gantt.api.registerMethod('rows', 'applySort', RowsManager.prototype.applySort, this);
            this.gantt.api.registerMethod('rows', 'refresh', RowsManager.prototype.updateVisibleObjects, this);

            this.gantt.api.registerMethod('rows', 'removeRowSorter', RowsManager.prototype.removeCustomRowSorter, this);
            this.gantt.api.registerMethod('rows', 'addRowSorter', RowsManager.prototype.addCustomRowSorter, this);

            this.gantt.api.registerMethod('rows', 'removeRowFilter', RowsManager.prototype.removeCustomRowFilter, this);
            this.gantt.api.registerMethod('rows', 'addRowFilter', RowsManager.prototype.addCustomRowFilter, this);

            this.gantt.api.registerMethod('rows', 'setFilterImpl', RowsManager.prototype.setFilterImpl, this);

            this.gantt.api.registerEvent('tasks', 'add');
            this.gantt.api.registerEvent('tasks', 'change');
            this.gantt.api.registerEvent('tasks', 'viewChange');

            this.gantt.api.registerEvent('tasks', 'rowChange');
            this.gantt.api.registerEvent('tasks', 'viewRowChange');
            this.gantt.api.registerEvent('tasks', 'remove');
            this.gantt.api.registerEvent('tasks', 'filter');

            this.gantt.api.registerEvent('tasks', 'displayed');

            this.gantt.api.registerEvent('rows', 'add');
            this.gantt.api.registerEvent('rows', 'change');
            this.gantt.api.registerEvent('rows', 'remove');
            this.gantt.api.registerEvent('rows', 'move');

            this.gantt.api.registerEvent('rows', 'displayed');

            this.gantt.api.registerEvent('rows', 'filter');

            this.updateVisibleObjects();
        };

        RowsManager.prototype.resetNonModelLists = function() {
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];
        };

        RowsManager.prototype.addRow = function(rowModel, modelOrderChanged) {
            // Copy to new row (add) or merge with existing (update)
            var row, i, l, isUpdate = false;

            this.gantt.objectModel.cleanRow(rowModel);

            if (rowModel.id in this.rowsMap) {
                row = this.rowsMap[rowModel.id];

                if (modelOrderChanged) {
                    this.rows.push(row);
                    this.sortedRows.push(row);
                    this.filteredRows.push(row);
                    this.customFilteredRows.push(row);
                    this.visibleRows.push(row);
                }

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
                this.customFilteredRows.push(row);
                this.visibleRows.push(row);
            }

            if (rowModel.tasks !== undefined && rowModel.tasks.length > 0) {
                for (i = 0, l = rowModel.tasks.length; i < l; i++) {
                    var taskModel = rowModel.tasks[i];
                    row.addTask(taskModel);
                }

                row.updateVisibleTasks();
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

                            row.updateVisibleTasks();
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
                arrays.removeId(this.customFilteredRows, rowId, ['model', 'id']);
                arrays.removeId(this.visibleRows, rowId, ['model', 'id']);

                this.gantt.api.rows.raise.remove(removedRow);
                return row;
            }

            return undefined;
        };

        RowsManager.prototype.removeAll = function() {
            this.rowsMap = {};
            this.rows = [];
            this.sortedRows = [];
            this.filteredRows = [];
            this.customFilteredRows = [];
            this.visibleRows = [];

            for (var i= 0, l=this.rowsTaskWatchers.length; i<l; i++) {
                var deregisterFunction = this.rowsTaskWatchers[i];
                deregisterFunction();
            }
            this.rowsTaskWatchers = [];
        };

        RowsManager.prototype.sortRows = function() {
            var expression = this.gantt.options.value('sortMode');

            if (expression !== undefined) {
                var reverse = false;
                if (angular.isString(expression) && expression.charAt(0) === '-') {
                    reverse = true;
                    expression = expression.substr(1);
                }

                var angularOrderBy = $filter('orderBy');
                this.sortedRows = angularOrderBy(this.rows, expression, reverse);
            } else {
                this.sortedRows = this.rows.slice();
            }

            this.sortedRows = this.applyCustomRowSorters(this.sortedRows);

            this.updateVisibleRows();
        };

        RowsManager.prototype.removeCustomRowSorter = function(sorterFunction) {
            var i = this.customRowSorters.indexOf(sorterFunction);
            if (i > -1) {
                this.customRowSorters.splice(i, 1);
            }
        };

        RowsManager.prototype.addCustomRowSorter = function(sorterFunction) {
            this.customRowSorters.push(sorterFunction);
        };

        RowsManager.prototype.applyCustomRowSorters = function(sortedRows) {
            angular.forEach(this.customRowSorters, function(sorterFunction) {
                sortedRows = sorterFunction(sortedRows);
            });
            return sortedRows;
        };

        /**
         * Applies current view sort to data model.
         */
        RowsManager.prototype.applySort = function() {
            var data = this.gantt.$scope.data;
            data.splice(0, data.length); // empty data.
            var rows = [];
            for (var i = 0, l = this.sortedRows.length; i < l; i++) {
                data.push(this.sortedRows[i].model);
                rows.push(this.sortedRows[i]);
            }

            this.rows = rows;
        };

        RowsManager.prototype.moveRow = function(row, targetRow) {
            var sortMode = this.gantt.options.value('sortMode');
            if (sortMode !== undefined) {
                // Apply current sort to model
                this.applySort();
                this.gantt.options.set('sortMode', undefined);
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
            var filterRow = this.gantt.options.value('filterRow');
            if (filterRow) {
                if (typeof(filterRow) === 'object') {
                    filterRow = {model: filterRow};
                }

                var filterRowComparator = this.gantt.options.value('filterRowComparator');
                if (typeof(filterRowComparator) === 'function') {
					//fix issue this.gantt is undefined
					//
					var gantt = this.gantt;
                    filterRowComparator = function(actual, expected) {
						//fix actual.model is undefined
                        return gantt.options.value('filterRowComparator')(actual, expected);
                    };
                }

                this.filteredRows = this.filterImpl(this.sortedRows, filterRow, filterRowComparator);
            } else {
                this.filteredRows = this.sortedRows.slice(0);
            }

            var raiseEvent = !angular.equals(oldFilteredRows, this.filteredRows);
            this.customFilteredRows = this.applyCustomRowFilters(this.filteredRows);

            // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
            this.visibleRows = this.customFilteredRows;

            this.gantt.api.rows.raise.displayed(this.sortedRows, this.filteredRows, this.visibleRows);

            if (raiseEvent) {
                this.gantt.api.rows.raise.filter(this.sortedRows, this.filteredRows);
            }
        };

        RowsManager.prototype.removeCustomRowFilter = function(filterFunction) {
            var i = this.customRowFilters.indexOf(filterFunction);
            if (i > -1) {
                this.customRowFilters.splice(i, 1);
            }
        };

        RowsManager.prototype.addCustomRowFilter = function(filterFunction) {
            this.customRowFilters.push(filterFunction);
        };

        RowsManager.prototype.applyCustomRowFilters = function(filteredRows) {
            angular.forEach(this.customRowFilters, function(filterFunction) {
                filteredRows = filterFunction(filteredRows);
            });
            return filteredRows;
        };

        RowsManager.prototype.setFilterImpl = function(filterImpl) {
            if (!filterImpl) {
                this.filterImpl = this._defaultFilterImpl;
            } else {
                this.filterImpl = filterImpl;
            }
        };

        RowsManager.prototype.updateVisibleTasks = function() {
            var oldFilteredTasks = [];
            var filteredTasks = [];
            var tasks = [];
            var visibleTasks = [];

            angular.forEach(this.rows, function(row) {
                oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
                row.updateVisibleTasks();
                filteredTasks = filteredTasks.concat(row.filteredTasks);
                visibleTasks = visibleTasks.concat(row.visibleTasks);
                tasks = tasks.concat(row.tasks);
            });

            this.gantt.api.tasks.raise.displayed(tasks, filteredTasks, visibleTasks);

            var filterEvent = !angular.equals(oldFilteredTasks, filteredTasks);

            if (filterEvent) {
                this.gantt.api.tasks.raise.filter(tasks, filteredTasks, visibleTasks);
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
            var toDate = this.gantt.options.value('toDate');
            if (maxRowTo && (!toDate || maxRowTo > toDate)) {
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
