(function() {
    'use strict';
    angular.module('gantt.table').controller('TableController', ['$scope', function($scope) {
        $scope.getValue = function(scope, column) {
            var value = scope.$eval(column, scope.row);

            var formatter = $scope.pluginScope.formatters[column];
            if (formatter !== undefined) {
                value = formatter(value, column, scope.row);
            }

            return value;
        };

        $scope.getHeader = function(scope, column) {
            var header = $scope.pluginScope.headers[column];
            if (header !== undefined) {
                return header;
            }
            var headerFormatter;
            if ($scope.pluginScope.headerFormatter !== undefined) {
                header = headerFormatter(column);
            }
            if (header !== undefined) {
                return header;
            }
            return header;
        };
    }]);
}());

