'use strict';
gantt.factory('Gantt', [
    'GanttScroll', 'GanttBody', 'GanttHeader', 'GanttLabels', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager', 'GANTT_EVENTS',
    function(Scroll, Body, Header, Labels, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager, GANTT_EVENTS) {
        // Gantt logic. Manages the columns, rows and sorting functionality.
        var Gantt = function($scope, $element) {
            var self = this;

            this.$scope = $scope;
            this.$element = $element;

            this.scroll = new Scroll(this);
            this.body = new Body(this);
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
            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];
                this.rowsManager.addRow(rowData);
            }

            this.columnsManager.updateColumns();
            this.rowsManager.updateTasksPosAndSize();
            this.rowsManager.updateVisibleObjects();
            this.rowsManager.sortRows();
        };

        // Removes specified rows or tasks.
        // If a row has no tasks inside the complete row will be deleted.
        Gantt.prototype.removeData = function(data) {
            this.rowsManager.removeData(data);
            this.columnsManager.updateColumns();
            this.rowsManager.sortRows();
        };

        // Removes all rows and tasks
        Gantt.prototype.clearData = function() {
            this.rowsManager.removeAll();
            this.columnsManager.clearColumns();
        };

        // Removes all timespans
        Gantt.prototype.clearTimespans = function() {
            this.timespansManager.removeAllTimespans();
        };

        // Swaps two rows and changes the sort order to custom to display the swapped rows
        Gantt.prototype.swapRows = function(a, b) {
            // Swap the two rows
            var order = a.order;
            a.order = b.order;
            b.order = order;

            // Raise change events
            this.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': a});
            this.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': a});
            this.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': b});
            this.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': b});

            // Switch to custom sort mode and trigger sort
            if (this.$scope.sortMode !== 'custom') {
                this.$scope.sortMode = 'custom'; // Sort will be triggered by the watcher
            } else {
                this.rowsManager.sortRows();
            }
        };

        // Sort rows by the specified sort mode (name, order, custom)
        // and by Ascending or Descending
        Gantt.prototype.sortRows = function() {
            this.rowsManager.sortRows();
        };

        // Adds or updates timespans
        Gantt.prototype.loadTimespans = function(timespans) {
            this.timespansManager.loadTimespans(timespans);
        };

        return Gantt;
    }]);
