export default function (GanttColumn) {
  'ngInject';
  // Builder for columns, based of data given by column generator and columnsManager.
  let ColumnBuilder = function (columnsManager) {
    this.columnsManager = columnsManager;
  };

  ColumnBuilder.prototype.newColumn = function (date, endDate, left, width) {
    let calendar = this.columnsManager.gantt.calendar;
    let timeFramesWorkingMode = this.columnsManager.gantt.options.value('timeFramesWorkingMode');
    let timeFramesNonWorkingMode = this.columnsManager.gantt.options.value('timeFramesNonWorkingMode');

    return new GanttColumn(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
  };

  return ColumnBuilder;
}
