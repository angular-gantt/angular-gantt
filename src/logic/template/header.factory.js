'use strict';
gantt.factory('GanttHeader', [function() {
    var Header= function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };

        this.getHeight = function() {
            return this.$element[0].offsetHeight;
        };
    };
    return Header;
}]);
