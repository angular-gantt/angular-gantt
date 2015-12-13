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

            var currentPosition = 0;
            var maximumDate = moment(columnsManager.columns[columnsManager.columns.length - 1].endDate);

            while (true) {
                var startColumn = columnsManager.getColumnByPosition(currentPosition, true);
                if (startColumn === undefined) {
                    break;
                }

                var startDate = startColumn.getDateByPosition(currentPosition - startColumn.left);

                var endDate = moment.min(moment(startDate).add(1, viewScaleUnit).startOf(viewScaleUnit), maximumDate);

                var endColumn = columnsManager.getColumnByDate(endDate, true);
                if (endColumn === undefined) {
                    break;
                }

                var left = endColumn.getPositionByDate(endDate);

                var width = left - currentPosition;
                var labelFormat = columnsManager.getHeaderFormat(viewScaleUnit);

                header = new ColumnHeader(startDate, endDate, viewScaleUnit, currentPosition, width, labelFormat);
                generatedHeaders.push(header);

                if (endDate.isSame(maximumDate) || endDate.isAfter(maximumDate)) {
                    break;
                }
                currentPosition = left;
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

