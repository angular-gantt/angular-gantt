(function() {
    'use strict';
    angular.module('gantt').service('GanttColumnGenerator', ['moment', function(moment) {

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

        var isToDateToExclude = function(to, value, unit) {
            return moment(to).add(value, unit).startOf(unit) === to;
        };


        var getFirstValue = function(unit) {
            if (['hour', 'minute', 'second', 'millisecond'].indexOf(unit) >= 0) {
                return 0;
            }
        };

        var ensureNoUnitOverflow = function(unit, startDate, endDate) {
            var v1 = startDate.get(unit);
            var v2 = endDate.get(unit);
            var firstValue = getFirstValue(unit);
            if (firstValue !== undefined && v2 !== firstValue && v2 < v1) {
                endDate.set(unit, firstValue);
            }
        };

        // Generates one column for each time unit between the given from and to date.
        this.generate = function(builder, from, to, viewScale, columnWidth, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

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

            var excludeTo = false;
            from = moment(from).startOf(viewScaleUnit);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = moment(to).startOf(viewScaleUnit);
            }

            var left = 0;
            var date = moment(from).startOf(viewScaleUnit);
            if (reverse) {
                date.add(-viewScaleValue, viewScaleUnit);
                left -= columnWidth;
            }
            var generatedCols = [];

            while (true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                var startDate = moment(date);
                var endDate = moment(startDate).add(viewScaleValue, viewScaleUnit);
                ensureNoUnitOverflow(viewScaleUnit, startDate, endDate);

                var column = builder.newColumn(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth);

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
    }]);
}());
