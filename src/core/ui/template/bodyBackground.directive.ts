export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttBodyBackground')
  builder.controller = function ($scope, $element) {
    $scope.gantt.body.background.$element = $element
    $scope.gantt.body.background.$scope = $scope
  }
  return builder.build()
}
