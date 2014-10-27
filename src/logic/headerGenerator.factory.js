'use strict';
gantt.factory('GanttHeaderGenerator', ['GanttColumnHeader', function(ColumnHeader) {
    var generateHeader = function(headerFormatFunction, columns, unit) {
        var generatedHeaders = [];
        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.get(unit) !== col.date.get(unit)) {
                var label = col.date.format(headerFormatFunction(unit));
                header = new ColumnHeader(col.date, unit, col.originalSize.left, col.originalSize.width, label);
                header.left = col.left;
                header.width = col.width;
                generatedHeaders.push(header);
            } else {
                header.originalSize.width += col.originalSize.width;
                header.width += col.width;
            }
        }
        return generatedHeaders;
    };

    return function($scope) {
        this.generate = function(columns) {
            var units = [];
            if ($scope.headers === undefined) {
                units = [];
                if (['year', 'quarter', 'month'].indexOf($scope.viewScale) > -1) {
                    units.push('year');
                }
                if (['quarter'].indexOf($scope.viewScale) > -1) {
                    units.push('quarter');
                }
                if (['day', 'week', 'month'].indexOf($scope.viewScale) > -1) {
                    units.push('month');
                }
                if (['day', 'week'].indexOf($scope.viewScale) > -1) {
                    units.push('week');
                }
                if (['hour', 'day'].indexOf($scope.viewScale) > -1) {
                    units.push('day');
                }
                if (['hour', 'minute', 'second'].indexOf($scope.viewScale) > -1) {
                    units.push('hour');
                }
                if (['minute', 'second'].indexOf($scope.viewScale) > -1) {
                    units.push('minute');
                }
                if (['second'].indexOf($scope.viewScale) > -1) {
                    units.push('second');
                }
                if (units.length === 0) {
                    units.push($scope.viewScale);
                }
            } else {
                units = $scope.headers;
            }

            var headers = [];
            angular.forEach(units, function(unit) {
                headers.push(generateHeader($scope.getHeaderFormat, columns, unit));
            });

            return headers;
        };
    };
}]);
