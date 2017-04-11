export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttTimespan');
  builder.controller = function ($scope, $element) {
    $scope.timespan.$element = $element;
    $scope.timespan.$scope = $scope;
    $scope.timespan.updateView();
  };
  return builder.build();
}
