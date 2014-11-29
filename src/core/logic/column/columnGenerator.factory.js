(function(){
    'use strict';
    angular.module('gantt').factory('GanttColumnGenerator', [ 'GanttColumn', 'moment', function(Column, moment) {
        var ColumnGenerator = function(columnsManager) {
            var self = this;

            this.columnsManager = columnsManager;

            // Generates one column for each time unit between the given from and to date.
            self.generate = function(from, to, maximumWidth, leftOffset, reverse) {
                if (!to && !maximumWidth) {
                    throw 'to or maximumWidth must be defined';
                }

                var unit = self.columnsManager.gantt.options.value('viewScale');
                var calendar = self.columnsManager.gantt.calendar;
                var timeFramesWorkingMode = self.columnsManager.gantt.options.value('timeFramesWorkingMode');
                var timeFramesNonWorkingMode = self.columnsManager.gantt.options.value('timeFramesNonWorkingMode');
                var columnWidth = self.columnsManager.getColumnsWidth();

                var excludeTo = false;
                from = moment(from).startOf(unit);
                if (to) {
                    excludeTo = isToDateToExclude(to);
                    to = moment(to).startOf(unit);
                }

                var date = moment(from).startOf(unit);
                if (reverse) {
                    date.add(-1, unit);
                }
                var generatedCols = [];
                var left = 0;

                while (true) {
                    if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                        break;
                    }

                    var startDate = moment(date);
                    var endDate = moment(startDate).add(1, unit);

                    var column = new Column(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
                    if (!column.cropped) {
                        generatedCols.push(column);
                        if (reverse) {
                            left -= columnWidth;
                        } else {
                            left += columnWidth;
                        }

                        if (to) {
                            if (reverse) {
                                if (excludeTo && date < to || !excludeTo && date <= to) {
                                    break;
                                }
                            } else {
                                if (excludeTo && date > to || !excludeTo && date >= to) {
                                    break;
                                }
                            }
                        }
                    }
                    date.add(reverse ? -1 : 1, unit);
                }

                if (reverse) {
                    if (isToDateToExclude(from, unit)) {
                        generatedCols.shift();
                    }
                    generatedCols.reverse();
                }

                return generatedCols;
            };

            // Columns are generated including or excluding the to date.
            // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

            var isToDateToExclude = function(to, unit) {
                return moment(to).add(1, unit).startOf(unit) === to;
            };
        };
        return ColumnGenerator;
    }]);
}());
