export default function ($scope) {
  'ngInject'
  $scope.getValue = function () {
    let value = $scope.$eval($scope.column, $scope.row)

    let formatter = $scope.pluginScope.formatters[$scope.column]
    if (formatter !== undefined) {
      value = formatter(value, $scope.column, $scope.row)
    }

    return value
  }
  
  //get value of other column, can use in contents template. i.e: contents: { 'model.parentName': '{{getColumnValue("model.name")}} - {{getValue()}}' }
  $scope.getColumnValue = function (column) {
      var value = $scope.$eval(column, $scope.row);

      var formatter = $scope.pluginScope.formatters[column];
      if (formatter !== undefined) {
          value = formatter(value, column, $scope.row);
      }

      return value;
  };

  $scope.getRowContent = function () {
    let content
    if ($scope.row.model.columnContents) {
      content = $scope.row.model.columnContents[$scope.column]
    }
    if (content === undefined && $scope.column === 'model.name') {
      content = $scope.row.model.content
    }
    if (content === undefined) {
      content = $scope.pluginScope.contents[$scope.column]
    }
    if (content === undefined && $scope.column === 'model.name') {
      content = $scope.row.rowsManager.gantt.options.value('rowContent')
    }
    if (content === undefined && $scope.pluginScope.content !== undefined) {
      content = $scope.pluginScope.content
    }
    if (content === undefined) {
      return '{{getValue()}}'
    }
    return content
  }
}
