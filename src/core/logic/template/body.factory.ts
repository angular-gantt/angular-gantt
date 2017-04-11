export default function (GanttBodyColumns, GanttBodyRows, GanttBodyBackground, GanttBodyForeground) {
  'ngInject';
  let Body = function (gantt) {
    this.gantt = gantt;

    this.background = new GanttBodyBackground(this);
    this.foreground = new GanttBodyForeground(this);
    this.columns = new GanttBodyColumns(this);
    this.rows = new GanttBodyRows(this);
  };
  return Body;
}
