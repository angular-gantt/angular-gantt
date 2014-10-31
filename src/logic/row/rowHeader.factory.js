'use strict';
gantt.factory('GanttRowHeader', [function() {
    var RowHeader = function(gantt) {
        this.gantt = gantt;

        this.gantt.api.registerEvent('rowHeader', 'mousedown');
        this.gantt.api.registerEvent('rowHeader', 'mouseup');
        this.gantt.api.registerEvent('rowHeader', 'click');
        this.gantt.api.registerEvent('rowHeader', 'dblclick');
        this.gantt.api.registerEvent('rowHeader', 'contextmenu');
    };
    return RowHeader;
}]);
