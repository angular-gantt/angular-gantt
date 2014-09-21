'use strict';
gantt.service('mouseButton', [ function() {
    // Mouse button cross browser normalization

    return {
        getButton: function(e) {
            e = e || window.event;

            if (!e.which) {
                return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
            } else {
                return e.which;
            }
        }
    };
}]);