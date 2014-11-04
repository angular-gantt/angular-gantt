'use strict';
gantt.factory('GanttTimespansManager', ['GanttTimespan', function(Timespan) {
    var GanttTimespansManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.timespansMap = {};
        this.timespans = [];

        this.gantt.$scope.$watch('timespans', function(newValue) {
            self.clearTimespans();
            self.loadTimespans(newValue);
        });

        this.gantt.api.registerMethod('timespans', 'load', this.loadTimespans, this);
        this.gantt.api.registerMethod('timespans', 'remove', this.removeTimespans, this);
        this.gantt.api.registerMethod('timespans', 'clear', this.clearTimespans, this);

        this.gantt.api.registerEvent('timespans', 'add');
        this.gantt.api.registerEvent('timespans', 'remove');
        this.gantt.api.registerEvent('timespans', 'change');
    };

    // Adds or updates timespans
    GanttTimespansManager.prototype.loadTimespans = function(timespans) {
        if (!angular.isArray(timespans)) {
            timespans = [timespans];
        }

        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanData = timespans[i];
            this.loadTimespan(timespanData);
        }
    };

    // Adds a timespan or merges the timespan if there is already one with the same id
    GanttTimespansManager.prototype.loadTimespan = function(timespanData) {
        // Copy to new timespan (add) or merge with existing (update)
        var timespan, isUpdate = false;

        if (timespanData.id in this.timespansMap) {
            timespan = this.timespansMap[timespanData.id];
            timespan.copy(timespanData);
            isUpdate = true;
            this.gantt.api.timespans.raise.change(timespan);
        } else {
            timespan = new Timespan(timespanData.id, this.gantt, timespanData.name, timespanData.color,
                timespanData.classes, timespanData.priority, timespanData.from, timespanData.to, timespanData.data);
            this.timespansMap[timespanData.id] = timespan;
            this.timespans.push(timespan);
            this.gantt.api.timespans.raise.add(timespan);
        }

        timespan.updatePosAndSize();
        return isUpdate;
    };

    GanttTimespansManager.prototype.removeTimespans = function(timespans) {
        if (!angular.isArray(timespans)) {
            timespans = [timespans];
        }

        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanData = timespans[i];
            // Delete the timespan
            this.removeTimespan(timespanData.id);
        }
        this.updateVisibleObjects();
    };

    GanttTimespansManager.prototype.removeTimespan = function(timespanId) {
        if (timespanId in this.timespansMap) {
            delete this.timespansMap[timespanId]; // Remove from map

            var removedTimespan;
            var timespan;
            for (var i = this.timespans.length - 1; i >= 0; i--) {
                timespan = this.timespans[i];
                if (timespan.id === timespanId) {
                    removedTimespan = timespan;
                    this.timespans.splice(i, 1); // Remove from array
                }
            }

            this.gantt.api.timespans.raise.remove(removedTimespan);
            return removedTimespan;
        }

        return undefined;
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
