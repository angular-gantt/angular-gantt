export default function ($scope) {
  'ngInject';
  let collapseAll = function () {
    $scope.$broadcast('angular-ui-tree:collapse-all');
  };

  let expandAll = function () {
    $scope.$broadcast('angular-ui-tree:expand-all');
  };

  $scope.gantt.api.registerMethod('tree', 'collapseAll', collapseAll, $scope);
  $scope.gantt.api.registerMethod('tree', 'expandAll', expandAll, $scope);
}
