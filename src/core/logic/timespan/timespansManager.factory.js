(function(){
    'use strict';
    angular.module('gantt').factory('GanttTimespansManager', ['GanttTimespan', function(Timespan) {
        var GanttTimespansManager = function(gantt) {
            var self = this;

            this.gantt = gantt;

            this.timespansMap = {};
            this.timespans = [];

            this.gantt.$scope.$watchCollection('timespans', function(newValue) {
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
                timespans = timespans !== undefined ? [timespans] : [];
            }

            this.gantt.$scope.timespans = timespans;
            for (var i = 0, l = timespans.length; i < l; i++) {
                var timespanModel = timespans[i];
                this.gantt.objectModel.cleanTimespan(timespanModel);
                this.loadTimespan(timespanModel);
            }
        };

        // Adds a timespan or merges the timespan if there is already one with the same id
        GanttTimespansManager.prototype.loadTimespan = function(timespanModel) {
            // Copy to new timespan (add) or merge with existing (update)
            var timespan, isUpdate = false;

            if (timespanModel.id in this.timespansMap) {
                timespan = this.timespansMap[timespanModel.id];
                timespan.model = timespanModel;
                isUpdate = true;
                this.gantt.api.timespans.raise.change(timespan);
            } else {
                timespan = new Timespan(this.gantt, timespanModel);
                this.timespansMap[timespanModel.id] = timespan;
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
                    if (timespan.model.id === timespanId) {
                        removedTimespan = timespan;
                        this.timespans.splice(i, 1); // Remove from array
                        break;
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
}());
