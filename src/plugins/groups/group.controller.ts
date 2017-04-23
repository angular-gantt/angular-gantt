import GanttUtilsService from '../../core/logic/util/utils.service';

export default function ($scope, GanttTaskGroup, ganttUtils: GanttUtilsService) {
  'ngInject';
  let updateTaskGroup = function () {
    let rowGroups = $scope.row.model.groups;

    if (typeof(rowGroups) === 'boolean') {
      rowGroups = {enabled: rowGroups};
    }

    let enabledValue = ganttUtils.firstProperty([rowGroups], 'enabled', $scope.pluginScope.enabled);
    if (enabledValue) {
      $scope.display = ganttUtils.firstProperty([rowGroups], 'display', $scope.pluginScope.display);
      $scope.taskGroup = new GanttTaskGroup($scope.row, $scope.pluginScope);

      $scope.row.setFromTo();
      $scope.row.setFromToByValues($scope.taskGroup.from, $scope.taskGroup.to);
    } else {
      $scope.taskGroup = undefined;
      $scope.display = undefined;
    }
  };

  $scope.gantt.api.tasks.on.viewChange($scope, function (task) {
    if ($scope.taskGroup !== undefined) {
      if ($scope.taskGroup.tasks.indexOf(task) > -1) {
        updateTaskGroup();
        if (!$scope.$$phase && !$scope.$root.$$phase) {
          $scope.$digest();
        }
      } else {
        let descendants = $scope.pluginScope.hierarchy.descendants($scope.row);
        if (descendants.indexOf(task.row) > -1) {
          updateTaskGroup();
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$digest();
          }
        }
      }
    }
  });

  let removeWatch = $scope.pluginScope.$watch('display', updateTaskGroup);

  $scope.$watchCollection('gantt.rowsManager.filteredRows', updateTaskGroup);

  $scope.gantt.api.columns.on.refresh($scope, updateTaskGroup);

  $scope.$on('$destroy', removeWatch);
}
