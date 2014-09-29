'use strict';
gantt.factory('Header', [function() {
    var Header= function($element) {
        this.$element = $element;

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return Header;
}]);
