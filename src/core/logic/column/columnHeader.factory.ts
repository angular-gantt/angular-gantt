import angular from 'angular';

import moment from 'moment';
import {GanttColumn} from './column.factory';

export class GanttColumnHeader extends GanttColumn {
  private name: string;
  private unit: string;
  private label: string;

  constructor(date: moment.Moment,
              endDate: moment.Moment,
              viewScaleUnit: string,
              left: number,
              width: number,
              labelFormat: string | { (GanttColumnHeader): string },
              name: string) {
    super(date, endDate, left, width);

    this.name = name;
    this.unit = viewScaleUnit;
    this.label = angular.isFunction(labelFormat) ? labelFormat(this) : date.format(labelFormat);
  };
}

export default function () {
  'ngInject';

  return GanttColumnHeader;
}
