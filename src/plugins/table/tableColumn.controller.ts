export default function ($scope) {
  'ngInject'
  $scope.getHeader = function () {
    let header = $scope.pluginScope.headers[$scope.column]
    if (header !== undefined) {
      return header
    }
    if ($scope.pluginScope.headerFormatter !== undefined) {
      header = $scope.pluginScope.headerFormatter($scope.column)
    }
    if (header !== undefined) {
      return header
    }
    return header
  }

  $scope.getHeaderContent = function () {
    let headerContent = $scope.pluginScope.headerContents[$scope.column]
    if (headerContent === undefined) {
      return '{{getHeader()}}'
    }
    return headerContent
  }

  $scope.getClass = function () {
    return $scope.pluginScope.classes[$scope.column]
  }
}
