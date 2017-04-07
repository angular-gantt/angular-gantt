(function(){
    'use strict';
    angular.module('gantt').service('GanttHeadersGenerator', ['GanttColumnHeader', 'moment', function(ColumnHeader, moment) {
        var generateHeader = function(columnsManager, headerName) {
            var generatedHeaders = [];
            var header;

            var viewScale = columnsManager.getHeaderScale(headerName);

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

            if(columnsManager.columns.length > 0){
                var currentColumn = columnsManager.columns[0];
                var currentDate = moment(currentColumn.date).startOf(viewScaleUnit);

                var maximumDate = moment(columnsManager.columns[columnsManager.columns.length - 1].endDate);

                while (true) {
                    var currentPosition = currentColumn.getPositionByDate(currentDate);

                    var endDate = moment.min(moment(currentDate).add(viewScaleValue, viewScaleUnit), maximumDate);

                    var column = columnsManager.getColumnByDate(endDate);

                    var left = column.getPositionByDate(endDate);

                    var width = left - currentPosition;

                    if (width > 0) {
                        var labelFormat = columnsManager.getHeaderFormat(headerName);

                        header = new ColumnHeader(currentDate, endDate, viewScaleUnit, currentPosition, width, labelFormat, headerName);
                        generatedHeaders.push(header);
                    }

                    if (endDate.isSame(maximumDate) || endDate.isAfter(maximumDate)) {
                        break;
                    }

                    currentColumn = column;
                    currentDate = endDate;
                }
            }


            return generatedHeaders;
        };

        this.generate = function(columnsManager) {
            var headerNames = [];
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
                    headerNames.push('year');
                }
                if (['day', 'week'].indexOf(viewScaleUnit) > -1) {
                    headerNames.push('month');
                }
                if (['day'].indexOf(viewScaleUnit) > -1) {
                    headerNames.push('week');
                }
                if (['hour'].indexOf(viewScaleUnit) > -1) {
                    headerNames.push('day');
                }
                if (['minute', 'second'].indexOf(viewScaleUnit) > -1) {
                    headerNames.push('hour');
                }
                if (['second'].indexOf(viewScaleUnit) > -1) {
                    headerNames.push('minute');
                }
                headerNames.push(viewScale);
            } else {
                headerNames = columnsManager.gantt.options.value('headers');
            }

            var headers = [];
            for (var i=0; i<headerNames.length; i++) {
                headers.push(generateHeader(columnsManager, headerNames[i]));
            }

            return headers;
        };
    }]);
}());

