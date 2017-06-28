export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttHeaderColumns')
  builder.controller = function ($scope, $element) {
    $scope.gantt.header.columns.$element = $element
    $scope.gantt.header.columns.$scope = $scope
  }
  return builder.build()
}
