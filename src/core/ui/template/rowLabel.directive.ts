export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttRowLabel')
  builder.restrict = 'A'
  builder.templateUrl = undefined
  return builder.build()
}
