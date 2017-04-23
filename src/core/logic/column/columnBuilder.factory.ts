import moment from 'moment';

import {GanttColumn} from './column.factory';
import {GanttCalendar, TimeFramesDisplayMode} from '../calendar/calendar.factory';
import {GanttColumnsManager} from './columnsManager.factory';

export class GanttColumnBuilder {
  static GanttColumn: {
    new(date: moment.Moment,
        endDate: moment.Moment,
        left: number,
        width: number,
        calendar: GanttCalendar,
        timeFramesWorkingMode?: TimeFramesDisplayMode,
        timeFramesNonWorkingMode?: TimeFramesDisplayMode): GanttColumn
  };

  private columnsManager: GanttColumnsManager; // TODO: type!

  // Builder for columns, based of data given by column generator and columnsManager.
  constructor(columnsManager: GanttColumnsManager) {
    this.columnsManager = columnsManager;
  };

  /**
   * Builds a new column.
   *
   * @param date
   * @param endDate
   * @param left
   * @param width
   * @returns {GanttColumn}
   */
  newColumn(date, endDate, left, width) {
    let calendar = this.columnsManager.gantt.calendar;
    let timeFramesWorkingMode = this.columnsManager.gantt.options.value('timeFramesWorkingMode');
    let timeFramesNonWorkingMode = this.columnsManager.gantt.options.value('timeFramesNonWorkingMode');

    return new GanttColumn(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
  };
}

export default function (GanttColumn: {
  new(date: moment.Moment,
      endDate: moment.Moment,
      left: number,
      width: number,
      calendar: GanttCalendar,
      timeFramesWorkingMode?: TimeFramesDisplayMode,
      timeFramesNonWorkingMode?: TimeFramesDisplayMode): GanttColumn
}) {
  'ngInject';

  GanttColumnBuilder.GanttColumn = GanttColumn;
  return GanttColumnBuilder;
}
