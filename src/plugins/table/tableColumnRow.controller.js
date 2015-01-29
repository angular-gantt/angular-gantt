(function() {
    'use strict';
    angular.module('gantt.table').controller('TableColumnRowController', ['$scope', function($scope) {
        $scope.getValue = function() {
            var value = $scope.$eval($scope.column, $scope.row);

            var formatter = $scope.pluginScope.formatters[$scope.column];
            if (formatter !== undefined) {
                value = formatter(value, $scope.column, $scope.row);
            }

            return value;
        };

        $scope.getRowContent = function() {
            var content;
            if ($scope.column === 'model.name') {
                content = $scope.row.model.content;
            }
            if (content === undefined) {
                content = $scope.pluginScope.contents[$scope.column];
            }
            if (content === undefined) {
                return '{{getValue()}}';
            }
            return content;
        };
    }]);
}());

