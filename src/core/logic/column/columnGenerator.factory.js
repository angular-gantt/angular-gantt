(function() {
    'use strict';
    angular.module('gantt').factory('GanttColumnGenerator', ['GanttColumn', 'moment', function(Column, moment) {
        var ColumnGenerator = function(columnsManager) {
            var self = this;

            this.columnsManager = columnsManager;

            // Generates one column for each time unit between the given from and to date.
            self.generate = function(from, to, maximumWidth, leftOffset, reverse) {
                if (!to && !maximumWidth) {
                    throw 'to or maximumWidth must be defined';
                }

                var viewScale = self.columnsManager.gantt.options.value('viewScale');
                viewScale = viewScale.trim();
                if (viewScale.charAt(viewScale.length - 1) === 's') {
                    viewScale = viewScale.substring(0, viewScale.length - 1);
                }
                var viewScaleValue;
                var viewScaleUnit;
                var splittedViewScale;

                if (viewScale) {
                    splittedViewScale = viewScale.split(' ');
                }
                if (splittedViewScale && splittedViewScale.length > 1) {
                    viewScaleValue = parseFloat(splittedViewScale[0]);
                    viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
                } else {
                    viewScaleValue = 1;
                    viewScaleUnit = viewScale;
                }

                var calendar = self.columnsManager.gantt.calendar;
                var timeFramesWorkingMode = self.columnsManager.gantt.options.value('timeFramesWorkingMode');
                var timeFramesNonWorkingMode = self.columnsManager.gantt.options.value('timeFramesNonWorkingMode');
                var columnWidth = self.columnsManager.getColumnsWidth();

                var excludeTo = false;
                from = moment(from).startOf(viewScaleUnit);
                if (to) {
                    excludeTo = isToDateToExclude(to);
                    to = moment(to).startOf(viewScaleUnit);
                }

                var date = moment(from).startOf(viewScaleUnit);
                if (reverse) {
                    date.add(-viewScaleValue, viewScaleUnit);
                }
                var generatedCols = [];
                var left = 0;

                while (true) {
                    if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                        break;
                    }

                    var startDate = moment(date);
                    var endDate = moment(startDate).add(viewScaleValue, viewScaleUnit);
                    ensureNoUnitOverflow(viewScaleUnit, startDate, endDate);

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
                    if (reverse) {
                        date.add(-viewScaleValue, viewScaleUnit);
                        ensureNoUnitOverflow(viewScaleUnit, date, startDate);
                    } else {
                        date.add(viewScaleValue, viewScaleUnit);
                        ensureNoUnitOverflow(viewScaleUnit, startDate, date);
                    }
                }

                if (reverse) {
                    if (isToDateToExclude(from, viewScaleValue, viewScaleUnit)) {
                        generatedCols.shift();
                    }
                    generatedCols.reverse();
                }

                return generatedCols;
            };

            // Columns are generated including or excluding the to date.
            // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

            var isToDateToExclude = function(to, value, unit) {
                return moment(to).add(value, unit).startOf(unit) === to;
            };

            var ensureNoUnitOverflow = function(unit, startDate, endDate) {
                var v1 = startDate.get(unit);
                var v2 = endDate.get(unit);
                if (v2 !== 0 && v2 < v1) {
                    endDate.set(unit, 0);
                }
            };
        };
        return ColumnGenerator;
    }]);
}());
