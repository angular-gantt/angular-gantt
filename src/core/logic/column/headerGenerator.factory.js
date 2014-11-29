(function(){
    'use strict';
    angular.module('gantt').factory('GanttHeaderGenerator', ['GanttColumnHeader', function(ColumnHeader) {
        var generateHeader = function(columnsManager, columns, unit) {
            var generatedHeaders = [];
            var header;
            var prevColDateVal;

            for (var i = 0, l = columns.length; i < l; i++) {
                var col = columns[i];
                var colDateVal = col.date.get(unit);
                if (i === 0 || prevColDateVal !== colDateVal) {
                    prevColDateVal = colDateVal;
                    var labelFormat = columnsManager.getHeaderFormat(unit);

                    header = new ColumnHeader(col.date, unit, col.originalSize.left, col.originalSize.width, labelFormat);
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

        return function(columnsManager) {
            this.generate = function(columns) {
                var units = [];
                if (columnsManager.gantt.options.value('headers') === undefined) {
                    var viewScale = columnsManager.gantt.options.value('viewScale');
                    units = [];
                    if (['year', 'quarter', 'month'].indexOf(viewScale) > -1) {
                        units.push('year');
                    }
                    if (['quarter'].indexOf(viewScale) > -1) {
                        units.push('quarter');
                    }
                    if (['day', 'week', 'month'].indexOf(viewScale) > -1) {
                        units.push('month');
                    }
                    if (['day', 'week'].indexOf(viewScale) > -1) {
                        units.push('week');
                    }
                    if (['hour', 'day'].indexOf(viewScale) > -1) {
                        units.push('day');
                    }
                    if (['hour', 'minute', 'second'].indexOf(viewScale) > -1) {
                        units.push('hour');
                    }
                    if (['minute', 'second'].indexOf(viewScale) > -1) {
                        units.push('minute');
                    }
                    if (['second'].indexOf(viewScale) > -1) {
                        units.push('second');
                    }
                    if (units.length === 0) {
                        units.push(viewScale);
                    }
                } else {
                    units = columnsManager.gantt.options.value('headers');
                }

                var headers = [];
                angular.forEach(units, function(unit) {
                    headers.push(generateHeader(columnsManager, columns, unit));
                });

                return headers;
            };
        };
    }]);
}());

