require('./labelsHeader.tmpl.html');

export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttLabelsHeader', 'plugins/labels/labelsHeader.tmpl.html');
  return builder.build();
}
