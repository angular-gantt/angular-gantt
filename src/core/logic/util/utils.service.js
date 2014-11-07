'use strict';
gantt.service('ganttUtils', [function() {
    return {
        createBoundedWrapper: function(object, method) {
            return function() {
                return method.apply(object, arguments);
            };
        },
        random4: function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        randomUuid: function() {
            return this.random4() + this.random4() + '-' + this.random4() + '-' + this.random4() + '-' +
                this.random4() + '-' + this.random4() + this.random4() + this.random4();
        },
        newId: (function() {
            var seedId = new Date().getTime();
            return function() {
                return seedId += 1;
            };
        })()
    };
}]);
