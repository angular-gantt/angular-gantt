'use strict';
gantt.factory('GanttScrollable', [function() {
    var Scrollable = function($element) {
        this.$element = $element;
    };
    return Scrollable;
}]);
