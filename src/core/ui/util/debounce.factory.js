(function(){
    'use strict';
    angular.module('gantt').factory('ganttDebounce', ['$timeout', function($timeout) {
        function debounce(fn, timeout, invokeApply) {
            var nthCall = 0;
            return function() {
                var self = this;
                var argz = arguments;
                nthCall++;
                var later = (function(version) {
                    return function() {
                        if (version === nthCall) {
                            return fn.apply(self, argz);
                        }
                    };
                })(nthCall);
                return $timeout(later, timeout, invokeApply === undefined ? true: invokeApply);
            };
        }

        return debounce;
    }]);
}());
