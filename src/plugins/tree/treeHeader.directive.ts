require('./treeHeader.tmpl.html')

export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttTreeHeader', 'plugins/tree/treeHeader.tmpl.html')
  return builder.build()
}
