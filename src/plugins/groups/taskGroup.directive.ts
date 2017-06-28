require('./taskGroup.tmpl.html')

export default function (GanttDirectiveBuilder) {
  'ngInject'

  let builder = new GanttDirectiveBuilder('ganttTaskGroup', 'plugins/groups/taskGroup.tmpl.html')
  return builder.build()
}
