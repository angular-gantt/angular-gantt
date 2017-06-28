export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttHeader')
  builder.controller = function ($scope, $element) {
    $scope.gantt.header.$element = $element
    $scope.gantt.header.$scope = $scope
  }
  return builder.build()
}
