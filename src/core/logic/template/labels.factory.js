'use strict';
gantt.factory('GanttLabels', [function() {
    var Labels= function(gantt) {
        this.gantt = gantt;
        this.gantt.api.registerEvent('labels', 'resize');
    };
    return Labels;
}]);
