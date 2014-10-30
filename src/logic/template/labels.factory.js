'use strict';
gantt.factory('GanttLabels', [function() {
    var Labels= function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.getWidth = function() {
            return self.$element.width();
        };
    };
    return Labels;
}]);
