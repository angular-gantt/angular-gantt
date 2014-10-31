'use strict';
gantt.factory('GanttLabels', [function() {
    var Labels= function(gantt) {
        this.gantt = gantt;

        this.gantt.api.registerEvent('labels', 'mousedown');
        this.gantt.api.registerEvent('labels', 'mouseup');
        this.gantt.api.registerEvent('labels', 'click');
        this.gantt.api.registerEvent('labels', 'dblclick');
        this.gantt.api.registerEvent('labels', 'contextmenu');
        this.gantt.api.registerEvent('labels', 'resize');
    };
    return Labels;
}]);
