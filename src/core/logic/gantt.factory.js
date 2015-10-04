(function() {
    'use strict';
    angular.module('gantt').factory('Gantt', [
        'GanttApi', 'GanttOptions', 'GanttCalendar', 'GanttScroll', 'GanttBody', 'GanttRowHeader', 'GanttHeader', 'GanttSide', 'GanttObjectModel', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager', 'ganttArrays', 'moment', '$document', '$timeout',
        function(GanttApi, Options, Calendar, Scroll, Body, RowHeader, Header, Side, ObjectModel, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager, arrays, moment, $document, $timeout) {
            // Gantt logic. Manages the columns, rows and sorting functionality.
            var Gantt = function($scope, $element) {
                var self = this;

                this.$scope = $scope;
                this.$element = $element;

                this.options = new Options($scope, {
                    'api': angular.noop,
                    'data': [],
                    'timespans': [],
                    'viewScale': 'day',
                    'columnMagnet': '15 minutes',
                    'timeFramesMagnet': true,
                    'showSide': true,
                    'allowSideResizing': true,
                    'currentDate': 'line',
                    'currentDateValue': moment,
                    'autoExpand': 'none',
                    'taskOutOfRange': 'truncate',
                    'taskContent': '{{task.model.name}}',
                    'rowContent': '{{row.model.name}}',
                    'maxHeight': 0,
                    'timeFrames': [],
                    'dateFrames': [],
                    'timeFramesWorkingMode': 'hidden',
                    'timeFramesNonWorkingMode': 'visible'
                });

                this.api = new GanttApi(this);

                this.api.registerEvent('core', 'ready');
                this.api.registerEvent('core', 'rendered');

                this.api.registerEvent('directives', 'controller');
                this.api.registerEvent('directives', 'preLink');
                this.api.registerEvent('directives', 'postLink');
                this.api.registerEvent('directives', 'new');
                this.api.registerEvent('directives', 'destroy');

                this.api.registerEvent('data', 'change');
                this.api.registerEvent('data', 'load');
                this.api.registerEvent('data', 'remove');
                this.api.registerEvent('data', 'clear');

                this.api.registerMethod('core', 'getDateByPosition', this.getDateByPosition, this);
                this.api.registerMethod('core', 'getPositionByDate', this.getPositionByDate, this);

                this.api.registerMethod('data', 'load', this.loadData, this);
                this.api.registerMethod('data', 'remove', this.removeData, this);
                this.api.registerMethod('data', 'clear', this.clearData, this);
                this.api.registerMethod('data', 'get', this.getData, this);

                this.calendar = new Calendar(this);
                this.calendar.registerTimeFrames(this.options.value('timeFrames'));
                this.calendar.registerDateFrames(this.options.value('dateFrames'));

                this.api.registerMethod('timeframes', 'registerTimeFrames', this.calendar.registerTimeFrames, this.calendar);
                this.api.registerMethod('timeframes', 'clearTimeframes', this.calendar.clearTimeFrames, this.calendar);
                this.api.registerMethod('timeframes', 'registerDateFrames', this.calendar.registerDateFrames, this.calendar);
                this.api.registerMethod('timeframes', 'clearDateFrames', this.calendar.clearDateFrames, this.calendar);
                this.api.registerMethod('timeframes', 'registerTimeFrameMappings', this.calendar.registerTimeFrameMappings, this.calendar);
                this.api.registerMethod('timeframes', 'clearTimeFrameMappings', this.calendar.clearTimeFrameMappings, this.calendar);

                $scope.$watchGroup(['timeFrames', 'dateFrames'], function(newValues, oldValues) {
                    if (newValues !== oldValues) {
                        var timeFrames = newValues[0];
                        var dateFrames = newValues[1];

                        var oldTimeFrames = oldValues[0];
                        var oldDateFrames = oldValues[1];

                        var framesChanged = false;

                        if (!angular.equals(timeFrames, oldTimeFrames)) {
                            self.calendar.clearTimeFrames();
                            self.calendar.registerTimeFrames(timeFrames);
                            framesChanged = true;
                        }

                        if (!angular.equals(dateFrames, oldDateFrames)) {
                            self.calendar.clearDateFrames();
                            self.calendar.registerDateFrames(dateFrames);
                            framesChanged = true;
                        }

                        if (framesChanged) {
                            self.columnsManager.generateColumns();
                        }
                    }
                });

                $scope.$watch('columnMagnet', function() {
                    var splittedColumnMagnet;
                    var columnMagnet = self.options.value('columnMagnet');
                    if (columnMagnet) {
                        splittedColumnMagnet = columnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet && splittedColumnMagnet.length > 1) {
                        self.columnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                        self.columnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
                    } else {
                        self.columnMagnetValue = 1;
                        self.columnMagnetUnit = moment.normalizeUnits(columnMagnet);
                    }
                });

                $scope.$watchGroup(['shiftColumnMagnet', 'viewScale'], function() {
                    var splittedColumnMagnet;
                    var shiftColumnMagnet = self.options.value('shiftColumnMagnet');
                    if (shiftColumnMagnet) {
                        splittedColumnMagnet = shiftColumnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet !== undefined && splittedColumnMagnet.length > 1) {
                        self.shiftColumnMagnetValue = parseFloat(splittedColumnMagnet[0]);
                        self.shiftColumnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
                    } else {
                        self.shiftColumnMagnetValue = 1;
                        self.shiftColumnMagnetUnit = moment.normalizeUnits(shiftColumnMagnet);
                    }
                });

                var keyHandler = function(e) {
                    self.shiftKey = e.shiftKey;
                    return true;
                };

                $document.on('keyup keydown', keyHandler);

                $scope.$on('$destroy', function() {
                    $document.off('keyup keydown', keyHandler);
                });

                this.scroll = new Scroll(this);
                this.body = new Body(this);
                this.header = new Header(this);
                this.side = new Side(this);

                this.objectModel = new ObjectModel(this.api);

                this.rowsManager = new RowsManager(this);
                this.columnsManager = new ColumnsManager(this);
                this.timespansManager = new TimespansManager(this);
                this.currentDateManager = new CurrentDateManager(this);

                this.originalWidth = 0;
                this.width = 0;

                if (angular.isFunction(this.$scope.api)) {
                    this.$scope.api(this.api);
                }

                var hasRowModelOrderChanged = function(data1, data2) {
                    if (data2 === undefined || data1.length !== data2.length) {
                        return true;
                    }

                    for (var i = 0, l = data1.length; i < l; i++) {
                        if (data1[i].id !== data2[i].id) {
                            return true;
                        }
                    }

                    return false;
                };

                $scope.$watchCollection('data', function(newData, oldData) {
                    if (oldData !== undefined) {
                        var toRemoveIds = arrays.getRemovedIds(newData, oldData);
                        if (toRemoveIds.length === oldData.length) {
                            self.rowsManager.removeAll();

                            // DEPRECATED
                            self.api.data.raise.clear();
                        } else {
                            for (var i = 0, l = toRemoveIds.length; i < l; i++) {
                                var toRemoveId = toRemoveIds[i];
                                self.rowsManager.removeRow(toRemoveId);
                            }

                            // DEPRECATED
                            var removedRows = [];
                            angular.forEach(oldData, function(removedRow) {
                                if (toRemoveIds.indexOf(removedRow.id) > -1) {
                                    removedRows.push(removedRow);
                                }
                            });
                            self.api.data.raise.remove(removedRows);
                        }
                    }

                    if (newData !== undefined) {
                        var modelOrderChanged = hasRowModelOrderChanged(newData, oldData);

                        if (modelOrderChanged) {
                            self.rowsManager.resetNonModelLists();
                        }

                        for (var j = 0, k = newData.length; j < k; j++) {
                            var rowData = newData[j];
                            self.rowsManager.addRow(rowData, modelOrderChanged);
                        }

                        self.api.data.raise.change(newData, oldData);

                        // DEPRECATED
                        self.api.data.raise.load(newData);
                    }
                });
            };

            // Returns the exact column date at the given position x (in em)
            Gantt.prototype.getDateByPosition = function(x, magnet, disableExpand) {
                var column = this.columnsManager.getColumnByPosition(x, disableExpand);
                if (column !== undefined) {
                    var magnetValue;
                    var magnetUnit;
                    if (magnet) {
                        if (this.shiftKey) {
                            if (this.shiftColumnMagnetValue !== undefined && this.shiftColumnMagnetUnit !== undefined) {
                                magnetValue = this.shiftColumnMagnetValue;
                                magnetUnit = this.shiftColumnMagnetUnit;
                            } else {
                                var viewScale = this.options.value('viewScale');
                                viewScale = viewScale.trim();
                                var viewScaleValue;
                                var viewScaleUnit;
                                var splittedViewScale;

                                if (viewScale) {
                                    splittedViewScale = viewScale.split(' ');
                                }
                                if (splittedViewScale && splittedViewScale.length > 1) {
                                    viewScaleValue = parseFloat(splittedViewScale[0]);
                                    viewScaleUnit = moment.normalizeUnits(splittedViewScale[splittedViewScale.length - 1]);
                                } else {
                                    viewScaleValue = 1;
                                    viewScaleUnit = moment.normalizeUnits(viewScale);
                                }
                                magnetValue = viewScaleValue * 0.25;
                                magnetUnit = viewScaleUnit;
                            }
                        } else {
                            magnetValue = this.columnMagnetValue;
                            magnetUnit = this.columnMagnetUnit;
                        }
                    }

                    return column.getDateByPosition(x - column.left, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
                } else {
                    return undefined;
                }
            };

            Gantt.prototype.getBodyAvailableWidth = function() {
                var scrollWidth = this.getWidth() - this.side.getWidth();
                var borderWidth = this.scroll.getBordersWidth();
                var availableWidth = scrollWidth - (borderWidth !== undefined ? this.scroll.getBordersWidth() : 0);
                // Remove 1 pixel because of rounding issue in some cases.
                availableWidth = availableWidth - 1;
                return availableWidth;
            };

            // Returns the position inside the Gantt calculated by the given date
            Gantt.prototype.getPositionByDate = function(date, disableExpand) {
                if (date === undefined) {
                    return undefined;
                }

                if (!moment.isMoment(moment)) {
                    date = moment(date);
                }

                var column = this.columnsManager.getColumnByDate(date, disableExpand);
                if (column !== undefined) {
                    return column.getPositionByDate(date);
                } else {
                    return undefined;
                }
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.loadData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                if (this.$scope.data === undefined) {
                    this.$scope.data = data;
                } else {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var row = data[i];

                        var j = arrays.indexOfId(this.$scope.data, row.id);
                        if (j > -1) {
                            this.$scope.data[j] = row;
                        } else {
                            this.$scope.data.push(row);
                        }
                    }
                }

                var w = this.side.getWidth();
                if (w > 0) {
                    this.options.set('sideWidth', w);
                }
            };

            Gantt.prototype.getData = function() {
                return this.$scope.data;
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.removeData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                if (this.$scope.data !== undefined) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        var rowToRemove = data[i];

                        var j = arrays.indexOfId(this.$scope.data, rowToRemove.id);
                        if (j > -1) {
                            if (rowToRemove.tasks === undefined || rowToRemove.tasks.length === 0) {
                                // Remove complete row
                                this.$scope.data.splice(j, 1);
                            } else {
                                // Remove single tasks
                                var row = this.$scope.data[j];
                                for (var ti = 0, tl = rowToRemove.tasks.length; ti < tl; ti++) {
                                    var taskToRemove = rowToRemove.tasks[ti];

                                    var tj = arrays.indexOfId(row.tasks, taskToRemove.id);
                                    if (tj > -1) {
                                        row.tasks.splice(tj, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            };

            // DEPRECATED - Use $data instead.
            Gantt.prototype.clearData = function() {
                this.$scope.data = undefined;
            };

            Gantt.prototype.getWidth = function() {
                return this.$scope.ganttElementWidth;
            };

            Gantt.prototype.initialized = function() {
                // Gantt is initialized. Signal that the Gantt is ready.
                this.api.core.raise.ready(this.api);

                this.rendered = true;
                this.columnsManager.generateColumns();

                var gantt = this;
                var renderedFunction = function() {
                    var w = gantt.side.getWidth();
                    if (w > 0) {
                        gantt.options.set('sideWidth', w);
                    }
                    gantt.api.core.raise.rendered(gantt.api);
                };
                $timeout(renderedFunction);
            };

            return Gantt;
        }]);
}());
