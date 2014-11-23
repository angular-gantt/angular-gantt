(function(){
    'use strict';
    angular.module('gantt').filter('ganttColumnLimit', [ 'ganttBinarySearch', function(bs) {
        // Returns only the columns which are visible on the screen
        var leftComparator = function(c) {
            return c.left;
        };

        return function(input, gantt) {
            var scrollLeft = gantt.scroll.getScrollLeft();
            var scrollContainerWidth = gantt.scroll.getScrollContainerWidth();

            if (scrollContainerWidth > 0) {
                var start = bs.getIndicesOnly(input, scrollLeft, leftComparator)[0];
                var end = bs.getIndicesOnly(input, scrollLeft + scrollContainerWidth, leftComparator)[1];
                return input.slice(start, end);
            } else {
                return input.slice();
            }


        };
    }]);
}());

