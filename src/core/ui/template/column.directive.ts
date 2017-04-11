export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttColumn');
  builder.controller = function ($scope, $element) {
    $scope.column.$element = $element;
    $scope.column.$scope = $scope;
    $scope.column.updateView();
  };
  return builder.build();
}
