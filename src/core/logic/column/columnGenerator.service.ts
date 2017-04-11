import moment from 'moment';

export default function () {
  'ngInject';

  // Columns are generated including or excluding the to date.
  // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

  let isToDateToExclude = function (to, value, unit) {
    return moment(to).add(value, unit).startOf(unit) === to;
  };

  let getFirstValue = function (unit) {
    if (['hour', 'minute', 'second', 'millisecond'].indexOf(unit) >= 0) {
      return 0;
    }
  };

  let ensureNoUnitOverflow = function (unit, startDate, endDate) {
    let v1 = startDate.get(unit);
    let v2 = endDate.get(unit);
    let firstValue = getFirstValue(unit);
    if (firstValue !== undefined && v2 !== firstValue && v2 < v1) {
      endDate.set(unit, firstValue);
    }
  };

  // Generates one column for each time unit between the given from and to date.
  this.generate = function (builder, from, to, viewScale, columnWidth, maximumWidth, leftOffset, reverse) {
    if (!to && !maximumWidth) {
      throw 'to or maximumWidth must be defined';
    }

    viewScale = viewScale.trim();
    if (viewScale.charAt(viewScale.length - 1) === 's') {
      viewScale = viewScale.substring(0, viewScale.length - 1);
    }
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

    let excludeTo = false;
    from = moment(from).startOf(viewScaleUnit);
    if (to) {
      excludeTo = isToDateToExclude(to, viewScaleValue, viewScaleUnit);
      to = moment(to).startOf(viewScaleUnit);
    }

    let left = 0;
    let date = moment(from).startOf(viewScaleUnit);
    if (reverse) {
      date.add(-viewScaleValue, viewScaleUnit);
      left -= columnWidth;
    }
    let generatedCols = [];

    while (true) {
      if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
        break;
      }

      let startDate = moment(date);
      let endDate = moment(startDate).add(viewScaleValue, viewScaleUnit);
      ensureNoUnitOverflow(viewScaleUnit, startDate, endDate);

      let column = builder.newColumn(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth);

      if (!column.cropped) {
        generatedCols.push(column);
        if (reverse) {
          left -= columnWidth;
        } else {
          left += columnWidth;
        }
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
      if (reverse) {
        date.add(-viewScaleValue, viewScaleUnit);
        ensureNoUnitOverflow(viewScaleUnit, date, startDate);
      } else {
        date.add(viewScaleValue, viewScaleUnit);
        ensureNoUnitOverflow(viewScaleUnit, startDate, date);
      }
    }

    if (reverse) {
      if (isToDateToExclude(from, viewScaleValue, viewScaleUnit)) {
        generatedCols.shift();
      }
      generatedCols.reverse();
    }

    return generatedCols;
  };
}
