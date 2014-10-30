'use strict';
gantt.factory('GanttColumnsManager', ['GanttColumnGenerator', 'GanttHeaderGenerator', '$filter', 'ganttLayout', 'ganttBinarySearch', function(ColumnGenerator, HeaderGenerator, $filter, layout, bs) {
    var ColumnsManager = function(gantt) {
        var self = this;

        self.gantt = gantt;

        self.headerGenerator = undefined;
        self.columnGenerator = undefined;

        self.from = undefined;
        self.to = undefined;

        self.columns = [];
        self.visibleColumns = [];
        self.previousColumns = [];
        self.nextColumns = [];

        self.headers = {};
        self.visibleHeaders = {};

        // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
        // All those changes need a recalculation of the header columns
        self.gantt.$scope.$watch('viewScale+width+labelsWidth+columnWidth+timeFramesWorkingMode+timeFramesNonWorkingMode+columnMagnet', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.buildGenerator();
                self.clearColumns();
                self.updateColumns();
            }
        });

        self.gantt.$scope.$watch('fromDate+toDate+autoExpand+taskOutOfRange', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateColumns();
            }
        });

        self.gantt.$scope.$watch('ganttElementWidth+labelsWidth+showLabelsColumn+maxHeight', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateColumnsMeta();
            }
        });

        self.gantt.$scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleColumns();
            }
        });

        self.scrollAnchor = undefined;
        var setScrollAnchor = function() {
            if (self.gantt.scroll.$element && self.columns.length > 0) {
                var el = self.gantt.scroll.$element[0];
                var center = el.scrollLeft + el.offsetWidth / 2;

                self.scrollAnchor = self.gantt.getDateByPosition(center);
            }
        };

        self.buildGenerator = function() {
            self.columnGenerator = new ColumnGenerator(self.gantt.$scope);
            self.headerGenerator = new HeaderGenerator(self.gantt.$scope);
        };

        self.clearColumns = function() {
            setScrollAnchor();

            self.from = undefined;
            self.to = undefined;

            self.columns = [];
            self.visibleColumns = [];
            self.previousColumns = [];
            self.nextColumns = [];

            self.headers = [];
            self.visibleHeaders = {};
        };

        self.updateColumns = function() {
            var from = self.gantt.$scope.fromDate;
            var to = self.gantt.$scope.toDate;
            if (self.gantt.$scope.taskOutOfRange === 'expand') {
                from = self.gantt.rowsManager.getExpandedFrom(from);
                to = self.gantt.rowsManager.getExpandedTo(to);
            }
            self.generateColumns(from, to);
        };

        self.generateColumns = function(from, to) {
            if (!from) {
                from = self.gantt.rowsManager.getDefaultFrom();
                if (!from) {
                    return false;
                }
            }

            if (!to) {
                to = self.gantt.rowsManager.getDefaultTo();
                if (!to) {
                    return false;
                }
            }

            if (self.from === from && self.to === to) {
                return false;
            }

            setScrollAnchor();

            self.from = from;
            self.to = to;

            self.columns = self.columnGenerator.generate(from, to);
            self.headers = self.headerGenerator.generate(self.columns);
            self.previousColumns = [];
            self.nextColumns = [];

            self.updateColumnsMeta();

            return true;
        };

        self.updateColumnsMeta = function() {
            var lastColumn = self.getLastColumn();
            self.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

            if (self.gantt.$scope.columnWidth === undefined) {
                var newWidth = self.gantt.$scope.ganttElementWidth - (self.gantt.$scope.showLabelsColumn ? self.gantt.$scope.labelsWidth : 0);

                if (self.gantt.$scope.maxHeight > 0) {
                    newWidth = newWidth - layout.getScrollBarWidth();
                }

                layout.setColumnsWidth(newWidth, self.gantt.originalWidth, self.previousColumns);
                layout.setColumnsWidth(newWidth, self.gantt.originalWidth, self.columns);
                layout.setColumnsWidth(newWidth, self.gantt.originalWidth, self.nextColumns);

                angular.forEach(self.headers, function(header) {
                    layout.setColumnsWidth(newWidth, self.gantt.originalWidth, header);
                });
            }

            self.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

            self.gantt.rowsManager.updateTasksPosAndSize();
            self.gantt.timespansManager.updateTimespansPosAndSize();

            self.updateVisibleColumns();
            self.gantt.rowsManager.updateVisibleObjects();

            self.gantt.currentDateManager.setCurrentDate(self.gantt.$scope.currentDateValue);
        };

        // Returns the last Gantt column or undefined
        self.getLastColumn = function(extended) {
            var columns = self.columns;
            if (extended) {
                columns = self.nextColumns;
            }
            if (columns && columns.length > 0) {
                return columns[columns.length - 1];
            } else {
                return undefined;
            }
        };

        // Returns the first Gantt column or undefined
        self.getFirstColumn = function(extended) {
            var columns = self.columns;
            if (extended) {
                columns = self.previousColumns;
            }

            if (columns && columns.length > 0) {
                return columns[0];
            } else {
                return undefined;
            }
        };

        // Returns the column at the given or next possible date
        self.getColumnByDate = function(date) {
            expandExtendedColumnsForDate(date);
            var extendedColumns = self.previousColumns.concat(self.columns, self.nextColumns);
            var columns = bs.get(extendedColumns, date, function(c) {
                return c.date;
            });
            return columns[0] !== undefined ? columns[0] : columns[1];
        };

        // Returns the column at the given position x (in em)
        self.getColumnByPosition = function(x) {
            expandExtendedColumnsForPosition(x);
            var extendedColumns = self.previousColumns.concat(self.columns, self.nextColumns);
            return bs.get(extendedColumns, x, function(c) {
                return c.left;
            })[0];
        };

        var expandExtendedColumnsForPosition = function(x) {
            if (x < 0) {
                var firstColumn = self.getFirstColumn();
                var from = firstColumn.date;
                var firstExtendedColumn = self.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                    self.previousColumns = self.columnGenerator.generate(from, undefined, -x, 0, true);
                }
                return true;
            } else if (x > self.width) {
                var lastColumn = self.getLastColumn();
                var endDate = lastColumn.getDateByPosition(lastColumn.width);
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                    self.nextColumns = self.columnGenerator.generate(endDate, undefined, x - self.width, self.width, false);
                }
                return true;
            }
            return false;
        };

        var expandExtendedColumnsForDate = function(date) {
            var firstColumn = self.getFirstColumn();
            var from;
            if (firstColumn) {
                from = firstColumn.date;
            }

            var lastColumn = self.getLastColumn();
            var endDate;
            if (lastColumn) {
                endDate = lastColumn.getDateByPosition(lastColumn.width);
            }

            if (from && date < from) {
                var firstExtendedColumn = self.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                    self.previousColumns = self.columnGenerator.generate(from, date, undefined, 0, true);
                }
                return true;
            } else if (endDate && date > endDate) {
                var lastExtendedColumn = self.getLastColumn(true);
                if (!lastExtendedColumn || endDate < lastExtendedColumn) {
                    self.nextColumns = self.columnGenerator.generate(endDate, date, undefined, self.width, false);
                }
                return true;
            }
            return false;
        };

        // Returns the number of active headers
        self.getActiveHeadersCount = function() {
            var size = 0, key;
            for (key in self.headers) {
                if (self.headers.hasOwnProperty(key)) {
                    size++;
                }
            }
            return size;
        };

        self.updateVisibleColumns = function() {
            self.visibleColumns = $filter('ganttColumnLimit')(self.columns, self.gantt.$scope.scrollLeft, self.gantt.$scope.scrollWidth);

            angular.forEach(self.headers, function(headers, key) {
                if (self.headers.hasOwnProperty(key)) {
                    self.visibleHeaders[key] = $filter('ganttColumnLimit')(headers, self.gantt.$scope.scrollLeft, self.gantt.$scope.scrollWidth);
                }
            });
        };

        self.buildGenerator();
        self.clearColumns();
        self.updateColumns();
        self.updateVisibleColumns();
    };
    return ColumnsManager;
}]);
