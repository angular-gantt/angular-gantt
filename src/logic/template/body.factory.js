'use strict';
gantt.factory('GanttBody', ['GanttBodyColumns', 'GanttBodyRows', function(BodyColumns, BodyRows) {
    var Body= function(gantt) {
        this.gantt = gantt;

        this.columns = new BodyColumns(this);
        this.rows = new BodyRows(this);

        this.getWidth = function() {
            return this.$element.width();
        };
    };
    return Body;
}]);
