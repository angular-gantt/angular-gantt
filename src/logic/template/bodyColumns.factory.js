'use strict';
gantt.factory('GanttBodyColumns', [function() {
    var BodyColumns = function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return BodyColumns;
}]);
