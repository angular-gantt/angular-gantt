'use strict';
gantt.factory('GanttCurrentDateManager', [function() {
    var GanttCurrentDateManager = function(gantt) {
        var self = this;

        self.gantt = gantt;

        self.date = undefined;
        self.position = undefined;
        self.currentDateColumn = undefined;

        self.gantt.$scope.$watch('currentDate+currentDateValue', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.setCurrentDate(self.gantt.currentDateValue);
            }
        });

        self.setCurrentDate = function(currentDate) {
            self.date = currentDate;
            if (self.currentDateColumn !== undefined) {
                self.currentDateColumn.currentDate = undefined;
                delete self.currentDateColumn;
            }

            if (self.date !== undefined) {
                var column = self.gantt.columnsManager.getColumnByDate(self.date);
                if (column !== undefined) {
                    column.currentDate = self.date;
                    self.currentDateColumn = column;
                }
            }

            self.position = self.gantt.getPositionByDate(self.date);
        };
    };
    return GanttCurrentDateManager;
}]);
