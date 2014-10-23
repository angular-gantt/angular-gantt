'use strict';
gantt.factory('GanttBodyRows', [function() {
    var BodyRows = function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return BodyRows;
}]);
