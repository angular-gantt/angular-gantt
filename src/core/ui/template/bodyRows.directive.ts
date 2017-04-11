export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttBodyRows');
  builder.controller = function ($scope, $element) {
    $scope.gantt.body.rows.$element = $element;
    $scope.gantt.body.rows.$scope = $scope;
  };
  return builder.build();
}
