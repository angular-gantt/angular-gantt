'use strict';
gantt.factory('BodyColumns', [function() {
    var BodyColumns = function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return BodyColumns;
}]);
