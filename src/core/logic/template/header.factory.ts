export default function (GanttHeaderColumns) {
  'ngInject';
  let Header = function (gantt) {
    this.gantt = gantt;
    this.columns = new GanttHeaderColumns(this);

    this.getHeight = function () {
      return this.$element[0].offsetHeight;
    };
  };
  return Header;
}
