'use strict';
gantt.factory('GanttColumnGenerator', [ 'GanttColumn', 'moment', function(Column, moment) {
    var ColumnGenerator = function($scope) {
        var width = $scope.width;
        var columnWidth = $scope.columnWidth;
        var unit = $scope.viewScale;
        var calendar = $scope.calendar;
        var timeFramesWorkingMode = $scope.timeFramesWorkingMode;
        var timeFramesNonWorkingMode = $scope.timeFramesNonWorkingMode;

        var columnMagnetValue;
        var columnMagnetUnit;

        if ($scope.columnMagnet) {
            var splittedColumnMagnet = $scope.columnMagnet.trim().split(' ');
            if (splittedColumnMagnet.length > 1) {
                columnMagnetValue = parseInt(splittedColumnMagnet[0]);
                columnMagnetUnit = splittedColumnMagnet[splittedColumnMagnet.length-1];
            }
        }

        // Generates one column for each time unit between the given from and to date.
        this.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = moment(from).startOf(unit);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = moment(to).startOf(unit);
            }

            var date = moment(from).startOf(unit);
            var generatedCols = [];
            var left = 0;

            while (true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                var startDate = moment(date);
                var endDate = moment(startDate).add(1, unit);

                var column = new Column(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode, columnMagnetValue, columnMagnetUnit);
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
                if (isToDateToExclude(from)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            setWidth(width, left, generatedCols);

            return generatedCols;
        };

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

        var isToDateToExclude = function(to) {
            return moment(to).add(1, unit).startOf(unit) === to;
        };

        var setWidth = function(width, originalWidth, columns) {
            if (width && originalWidth && columns) {

                var widthFactor = Math.abs(width / originalWidth);

                angular.forEach(columns, function(column) {
                    column.left = widthFactor * column.left;
                    column.width = widthFactor * column.width;
                });
            }
        };
    };
    return ColumnGenerator;
}]);
