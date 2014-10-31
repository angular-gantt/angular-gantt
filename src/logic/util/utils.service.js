'use strict';
gantt.service('ganttUtils', [function() {
    return {
        createBoundedWrapper: function(object, method) {
            return function() {
                return method.apply(object, arguments);
            };
        },
        newId: (function() {
            var seedId = new Date().getTime();
            return function() {
                return seedId += 1;
            };
        })()
    };
}]);
