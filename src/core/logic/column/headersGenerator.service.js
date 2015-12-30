(function(){
    'use strict';
    angular.module('gantt').service('GanttHeadersGenerator', ['GanttColumnHeader', 'moment', function(ColumnHeader, moment) {
        var generateHeader = function(columnsManager, viewScale) {
            var generatedHeaders = [];
            var header;

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

            var currentColumn = columnsManager.columns[0];
            var currentDate = moment(currentColumn.date).startOf(viewScaleUnit);

            var maximumDate = moment(columnsManager.columns[columnsManager.columns.length - 1].endDate);

            while (true) {
                var currentPosition = currentColumn.getPositionByDate(currentDate);

                var endDate = moment.min(moment(currentDate).add(1, viewScaleUnit), maximumDate);

                var column = columnsManager.getColumnByDate(endDate, true);

                var left = column.getPositionByDate(endDate);

                var width = left - currentPosition;

                if (width > 0) {
                    var labelFormat = columnsManager.getHeaderFormat(viewScaleUnit);

                    header = new ColumnHeader(currentDate, endDate, viewScaleUnit, currentPosition, width, labelFormat);
                    generatedHeaders.push(header);
                }

                if (endDate.isSame(maximumDate) || endDate.isAfter(maximumDate)) {
                    break;
                }

                currentColumn = column;
                currentDate = endDate;
            }

            return generatedHeaders;
        };

        this.generate = function(columnsManager) {
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
                headers.push(generateHeader(columnsManager, unit));
            });

            return headers;
        };
    }]);
}());

