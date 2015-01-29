(function() {
    'use strict';
    angular.module('gantt.table').controller('TableColumnController', ['$scope', function($scope) {
        $scope.getHeader = function() {
            var header = $scope.pluginScope.headers[$scope.column];
            if (header !== undefined) {
                return header;
            }
            if ($scope.pluginScope.headerFormatter !== undefined) {
                header = $scope.pluginScope.headerFormatter($scope.column);
            }
            if (header !== undefined) {
                return header;
            }
            return header;
        };

        $scope.getHeaderContent = function() {
            var headerContent = $scope.pluginScope.headerContents[$scope.column];
            if (headerContent === undefined) {
                return '{{getHeader()}}';
            }
            return headerContent;
        };

        $scope.getClass = function() {
            return $scope.pluginScope.classes[$scope.column];
        };
    }]);
}());

