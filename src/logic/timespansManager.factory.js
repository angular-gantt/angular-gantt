'use strict';
gantt.factory('GanttTimespansManager', ['GanttTimespan', 'GANTT_EVENTS', function(Timespan, GANTT_EVENTS) {
    var GanttTimespansManager = function(gantt) {
        var self = this;

        self.gantt = gantt;

        self.timespansMap = {};
        self.timespans = [];

        // Adds or updates timespans
        self.addTimespans = function(timespans) {
            for (var i = 0, l = timespans.length; i < l; i++) {
                var timespanData = timespans[i];
                self.addTimespan(timespanData);
            }
        };

        // Adds a timespan or merges the timespan if there is already one with the same id
        self.addTimespan = function(timespanData) {
            // Copy to new timespan (add) or merge with existing (update)
            var timespan, isUpdate = false;

            if (timespanData.id in self.timespansMap) {
                timespan = self.timespansMap[timespanData.id];
                timespan.copy(timespanData);
                isUpdate = true;
            } else {
                timespan = new Timespan(timespanData.id, self.gantt, timespanData.name, timespanData.color,
                    timespanData.classes, timespanData.priority, timespanData.from, timespanData.to, timespanData.data);
                self.timespansMap[timespanData.id] = timespan;
                self.timespans.push(timespan);
                self.gantt.$scope.$emit(GANTT_EVENTS.TIMESPAN_ADDED, {timespan: timespan});
            }

            timespan.updatePosAndSize();
            return isUpdate;
        };

        // Removes all timespans
        self.removeAllTimespans = function() {
            self.timespansMap = {};
            self.timespans = [];
        };

        self.updateTimespansPosAndSize = function() {
            for (var i = 0, l = self.timespans.length; i < l; i++) {
                self.timespans[i].updatePosAndSize();
            }
        };
    };
    return GanttTimespansManager;
}]);
