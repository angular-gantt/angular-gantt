'use strict';
gantt.filter('ganttRowLimit', ['$filter', function($filter) {
    // Returns only the rows which are visible on the screen
    // Use the rows height and position to decide if a row is still visible
    // TODO

    return function(input, filterRow, filterRowComparator) {
        if (filterRow) {
            input = $filter('filter')(input, filterRow, filterRowComparator);
        }
        return input;
    };
}]);
