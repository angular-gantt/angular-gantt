(function() {
    'use strict';
    angular.module('gantt').factory('GanttColumnBuilder', ['GanttColumn', function(Column) {
        // Builder for columns, based of data given by column generator and columnsManager.
        var ColumnBuilder = function(columnsManager) {
            this.columnsManager = columnsManager;
        };

        ColumnBuilder.prototype.newColumn = function(date, endDate, left, width) {
            var calendar = this.columnsManager.gantt.calendar;
            var timeFramesWorkingMode = this.columnsManager.gantt.options.value('timeFramesWorkingMode');
            var timeFramesNonWorkingMode = this.columnsManager.gantt.options.value('timeFramesNonWorkingMode');

            return new Column(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode);
        };

        return ColumnBuilder;
    }]);
}());

