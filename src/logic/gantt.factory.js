'use strict';
gantt.factory('Gantt', [
    'GanttScroll', 'GanttBody', 'GanttHeader', 'GanttLabels', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager',
    function(Scroll, Body, Header, Labels, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager) {
        // Gantt logic. Manages the columns, rows and sorting functionality.
        var Gantt = function($scope, $element) {
            var self = this;

            self.$scope = $scope;
            self.$element = $element;

            self.scroll = new Scroll(self);
            self.body = new Body(self);
            self.header = new Header(self);
            self.labels = new Labels(self);

            self.rowsManager = new RowsManager(self);
            self.columnsManager = new ColumnsManager(self);
            self.timespansManager = new TimespansManager(self);
            self.currentDateManager = new CurrentDateManager(self);

            self.originalWidth = 0;
            self.width = 0;

            // Returns the exact column date at the given position x (in em)
            self.getDateByPosition = function(x, magnet) {
                var column = self.columnsManager.getColumnByPosition(x);
                if (column !== undefined) {
                    return column.getDateByPosition(x - column.left, magnet);
                } else {
                    return undefined;
                }
            };

            // Returns the position inside the Gantt calculated by the given date
            self.getPositionByDate = function(date) {
                if (date === undefined) {
                    return undefined;
                }

                if (!moment.isMoment(moment)) {
                    date = moment(date);
                }

                var column = self.columnsManager.getColumnByDate(date);
                if (column !== undefined) {
                    return column.getPositionByDate(date);
                } else {
                    return undefined;
                }
            };

            // Adds or update rows and tasks.
            self.addData = function(data) {
                for (var i = 0, l = data.length; i < l; i++) {
                    var rowData = data[i];
                    self.rowsManager.addRow(rowData);
                }

                self.columnsManager.updateColumns();
                self.rowsManager.updateTasksPosAndSize();
                self.rowsManager.updateVisibleObjects();
            };

            // Removes specified rows or tasks.
            // If a row has no tasks inside the complete row will be deleted.
            self.removeData = function(data) {
                self.rowsManager.removeData(data);
                self.columnsManager.updateColumns();
            };

            // Removes all rows and tasks
            self.removeAllRows = function() {
                self.rowsManager.removeAll();
                self.columnsManager.clearColumns();
            };

            // Removes all timespans
            self.removeAllTimespans = function() {
                self.timespansManager.removeAllTimespans();
            };

            // Swaps two rows and changes the sort order to custom to display the swapped rows
            self.swapRows = function(a, b) {
                // Swap the two rows
                var order = a.order;
                a.order = b.order;
                b.order = order;
            };

            // Sort rows by the specified sort mode (name, order, custom)
            // and by Ascending or Descending
            self.sortRows = function(expression) {
                self.rowsManager.sortRows(expression);
            };

            // Adds or updates timespans
            self.addTimespans = function(timespans) {
                self.timespansManager.addTimespans(timespans);
                self.columnsManager.updateColumns();
            };

        };

        return Gantt;
    }]);
