(function(){
    'use strict';
    angular.module('gantt').factory('GanttColumnsManager', ['GanttColumnGenerator', 'GanttHeaderGenerator', '$filter', '$timeout', 'ganttLayout', 'ganttBinarySearch', function(ColumnGenerator, HeaderGenerator, $filter, $timeout, layout, bs) {
        var ColumnsManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.from = undefined;
            this.to = undefined;

            this.columns = [];
            this.visibleColumns = [];
            this.previousColumns = [];
            this.nextColumns = [];

            this.headers = [];
            this.visibleHeaders = [];

            this.scrollAnchor = undefined;

            // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
            // All those changes need a recalculation of the header columns
            this.gantt.$scope.$watchGroup(['viewScale', 'columnWidth', 'timeFramesWorkingMode', 'timeFramesNonWorkingMode', 'fromDate', 'toDate', 'autoExpand', 'taskOutOfRange'], function(oldValues, newValues) {
                if (oldValues !== newValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchCollection('headers', function(oldValues, newValues) {
                if (oldValues !== newValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchCollection('headersFormats', function(oldValues, newValues) {
                if (oldValues !== newValues && self.gantt.rendered) {
                    self.generateColumns();
                }
            });

            this.gantt.$scope.$watchGroup(['bodyRowsWidth', 'bodyRowsLeft', 'ganttElementWidth', 'sideWidth', 'maxHeight'], function(oldValues, newValues) {
                if (oldValues !== newValues && self.gantt.rendered) {
                    self.updateColumnsMeta();
                }
            });

            this.gantt.api.data.on.load(this.gantt.$scope, function() {
                if ((self.from === undefined || self.to === undefined ||
                    self.from > self.gantt.rowsManager.getDefaultFrom() ||
                    self.to < self.gantt.rowsManager.getDefaultTo()) && self.gantt.rendered) {
                    self.generateColumns();
                }

                self.gantt.rowsManager.sortRows();
            });

            this.gantt.api.data.on.remove(this.gantt.$scope, function() {
                self.gantt.rowsManager.sortRows();
            });

            this.gantt.api.registerMethod('columns', 'clear', this.clearColumns, this);
            this.gantt.api.registerMethod('columns', 'generate', this.generateColumns, this);
            this.gantt.api.registerMethod('columns', 'refresh', this.updateColumnsMeta, this);

            this.gantt.api.registerEvent('columns', 'generate');
        };

        ColumnsManager.prototype.setScrollAnchor = function() {
            if (this.gantt.scroll.$element && this.columns.length > 0) {
                var el = this.gantt.scroll.$element[0];
                var center = el.scrollLeft + el.offsetWidth / 2;

                this.scrollAnchor = this.gantt.getDateByPosition(center);
            }
        };

        ColumnsManager.prototype.scrollToScrollAnchor = function() {
            var self = this;

            if (this.columns.length > 0 && this.scrollAnchor !== undefined) {
                // Ugly but prevents screen flickering (unlike $timeout)
                this.gantt.$scope.$$postDigest(function() {
                    self.gantt.api.scroll.toDate(self.scrollAnchor);
                });
            }
        };

        ColumnsManager.prototype.clearColumns = function() {
            this.setScrollAnchor();

            this.from = undefined;
            this.to = undefined;

            this.columns = [];
            this.visibleColumns = [];
            this.previousColumns = [];
            this.nextColumns = [];

            this.headers = [];
            this.visibleHeaders = [];

            this.gantt.api.columns.raise.clear();
        };

        ColumnsManager.prototype.generateColumns = function(from, to) {
            if (!from) {
                from = this.gantt.$scope.fromDate;
            }

            if (!to) {
                to = this.gantt.$scope.toDate;
            }

            if (!from) {
                from = this.gantt.rowsManager.getDefaultFrom();
                if (!from) {
                    return false;
                }
            }

            if (!to) {
                to = this.gantt.rowsManager.getDefaultTo();
                if (!to) {
                    return false;
                }
            }

            if (this.gantt.$scope.taskOutOfRange === 'expand') {
                from = this.gantt.rowsManager.getExpandedFrom(from);
                to = this.gantt.rowsManager.getExpandedTo(to);
            }

            this.setScrollAnchor();

            this.from = from;
            this.to = to;

            var columnGenerator = new ColumnGenerator(this);
            var headerGenerator = new HeaderGenerator(this);

            this.columns = columnGenerator.generate(from, to);
            this.headers = headerGenerator.generate(this.columns);
            this.previousColumns = [];
            this.nextColumns = [];

            this.updateColumnsMeta();
            this.scrollToScrollAnchor();

            this.gantt.api.columns.raise.generate(this.columns, this.headers);
        };

        ColumnsManager.prototype.updateColumnsMeta = function() {
            var lastColumn = this.getLastColumn();
            this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

            var autoFitWidthEnabled = this.gantt.$scope.columnWidth === undefined;
            var scrollWidth = this.gantt.getElementWidth() - this.gantt.side.getWidth();
            if (autoFitWidthEnabled) {
                var newWidth = scrollWidth - this.gantt.scroll.getBordersWidth();

                layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.previousColumns);
                layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.columns);
                layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.nextColumns);

                angular.forEach(this.headers, function(header) {
                    layout.setColumnsWidth(newWidth, this.gantt.originalWidth, header);
                }, this);
            }

            this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

            this.gantt.rowsManager.updateTasksPosAndSize();
            this.gantt.timespansManager.updateTimespansPosAndSize();

            this.updateVisibleColumns(autoFitWidthEnabled);
            this.gantt.rowsManager.updateVisibleObjects();

            this.gantt.currentDateManager.setCurrentDate(this.gantt.$scope.currentDateValue);
        };

        // Returns the last Gantt column or undefined
        ColumnsManager.prototype.getLastColumn = function(extended) {
            var columns = this.columns;
            if (extended) {
                columns = this.nextColumns;
            }
            if (columns && columns.length > 0) {
                return columns[columns.length - 1];
            } else {
                return undefined;
            }
        };

        // Returns the first Gantt column or undefined
        ColumnsManager.prototype.getFirstColumn = function(extended) {
            var columns = this.columns;
            if (extended) {
                columns = this.previousColumns;
            }

            if (columns && columns.length > 0) {
                return columns[0];
            } else {
                return undefined;
            }
        };

        // Returns the column at the given or next possible date
        ColumnsManager.prototype.getColumnByDate = function(date) {
            this.expandExtendedColumnsForDate(date);
            var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
            var columns = bs.get(extendedColumns, date, function(c) {
                return c.date;
            }, true);
            return columns[0] !== undefined ? columns[0] : columns[1];
        };

        // Returns the column at the given position x (in em)
        ColumnsManager.prototype.getColumnByPosition = function(x) {
            this.expandExtendedColumnsForPosition(x);
            var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
            return bs.get(extendedColumns, x, function(c) {
                return c.left;
            }, true)[0];
        };

        ColumnsManager.prototype.expandExtendedColumnsForPosition = function(x) {
            if (x < 0) {
                var firstColumn = this.getFirstColumn();
                var from = firstColumn.date;
                var firstExtendedColumn = this.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                    this.previousColumns = new ColumnGenerator(this).generate(from, undefined, -x, 0, true);
                }
                return true;
            } else if (x > this.gantt.width) {
                var lastColumn = this.getLastColumn();
                var endDate = lastColumn.getDateByPosition(lastColumn.width);
                var lastExtendedColumn = this.getLastColumn(true);
                if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                    this.nextColumns = new ColumnGenerator(this).generate(endDate, undefined, x - this.gantt.width, this.gantt.width, false);
                }
                return true;
            }
            return false;
        };

        ColumnsManager.prototype.expandExtendedColumnsForDate = function(date) {
            var firstColumn = this.getFirstColumn();
            var from;
            if (firstColumn) {
                from = firstColumn.date;
            }

            var lastColumn = this.getLastColumn();
            var endDate;
            if (lastColumn) {
                endDate = lastColumn.getDateByPosition(lastColumn.width);
            }

            if (from && date < from) {
                var firstExtendedColumn = this.getFirstColumn(true);
                if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                    this.previousColumns = new ColumnGenerator(this).generate(from, date, undefined, 0, true);
                }
                return true;
            } else if (endDate && date > endDate) {
                var lastExtendedColumn = this.getLastColumn(true);
                if (!lastExtendedColumn || endDate < lastExtendedColumn) {
                    this.nextColumns = new ColumnGenerator(this).generate(endDate, date, undefined, this.gantt.width, false);
                }
                return true;
            }
            return false;
        };

        // Returns the number of active headers
        ColumnsManager.prototype.getActiveHeadersCount = function() {
            return this.headers.length;
        };

        ColumnsManager.prototype.updateVisibleColumns = function(includeViews) {
            this.visibleColumns = $filter('ganttColumnLimit')(this.columns, this.gantt);

            this.visibleHeaders = [];
            angular.forEach(this.headers, function(header) {
                this.visibleHeaders.push($filter('ganttColumnLimit')(header, this.gantt));
            }, this);

            if (includeViews) {
                angular.forEach(this.visibleColumns, function(c) {
                    c.updateView();
                });

                angular.forEach(this.visibleHeaders, function(headerRow) {
                    angular.forEach(headerRow, function(header) {
                        header.updateView();
                    });
                });
            }
        };

        var defaultHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q YYYY', month: 'MMMM YYYY', week: 'w', day: 'D', hour: 'H', minute:'HH:mm'};
        var defaultDayHeadersFormats = {day: 'LL', hour: 'H', minute:'HH:mm'};
        var defaultYearHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q', month: 'MMMM'};

        ColumnsManager.prototype.getHeaderFormat = function(unit) {
            var format;
            if (this.gantt.$scope.headersFormats !== undefined) {
                format = this.gantt.$scope.headersFormats[unit];
            }
            if (format === undefined) {
                if (['millisecond', 'second', 'minute', 'hour'].indexOf(this.gantt.$scope.viewScale) > -1) {
                    format = defaultDayHeadersFormats[unit];
                } else if (['month', 'quarter', 'year'].indexOf(this.gantt.$scope.viewScale) > -1) {
                    format = defaultYearHeadersFormats[unit];
                }
                if (format === undefined) {
                    format = defaultHeadersFormats[unit];
                }
            }
            return format;
        };

        return ColumnsManager;
    }]);
}());
