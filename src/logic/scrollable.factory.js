'use strict';
gantt.factory('Scrollable', [function() {
    var Scrollable = function($element) {
        this.$element = $element;
    };
    return Scrollable;
}]);
