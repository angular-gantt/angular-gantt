export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttBody');
  builder.controller = function ($scope, $element) {
    $scope.gantt.body.$element = $element;
    $scope.gantt.body.$scope = $scope;
  };
  return builder.build();
}
