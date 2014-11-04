'use strict';
gantt.factory('GanttCurrentDateManager', [function() {
    var GanttCurrentDateManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.date = undefined;
        this.position = undefined;
        this.currentDateColumn = undefined;

        this.gantt.$scope.$watchGroup(['currentDate', 'currentDateValue'], function() {
            self.setCurrentDate(self.gantt.$scope.currentDateValue);
        });
    };

    GanttCurrentDateManager.prototype.setCurrentDate = function(currentDate) {
        this.date = currentDate;
        if (this.currentDateColumn !== undefined) {
            this.currentDateColumn.currentDate = undefined;
            delete this.currentDateColumn;
        }

        if (this.date !== undefined) {
            var column = this.gantt.columnsManager.getColumnByDate(this.date);
            if (column !== undefined) {
                column.currentDate = this.date;
                this.currentDateColumn = column;
            }
        }

        this.position = this.gantt.getPositionByDate(this.date);
    };
    return GanttCurrentDateManager;
}]);
