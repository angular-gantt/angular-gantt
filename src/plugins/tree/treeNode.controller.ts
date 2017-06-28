export default function ($scope) {
  'ngInject'
  $scope.$parent.nodeScopes[$scope.row.model.id] = $scope
  $scope.$on('$destroy', function () {
    delete $scope.$parent.nodeScopes[$scope.row.model.id]
  })

  $scope.$watch('children(row)', function (newValue) {
    if (newValue) {
      // Children rows may have been filtered out
      // So we need to filter the raw hierarchy before displaying children in tree.
      let visibleRows = $scope.row.rowsManager.filteredRows

      let filteredChildrenRows = []
      for (let childRow of newValue) {
        if (visibleRows.indexOf(childRow) > -1) {
          filteredChildrenRows.push(childRow)
        }
      }

      $scope.$parent.childrenRows = filteredChildrenRows
    } else {
      $scope.$parent.childrenRows = newValue
    }
  })

  $scope.isCollapseDisabled = function () {
    return !$scope.$parent.childrenRows || $scope.$parent.childrenRows.length === 0
  }

  $scope.getValue = function () {
    return $scope.row.model.name
  }

  $scope.getRowContent = function () {
    if ($scope.row.model.content !== undefined) {
      return $scope.row.model.content
    }
    if ($scope.pluginScope.content !== undefined) {
      return $scope.pluginScope.content
    }

    let content = $scope.row.rowsManager.gantt.options.value('rowContent')
    if (content === undefined) {
      content = '{{row.model.name}}'
    }
    return content
  }

  $scope.$watch('collapsed', function (newValue) {
    if ($scope.$modelValue._collapsed !== newValue) {
      let oldValue = $scope.$modelValue._collapsed
      $scope.$modelValue._collapsed = newValue // $modelValue contains the Row object
      if (oldValue !== undefined && newValue !== oldValue) {
        $scope.gantt.api.tree.raise.collapsed($scope, $scope.$modelValue, newValue)
        $scope.gantt.api.rows.refresh()
      }
    }
  })
}
