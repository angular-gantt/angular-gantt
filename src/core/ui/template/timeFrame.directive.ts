export default function (GanttDirectiveBuilder) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttTimeFrame')
  builder.controller = function ($scope, $element) {
    $scope.timeFrame.$element = $element
    $scope.timeFrame.$scope = $scope
    $scope.timeFrame.updateView()
  }
  return builder.build()
}
