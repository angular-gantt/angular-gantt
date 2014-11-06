'use strict';
gantt.factory('Gantt', [
    'GanttApi', 'GanttCalendar', 'GanttScroll', 'GanttBody', 'GanttRowHeader', 'GanttHeader', 'GanttLabels', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager',
    function(GanttApi, Calendar, Scroll, Body, RowHeader, Header, Labels, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager) {
        // Gantt logic. Manages the columns, rows and sorting functionality.
        var Gantt = function($scope, $element) {
            var self = this;

            this.$scope = $scope;
            this.$element = $element;

            this.api = new GanttApi(this);

            this.api.registerEvent('core', 'ready');

            this.api.registerEvent('directives', 'new');
            this.api.registerEvent('directives', 'destroy');

            this.api.registerEvent('data', 'load');
            this.api.registerEvent('data', 'remove');
            this.api.registerEvent('data', 'clear', this.clearData, this);

            this.api.registerMethod('core', 'getDateByPosition', this.getDateByPosition, this);
            this.api.registerMethod('core', 'getPositionByDate', this.getPositionByDate, this);

            this.api.registerMethod('data', 'load', this.loadData, this);
            this.api.registerMethod('data', 'remove', this.removeData, this);
            this.api.registerMethod('data', 'clear', this.clearData, this);

            this.calendar = new Calendar(this);
            this.calendar.registerTimeFrames(this.$scope.timeFrames);
            this.calendar.registerDateFrames(this.$scope.dateFrames);

            this.api.registerMethod('timeframes', 'registerTimeFrames', this.calendar.registerTimeFrames, this.calendar);
            this.api.registerMethod('timeframes', 'clearTimeframes', this.calendar.clearTimeFrames, this.calendar);
            this.api.registerMethod('timeframes', 'registerDateFrames', this.calendar.registerDateFrames, this.calendar);
            this.api.registerMethod('timeframes', 'clearDateFrames', this.calendar.clearDateFrames, this.calendar);
            this.api.registerMethod('timeframes', 'registerTimeFrameMappings', this.calendar.registerTimeFrameMappings, this.calendar);
            this.api.registerMethod('timeframes', 'clearTimeFrameMappings', this.calendar.clearTimeFrameMappings, this.calendar);

            $scope.$watch('timeFrames', function(newValues, oldValues) {
                if (!angular.equals(newValues, oldValues)) {
                    this.calendar.clearTimeFrames();
                    this.calendar.registerTimeFrames($scope.timeFrames);
                    this.columnsManager.generateColumns();
                }
            });

            $scope.$watch('dateFrames', function(newValues, oldValues) {
                if (!angular.equals(newValues, oldValues)) {
                    this.calendar.clearTimeFrames();
                    this.calendar.registerTimeFrames($scope.timeFrames);
                    this.columnsManager.generateColumns();
                }
            });

            this.scroll = new Scroll(this);
            this.body = new Body(this);
            this.rowHeader = new RowHeader(this);
            this.header = new Header(this);
            this.labels = new Labels(this);

            this.rowsManager = new RowsManager(this);
            this.columnsManager = new ColumnsManager(this);
            this.timespansManager = new TimespansManager(this);
            this.currentDateManager = new CurrentDateManager(this);

            this.originalWidth = 0;
            this.width = 0;

            this.$scope.$watch('data', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    self.clearData();
                    self.loadData(newValue);
                }
            });

            if (angular.isFunction(this.$scope.api)) {
                this.$scope.api(this.api);
            }
        };

        // Returns the exact column date at the given position x (in em)
        Gantt.prototype.getDateByPosition = function(x, magnet) {
            var column = this.columnsManager.getColumnByPosition(x);
            if (column !== undefined) {
                return column.getDateByPosition(x - column.left, magnet);
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
                data = [data];
            }

            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];
                this.rowsManager.addRow(rowData);
            }
            this.api.data.raise.load(this.$scope, data);
        };

        // Removes specified rows or tasks.
        // If a row has no tasks inside the complete row will be deleted.
        Gantt.prototype.removeData = function(data) {
            if (!angular.isArray(data)) {
                data = [data];
            }

            this.rowsManager.removeData(data);
            this.api.data.raise.remove(this.$scope, data);
        };

        // Removes all rows and tasks
        Gantt.prototype.clearData = function() {
            this.rowsManager.removeAll();
            this.api.data.raise.clear(this.$scope);
        };

        return Gantt;
    }]);
