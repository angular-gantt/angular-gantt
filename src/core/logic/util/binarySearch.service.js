(function(){
    'use strict';
    angular.module('gantt').service('ganttBinarySearch', [ function() {
        // Returns the object on the left and right in an array using the given cmp function.
        // The compare function defined which property of the value to compare (e.g.: c => c.left)

        return {
            getIndicesOnly: function(input, value, comparer, strict) {
                var lo = -1, hi = input.length;
                while (hi - lo > 1) {
                    var mid = Math.floor((lo + hi) / 2);
                    if (strict ? comparer(input[mid]) < value : comparer(input[mid]) <= value) {
                        lo = mid;
                    } else {
                        hi = mid;
                    }
                }
                if (!strict && input[lo] !== undefined && comparer(input[lo]) === value) {
                    hi = lo;
                }
                return [lo, hi];
            },
            get: function(input, value, comparer, strict) {
                var res = this.getIndicesOnly(input, value, comparer, strict);
                return [input[res[0]], input[res[1]]];
            }
        };
    }]);
}());
