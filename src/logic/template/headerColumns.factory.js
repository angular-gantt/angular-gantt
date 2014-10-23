'use strict';
gantt.factory('GanttHeaderColumns', [function() {
    var HeaderColumns = function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return HeaderColumns;
}]);
