require('./sideContentLabels.tmpl.html');

export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttSideContentLabels', 'plugins/labels/sideContentLabels.tmpl.html');
  return builder.build();
}
