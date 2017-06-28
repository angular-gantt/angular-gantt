export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttSide')
  builder.controller = function ($scope, $element) {
    $scope.gantt.side.$element = $element
    $scope.gantt.side.$scope = $scope
  }
  return builder.build()
}
