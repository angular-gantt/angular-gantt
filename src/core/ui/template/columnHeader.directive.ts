export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttColumnHeader')
  builder.controller = function ($scope, $element) {
    $scope.column.$element = $element
    $scope.column.$scope = $scope
    $scope.column.updateView()
  }
  return builder.build()
}
