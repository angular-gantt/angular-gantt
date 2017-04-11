export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttBodyForeground');
  builder.controller = function ($scope, $element) {
    $scope.gantt.body.foreground.$element = $element;
    $scope.gantt.body.foreground.$scope = $scope;
  };
  return builder.build();
}
