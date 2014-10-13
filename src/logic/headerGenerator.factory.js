'use strict';
gantt.factory('HeaderGenerator', [ 'Column', 'moment', function(Column, moment) {

    var generateHourHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.hour() !== col.date.hour()) {
                header = new Column.Hour(moment(col.date), col.left, col.width, col.isWeekend, col.isWorkHour);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateDayHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.day() !== col.date.day()) {
                header = new Column.Day(moment(col.date), col.left, col.width, col.isWeekend, col.daysToNextWorkingDay, col.daysToPrevWorkingDay);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateWeekHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.week() !== col.date.week()) {
                header = new Column.Week(moment(col.date), col.left, col.width, col.date.week());
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    var generateMonthHeader = function(columns) {
        var generatedHeaders = [];

        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.month() !== col.date.month()) {
                header = new Column.Month(moment(col.date), col.left, col.width);
                generatedHeaders.push(header);
            } else {
                header.width += col.width;
            }
        }

        return generatedHeaders;
    };

    return {
        instance: function($scope) {
            this.generate = function(columns) {
                var headers = {};
                if ($scope.headerShowHour && ['hour'].indexOf($scope.viewScale) > -1) {
                    headers.hour = generateHourHeader(columns);
                }
                if ($scope.headerShowDay && ['hour', 'day'].indexOf($scope.viewScale) > -1) {
                    headers.day = generateDayHeader(columns);
                }
                if ($scope.headerShowWeek && ['day', 'week'].indexOf($scope.viewScale) > -1) {
                    headers.week = generateWeekHeader(columns);
                }
                if ($scope.headerShowMonth && ['day', 'week', 'month'].indexOf($scope.viewScale) > -1) {
                    headers.month = generateMonthHeader(columns);
                }
                return headers;
            };
        }
    };
}]);
