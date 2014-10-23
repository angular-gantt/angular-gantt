'use strict';
gantt.filter('ganttColumnLimit', [ 'ganttBinarySearch', function(bs) {
    // Returns only the columns which are visible on the screen

    return function(input, scrollLeft, scrollWidth) {
        var cmp = function(c) {
            return c.left;
        };
        var start = bs.getIndicesOnly(input, scrollLeft, cmp)[0];
        var end = bs.getIndicesOnly(input, scrollLeft + scrollWidth, cmp)[1];
        return input.slice(start, end);
    };
}]);
