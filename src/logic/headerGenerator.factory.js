'use strict';
gantt.factory('GanttHeaderGenerator', [ 'GanttColumnHeader', function(ColumnHeader) {
    var generateHeader = function(columns, unit) {
        var generatedHeaders = [];
        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.get(unit) !== col.date.get(unit)) {
                header = new ColumnHeader(col.date, unit, col.left, col.width);
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
                var units = [];
                if ($scope.headers === undefined) {
                    units = [$scope.viewScale];
                } else {
                    units = $scope.headers;
                }

                var headers = [];
                angular.forEach(units, function(unit) {
                    headers.push(generateHeader(columns, unit));
                });

                return headers;
            };
        }
    };
}]);
