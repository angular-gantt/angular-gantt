(function(){
    'use strict';
    angular.module('gantt').factory('GanttHeaderGenerator', ['GanttColumnHeader', function(ColumnHeader) {
        var generateHeader = function(columnsManager, columns, viewScale) {
            var generatedHeaders = [];
            var header;
            var prevColDateVal;

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

            for (var i = 0, l = columns.length; i < l; i++) {
                var col = columns[i];
                var colDateVal = col.date.get(viewScaleUnit);
                if (i === 0 || prevColDateVal !== colDateVal) {
                    prevColDateVal = colDateVal;
                    var labelFormat = columnsManager.getHeaderFormat(viewScaleUnit);

                    header = new ColumnHeader(col.date, viewScaleValue, viewScaleUnit, col.originalSize.left, col.originalSize.width, labelFormat);
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
                    viewScale = viewScale.trim();
                    if (viewScale.charAt(viewScale.length - 1) === 's') {
                        viewScale = viewScale.substring(0, viewScale.length - 1);
                    }

                    var viewScaleUnit;
                    var splittedViewScale;

                    if (viewScale) {
                        splittedViewScale = viewScale.split(' ');
                    }
                    if (splittedViewScale && splittedViewScale.length > 1) {
                        viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
                    } else {
                        viewScaleUnit = viewScale;
                    }

                    if (['quarter','month'].indexOf(viewScaleUnit) > -1) {
                        units.push('year');
                    }
                    if (['day', 'week'].indexOf(viewScaleUnit) > -1) {
                        units.push('month');
                    }
                    if (['day'].indexOf(viewScaleUnit) > -1) {
                        units.push('week');
                    }
                    if (['hour'].indexOf(viewScaleUnit) > -1) {
                        units.push('day');
                    }
                    if (['minute', 'second'].indexOf(viewScaleUnit) > -1) {
                        units.push('hour');
                    }
                    if (['second'].indexOf(viewScaleUnit) > -1) {
                        units.push('minute');
                    }
                    units.push(viewScale);
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

