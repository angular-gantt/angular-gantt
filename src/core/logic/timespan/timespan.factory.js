'use strict';
gantt.factory('GanttTimespan', ['moment', function(moment) {
    var Timespan = function(id, gantt, name, color, classes, priority, from, to, data, est, lct) {
        this.id = id;
        this.gantt = gantt;
        this.name = name;
        this.color = color;
        this.classes = classes;
        this.priority = priority;
        this.from = moment(from);
        this.to = moment(to);
        this.data = data;

        if (est !== undefined && lct !== undefined) {
            this.est = moment(est);  //Earliest Start Time
            this.lct = moment(lct);  //Latest Completion Time
        }
    };

    // Updates the pos and size of the timespan according to the from - to date
    Timespan.prototype.updatePosAndSize = function() {
        this.left = this.gantt.getPositionByDate(this.from);
        this.width = this.gantt.getPositionByDate(this.to) - this.left;
    };

    // Expands the start of the timespan to the specified position (in em)
    Timespan.prototype.setFrom = function(x) {
        this.from = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    // Expands the end of the timespan to the specified position (in em)
    Timespan.prototype.setTo = function(x) {
        this.to = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    // Moves the timespan to the specified position (in em)
    Timespan.prototype.moveTo = function(x) {
        this.from = this.gantt.getDateByPosition(x);
        this.to = this.gantt.getDateByPosition(x + this.width);
        this.updatePosAndSize();
    };

    Timespan.prototype.copy = function(timespan) {
        this.name = timespan.name;
        this.color = timespan.color;
        this.classes = timespan.classes;
        this.priority = timespan.priority;
        this.from = moment(timespan.from);
        this.to = moment(timespan.to);
        this.est = timespan.est !== undefined ? moment(timespan.est) : undefined;
        this.lct = timespan.lct !== undefined ? moment(timespan.lct) : undefined;
        this.data = timespan.data;
    };

    Timespan.prototype.clone = function() {
        return new Timespan(this.id, this.gantt, this.name, this.color, this.classes, this.priority, this.from, this.to, this.data, this.est, this.lct);
    };

    return Timespan;
}]);
