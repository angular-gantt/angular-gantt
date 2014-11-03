'use strict';
gantt.factory('GanttRowHeader', [function() {
    var RowHeader = function(gantt) {
        this.gantt = gantt;

        this.gantt.api.registerEvent('rowHeaders', 'mousedown');
        this.gantt.api.registerEvent('rowHeaders', 'mouseup');
        this.gantt.api.registerEvent('rowHeaders', 'click');
        this.gantt.api.registerEvent('rowHeaders', 'dblclick');
        this.gantt.api.registerEvent('rowHeaders', 'contextmenu');
    };
    return RowHeader;
}]);
