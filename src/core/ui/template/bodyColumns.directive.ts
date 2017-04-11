export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttBodyColumns');
  builder.controller = function ($scope, $element) {
    $scope.gantt.body.columns.$element = $element;
    $scope.gantt.body.background.$scope = $scope;
  };
  return builder.build();
}
