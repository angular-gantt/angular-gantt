'use strict';
gantt.factory('GanttBody', [function() {
    var Body= function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return Body;
}]);
