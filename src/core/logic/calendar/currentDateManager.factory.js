(function(){
    'use strict';
    angular.module('gantt').factory('GanttCurrentDateManager', ['moment', function(moment) {
        var GanttCurrentDateManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.date = undefined;
            this.position = undefined;
            this.currentDateColumnElement = undefined;

            this.gantt.$scope.simplifyMoment = function(d) {
                return moment.isMoment(d) ? d.unix() : d;
            };

            this.gantt.$scope.$watchGroup(['currentDate', 'simplifyMoment(currentDateValue)'], function(newValues, oldValues) {
                if (newValues !== oldValues) {
                    self.setCurrentDate(self.gantt.options.value('currentDateValue'));
                }
            });
        };

        GanttCurrentDateManager.prototype.setCurrentDate = function(currentDate) {
            this.date = currentDate;
            var oldElement = this.currentDateColumnElement;
            var newElement;

            if (this.date !== undefined && this.gantt.options.value('currentDate') === 'column') {
                var column = this.gantt.columnsManager.getColumnByDate(this.date, true);
                if (column !== undefined && column.$element !== undefined) {
                    newElement = column.$element;
                }
            }
            this.currentDateColumnElement = newElement;

            if (oldElement !== newElement) {
                if (oldElement !== undefined) {
                    oldElement.removeClass('gantt-foreground-col-current-date');
                }
                if (newElement !== undefined) {
                    newElement.addClass('gantt-foreground-col-current-date');
                }
            }

            this.position = this.gantt.getPositionByDate(this.date, true);
        };
        return GanttCurrentDateManager;
    }]);
}());
