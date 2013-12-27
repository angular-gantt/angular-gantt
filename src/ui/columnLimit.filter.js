gantt.filter('ganttColumnLimit', [function () {
    // Returns only the columns which are visible on the screen

    var calcClosestIndex = function(a, x) {
        var lo = -1, hi = a.length;
        while (hi - lo > 1) {
            var mid = Math.floor((lo + hi)/2);
            if (a[mid].left <= x) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        if (a[lo] !== undefined && a[lo].left === x) hi = lo;
        return [lo, hi];
    };

     return function(input, scroll_left, scroll_width, show) {
         if (show === true) {
            return [];
         }

        var start = calcClosestIndex(input, scroll_left)[0];
        var end = calcClosestIndex(input, scroll_left + scroll_width)[1];
        return input.slice(start, end);
    };
}]);