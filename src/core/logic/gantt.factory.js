(function() {
    'use strict';
    angular.module('gantt').factory('Gantt', [
        'GanttApi', 'GanttCalendar', 'GanttScroll', 'GanttBody', 'GanttRowHeader', 'GanttHeader', 'GanttLabels', 'GanttObjectModel', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager', 'ganttArrays', 'moment', '$document',
        function(GanttApi, Calendar, Scroll, Body, RowHeader, Header, Labels, ObjectModel, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager, arrays, moment, $document) {
            // Gantt logic. Manages the columns, rows and sorting functionality.
            var Gantt = function($scope, $element) {
                var self = this;

                this.$scope = $scope;
                this.$element = $element;

                this.api = new GanttApi(this);

                this.api.registerEvent('core', 'ready');
                this.api.registerEvent('core', 'rendered');

                this.api.registerEvent('directives', 'preLink');
                this.api.registerEvent('directives', 'postLink');
                this.api.registerEvent('directives', 'new');
                this.api.registerEvent('directives', 'destroy');

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
                this.calendar.registerTimeFrames(this.$scope.timeFrames);
                this.calendar.registerDateFrames(this.$scope.dateFrames);

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

                        if (!angular.equals(timeFrames, oldTimeFrames)) {
                            self.calendar.clearTimeFrames();
                            self.calendar.registerTimeFrames(timeFrames);
                        }

                        if (!angular.equals(dateFrames, oldDateFrames)) {
                            self.calendar.clearDateFrames();
                            self.calendar.registerDateFrames(dateFrames);
                        }

                        self.columnsManager.generateColumns();
                    }
                });

                $scope.$watch('columnMagnet', function() {
                    var splittedColumnMagnet;
                    if ($scope.columnMagnet) {
                        splittedColumnMagnet = $scope.columnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet && splittedColumnMagnet.length > 1) {
                        self.columnMagnetValue = parseInt(splittedColumnMagnet[0]);
                        self.columnMagnetUnit = splittedColumnMagnet[splittedColumnMagnet.length-1];
                    } else {
                        self.columnMagnetValue = undefined;
                        self.columnMagnetUnit = undefined;
                    }
                });

                $scope.$watchGroup(['shiftColumnMagnet', 'viewScale'], function() {
                    var splittedColumnMagnet;
                    if ($scope.shiftColumnMagnet) {
                        splittedColumnMagnet = $scope.shiftColumnMagnet.trim().split(' ');
                    }
                    if (splittedColumnMagnet !== undefined && splittedColumnMagnet.length > 1) {
                        self.shiftColumnMagnetValue = parseInt(splittedColumnMagnet[0]);
                        self.shiftColumnMagnetUnit = splittedColumnMagnet[splittedColumnMagnet.length-1];
                    } else {
                        self.shiftColumnMagnetValue = undefined;
                        self.shiftColumnMagnetUnit = undefined;
                    }
                });

                $document.on('keyup keydown', function(e) {
                    self.shiftKey = e.shiftKey;
                    return true;
                });

                this.scroll = new Scroll(this);
                this.body = new Body(this);
                this.rowHeader = new RowHeader(this);
                this.header = new Header(this);
                this.labels = new Labels(this);

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

                this.$scope.$watchCollection('data', function(newData, oldData) {
                    var toRemoveIds = arrays.getRemovedIds(newData, oldData);

                    for (var i = 0, l = toRemoveIds.length; i < l; i++) {
                        var toRemoveId = toRemoveIds[i];
                        self.rowsManager.removeRow(toRemoveId);
                    }

                    if (newData !== undefined) {
                        self.loadData(newData);
                    }
                });
            };

            // Returns the exact column date at the given position x (in em)
            Gantt.prototype.getDateByPosition = function(x, magnet) {
                var column = this.columnsManager.getColumnByPosition(x);
                if (column !== undefined) {
                    var magnetValue;
                    var magnetUnit;
                    if (magnet) {
                        if (this.shiftKey) {
                            if (this.shiftColumnMagnetValue !== undefined && this.shiftColumnMagnetUnit !== undefined) {
                                magnetValue = this.shiftColumnMagnetValue;
                                magnetUnit = this.shiftColumnMagnetUnit;
                            } else {
                                magnetValue = 0.25;
                                magnetUnit = this.$scope.viewScale;
                            }
                        } else {
                            magnetValue = this.columnMagnetValue;
                            magnetUnit = this.columnMagnetUnit;
                        }
                    }

                    return column.getDateByPosition(x - column.left, magnetValue, magnetUnit);
                } else {
                    return undefined;
                }
            };

            // Returns the position inside the Gantt calculated by the given date
            Gantt.prototype.getPositionByDate = function(date) {
                if (date === undefined) {
                    return undefined;
                }

                if (!moment.isMoment(moment)) {
                    date = moment(date);
                }

                var column = this.columnsManager.getColumnByDate(date);
                if (column !== undefined) {
                    return column.getPositionByDate(date);
                } else {
                    return undefined;
                }
            };

            // Adds or update rows and tasks.
            Gantt.prototype.loadData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                if (this.$scope.data === undefined || this.$scope.data !== data) {
                    this.$scope.data = [];
                }
                for (var i = 0, l = data.length; i < l; i++) {
                    var rowData = data[i];
                    this.rowsManager.addRow(rowData);
                }
                this.api.data.raise.load(this.$scope, data);
            };

            Gantt.prototype.getData = function() {
                return this.$scope.data;
            };

            // Removes specified rows or tasks.
            // If a row has no tasks inside the complete row will be deleted.
            Gantt.prototype.removeData = function(data) {
                if (!angular.isArray(data)) {
                    data = data !== undefined ? [data] : [];
                }

                this.rowsManager.removeData(data);
                this.api.data.raise.remove(this.$scope, data);
            };

            // Removes all rows and tasks
            Gantt.prototype.clearData = function() {
                this.rowsManager.removeAll();
                this.api.data.raise.clear(this.$scope);
            };

            Gantt.prototype.getElementWidth = function() {
                return this.$element[0].offsetWidth;
            };

            return Gantt;
        }]);
}());
