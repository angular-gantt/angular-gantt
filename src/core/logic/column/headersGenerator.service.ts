import moment from 'moment';

export default function (GanttColumnHeader) {
  'ngInject';
  let generateHeader = function (columnsManager, headerName) {
    let generatedHeaders = [];
    let header;

    let viewScale = columnsManager.getHeaderScale(headerName);

    let viewScaleValue;
    let viewScaleUnit;
    let splittedViewScale;

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

    if (columnsManager.columns.length > 0) {
      let currentColumn = columnsManager.columns[0];
      let currentDate = moment(currentColumn.date).startOf(viewScaleUnit);

      let maximumDate = moment(columnsManager.columns[columnsManager.columns.length - 1].endDate);

      while (true) {
        let currentPosition = currentColumn.getPositionByDate(currentDate);

        let endDate = moment.min(moment(currentDate).add(viewScaleValue, viewScaleUnit), maximumDate);

        let column = columnsManager.getColumnByDate(endDate);

        let left = column.getPositionByDate(endDate);

        let width = left - currentPosition;

        if (width > 0) {
          let labelFormat = columnsManager.getHeaderFormat(headerName);

          header = new GanttColumnHeader(currentDate, endDate, viewScaleUnit, currentPosition, width, labelFormat, headerName);
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

  this.generate = function (columnsManager) {
    let headerNames = [];
    if (columnsManager.gantt.options.value('headers') === undefined) {
      let viewScale = columnsManager.gantt.options.value('viewScale');
      viewScale = viewScale.trim();
      if (viewScale.charAt(viewScale.length - 1) === 's') {
        viewScale = viewScale.substring(0, viewScale.length - 1);
      }

      let viewScaleUnit;
      let splittedViewScale;

      if (viewScale) {
        splittedViewScale = viewScale.split(' ');
      }
      if (splittedViewScale && splittedViewScale.length > 1) {
        viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
      } else {
        viewScaleUnit = viewScale;
      }

      if (['quarter', 'month'].indexOf(viewScaleUnit) > -1) {
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
      if (['minute', 'second', 'millisecond'].indexOf(viewScaleUnit) > -1) {
        headerNames.push('hour');
      }
      if (['second', 'millisecond'].indexOf(viewScaleUnit) > -1) {
        headerNames.push('minute');
      }
      if (['millisecond'].indexOf(viewScaleUnit) > -1) {
        headerNames.push('second');
      }
      headerNames.push(viewScale);
    } else {
      headerNames = columnsManager.gantt.options.value('headers');
    }

    let headers = [];
    for (let i = 0; i < headerNames.length; i++) {
      headers.push(generateHeader(columnsManager, headerNames[i]));
    }

    return headers;
  };
}
