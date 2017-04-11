require('./taskOverview.tmpl.html');

export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttTaskOverview', 'plugins/groups/taskOverview.tmpl.html');
  builder.controller = function ($scope, $element) {
    $scope.task.$element = $element;
    $scope.task.$scope = $scope;
    $scope.task.updatePosAndSize();
  };
  return builder.build();
}
