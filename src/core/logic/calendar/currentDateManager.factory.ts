import moment from 'moment';

import {GanttColumn} from '../column/column.factory';
import {Gantt} from '../gantt.factory';

export class GanttCurrentDateManager {
  private gantt: Gantt;
  private position: number;
  private date: any;
  private currentDateColumn: GanttColumn;

  constructor(gantt: Gantt) {
    this.gantt = gantt;

    this.date = undefined;
    this.position = undefined;
    this.currentDateColumn = undefined;

    this.gantt.$scope.simplifyMoment = (d) => {
      return moment.isMoment(d) ? d.unix() : d;
    };

    this.gantt.$scope.$watchGroup(['currentDate', 'simplifyMoment(currentDateValue)'], (newValues, oldValues) => {
      if (newValues !== oldValues) {
        this.setCurrentDate(this.gantt.options.value('currentDateValue'));
      }
    });
  };

  setCurrentDate(currentDate) {
    this.date = currentDate;

    let oldColumn = this.currentDateColumn;
    let newColumn;

    if (this.date !== undefined && this.gantt.options.value('currentDate') === 'column') {
      newColumn = this.gantt.columnsManager.getColumnByDate(this.date, true);
    }

    this.currentDateColumn = newColumn;

    if (oldColumn !== newColumn) {
      if (oldColumn !== undefined) {
        oldColumn.currentDate = false;
        oldColumn.updateView();
      }
      if (newColumn !== undefined) {
        newColumn.currentDate = true;
        newColumn.updateView();
      }
    }

    this.position = this.gantt.getPositionByDate(this.date, true);
  };
}

export default function () {
  'ngInject';

  return GanttCurrentDateManager;
}
