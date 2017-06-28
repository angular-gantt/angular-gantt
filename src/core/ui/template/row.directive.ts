export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttRow')
  builder.controller = function ($scope, $element) {
    $scope.row.$element = $element
    $scope.row.$scope = $scope
  }
  return builder.build()
}
