require('./sideContentTree.tmpl.html');

export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttSideContentTree', 'plugins/tree/sideContentTree.tmpl.html');
  return builder.build();
}
