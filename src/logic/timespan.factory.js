'use strict';
gantt.factory('GanttTimespan', ['moment', function(moment) {
    var Timespan = function(id, gantt, name, color, classes, priority, from, to, data, est, lct) {
        var self = this;

        self.id = id;
        self.gantt = gantt;
        self.name = name;
        self.color = color;
        self.classes = classes;
        self.priority = priority;
        self.from = moment(from);
        self.to = moment(to);
        self.data = data;

        if (est !== undefined && lct !== undefined) {
            self.est = moment(est);  //Earliest Start Time
            self.lct = moment(lct);  //Latest Completion Time
        }

        self.hasBounds = function() {
            return self.bounds !== undefined;
        };

        // Updates the pos and size of the timespan according to the from - to date
        self.updatePosAndSize = function() {
            self.left = self.gantt.getPositionByDate(self.from);
            self.width = self.gantt.getPositionByDate(self.to) - self.left;

            if (self.est !== undefined && self.lct !== undefined) {
                self.bounds = {};
                self.bounds.left = self.gantt.getPositionByDate(self.est);
                self.bounds.width = self.gantt.getPositionByDate(self.lct) - self.bounds.left;
            }
        };

        // Expands the start of the timespan to the specified position (in em)
        self.setFrom = function(x) {
            self.from = self.gantt.getDateByPosition(x, true);
            self.updatePosAndSize();
        };

        // Expands the end of the timespan to the specified position (in em)
        self.setTo = function(x) {
            self.to = self.gantt.getDateByPosition(x, false);
            self.updatePosAndSize();
        };

        // Moves the timespan to the specified position (in em)
        self.moveTo = function(x) {
            self.from = self.gantt.getDateByPosition(x, true);
            self.to = self.gantt.getDateByPosition(x + self.width, false);
            self.updatePosAndSize();
        };

        self.copy = function(timespan) {
            self.name = timespan.name;
            self.color = timespan.color;
            self.classes = timespan.classes;
            self.priority = timespan.priority;
            self.from = moment(timespan.from);
            self.to = moment(timespan.to);
            self.est = timespan.est !== undefined ? moment(timespan.est) : undefined;
            self.lct = timespan.lct !== undefined ? moment(timespan.lct) : undefined;
            self.data = timespan.data;
        };

        self.clone = function() {
            return new Timespan(self.id, self.gantt, self.name, self.color, self.classes, self.priority, self.from, self.to, self.data, self.est, self.lct);
        };
    };

    return Timespan;
}]);
