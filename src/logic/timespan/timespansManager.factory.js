'use strict';
gantt.factory('GanttTimespansManager', ['GanttTimespan', 'GANTT_EVENTS', function(Timespan, GANTT_EVENTS) {
    var GanttTimespansManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.timespansMap = {};
        this.timespans = [];

        this.gantt.$scope.$watch('timespans', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.clearTimespans();
                self.loadTimespans(newValue);
            }
        });
    };

    // Adds or updates timespans
    GanttTimespansManager.prototype.loadTimespans = function(timespans) {
        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanData = timespans[i];
            this.loadTimespan(timespanData);
        }
        this.gantt.columnsManager.updateColumns();
    };

    // Adds a timespan or merges the timespan if there is already one with the same id
    GanttTimespansManager.prototype.loadTimespan = function(timespanData) {
        // Copy to new timespan (add) or merge with existing (update)
        var timespan, isUpdate = false;

        if (timespanData.id in this.timespansMap) {
            timespan = this.timespansMap[timespanData.id];
            timespan.copy(timespanData);
            isUpdate = true;
        } else {
            timespan = new Timespan(timespanData.id, this.gantt, timespanData.name, timespanData.color,
                timespanData.classes, timespanData.priority, timespanData.from, timespanData.to, timespanData.data);
            this.timespansMap[timespanData.id] = timespan;
            this.timespans.push(timespan);
            this.gantt.$scope.$emit(GANTT_EVENTS.TIMESPAN_ADDED, {timespan: timespan});
        }

        timespan.updatePosAndSize();
        return isUpdate;
    };

    // Removes all timespans
    GanttTimespansManager.prototype.clearTimespans = function() {
        this.timespansMap = {};
        this.timespans = [];
    };

    GanttTimespansManager.prototype.updateTimespansPosAndSize = function() {
        for (var i = 0, l = this.timespans.length; i < l; i++) {
            this.timespans[i].updatePosAndSize();
        }
    };

    return GanttTimespansManager;
}]);
