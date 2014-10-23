'use strict';
gantt.factory('GanttHeader', [function() {
    var Header= function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return Header;
}]);
