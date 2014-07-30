gantt.factory('Timespan', ['dateFunctions', function (df) {
    var Timespan = function(id, gantt, subject, color, classes, priority, from, to, data, est, lct) {
        var self = this;

        self.id = id;
        self.gantt = gantt;
        self.subject = subject;
        self.color = color;
        self.classes = classes;
        self.priority = priority;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;

        if(est !== undefined && lct !== undefined){
            self.est = df.clone(est);  //Earliest Start Time
            self.lct = df.clone(lct);  //Latest Completion Time
        }

        self.hasBounds = function() {
            return self.bounds !== undefined;
        };

        // Updates the pos and size of the timespan according to the from - to date
        self.updatePosAndSize = function() {
            self.left = self.gantt.getPositionByDate(self.from);
            self.width = Math.round( (self.gantt.getPositionByDate(self.to) - self.left) * 10) / 10;

            if (self.est !== undefined && self.lct !== undefined) {
                self.bounds = {};
                self.bounds.left = self.gantt.getPositionByDate(self.est);
                self.bounds.width = Math.round( (self.gantt.getPositionByDate(self.lct) - self.bounds.left) * 10) / 10;
            }
        };

        // Expands the start of the timespan to the specified position (in em)
        self.setFrom = function(x) {
            if (x > self.left + self.width) {
                x = self.left + self.width;
            } else if (x < 0) {
                x = 0;
            }

            self.from = self.gantt.getDateByPosition(x, true);
            self.updatePosAndSize();
        };

        // Expands the end of the timespan to the specified position (in em)
        self.setTo = function(x) {
            if (x < self.left) {
                x = self.left;
            } else if (x > self.gantt.width) {
                x = self.gantt.width;
            }

            self.to = self.gantt.getDateByPosition(x, false);
            self.updatePosAndSize();
        };

        // Moves the timespan to the specified position (in em)
        self.moveTo = function(x) {
            if (x < 0) {
                x = 0;
            } else if (x + self.width >= self.gantt.width) {
                x = self.gantt.width - self.width;
            }

            self.from = self.gantt.getDateByPosition(x, true);
            self.left = self.gantt.getPositionByDate(self.from);

            self.to = self.gantt.getDateByPosition(self.left + self.width, false);
            self.width = Math.round( (self.gantt.getPositionByDate(self.to) - self.left) * 10) / 10;
        };

        self.copy = function(timespan) {
            self.subject = timespan.subject;
            self.color = timespan.color;
            self.classes = timespan.classes;
            self.priority = timespan.priority;
            self.from = df.clone(timespan.from);
            self.to = df.clone(timespan.to);
            self.est = timespan.est !== undefined ? df.clone(timespan.est): undefined;
            self.lct = timespan.lct !== undefined ? df.clone(timespan.lct): undefined;
            self.data = timespan.data;
        };

        self.clone = function() {
            return new Timespan(self.id, self.gantt, self.subject, self.color, self.classes, self.priority, self.from, self.to, self.data, self.est, self.lct);
        };
    };

    return Timespan;
}]);