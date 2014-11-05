'use strict';
gantt.factory('ganttMovableOptions', [function() {
    return {
        initialize: function(options) {

            options.allowMoving = options.allowMoving !== undefined ? !!options.allowMoving : true;
            options.allowResizing = options.allowResizing !== undefined ? !!options.allowResizing : true;
            options.allowRowSwitching = options.allowRowSwitching !== undefined ? !!options.allowRowSwitching : true;

            return options;
        }
    };
}]);
