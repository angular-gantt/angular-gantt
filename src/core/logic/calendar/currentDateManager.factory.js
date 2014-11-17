(function(){
    'use strict';
    angular.module('gantt').factory('GanttCurrentDateManager', [function() {
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
                if (this.currentDateColumn.$element !== undefined) {
                    this.currentDateColumn.$element.removeClass('gantt-foreground-col-current-date');
                }
                delete this.currentDateColumn;
            }

            if (this.date !== undefined) {
                var column = this.gantt.columnsManager.getColumnByDate(this.date);
                if (column !== undefined) {
                    this.currentDateColumn = column;
                    if (this.gantt.$scope.currentDate === 'column' && this.currentDateColumn.$element !== undefined) {
                        this.currentDateColumn.$element.addClass('gantt-foreground-col-current-date');
                    }
                }
            }

            this.position = this.gantt.getPositionByDate(this.date);
        };
        return GanttCurrentDateManager;
    }]);
    /* code */
}());
