(function(){
    'use strict';
    angular.module('gantt').service('ganttMouseButton', [ function() {
        // Mouse button cross browser normalization

        return {
            getButton: function(e) {
                e = e || window.event;

                if (!e.which) {
                    if (e.button === undefined) {
                        return 1;
                    }
                    return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
                } else {
                    return e.which;
                }
            }
        };
    }]);
}());
