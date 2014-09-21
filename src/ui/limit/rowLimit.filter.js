'use strict';
gantt.filter('ganttRowLimit', ['$filter', function($filter) {
    // Returns only the rows which are visible on the screen
    // Use the rows height and position to decide if a row is still visible
    // TODO

    return function(input, $scope) {
        if ($scope.filterRow) {
            input = $filter('filter')(input, $scope.filterRow, $scope.filterRowComparator);
        }
        return input;
    };
}]);