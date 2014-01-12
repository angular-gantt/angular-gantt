gantt.factory('Task', ['dateFunctions', 'binarySearch', function (df, bs) {
    var Task = function(id, row, subject, color, from, to, data) {
        var self = this;

        self.id = id;
        self.gantt = row.gantt;
        self.row = row;
        self.subject = subject;
        self.color = color;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;

        // Updates the pos and size of the task according to the from - to date
        self.updatePosAndSize = function() {
            var cmp =  function(c) { return c.date; };
            var cFrom = bs.get(self.gantt.columns, self.from, cmp);
            var cTo = bs.get(self.gantt.columns, self.to, cmp);

            // Task bounds are calculated according to their time
            self.left = calculateTaskPos(cFrom[0], self.from);
            self.width = Math.round( (calculateTaskPos(cTo[0], self.to) - self.left) * 10) / 10;

            // Set minimal width
            // TODO check if width exceeds the Gantt width
            if (self.width === 0) {
                self.width = cFrom[0].width / self.gantt.columnGenerator.getSubScale();
            }
        };

        // Calculates the position of the task start or end
        // The position is based on the column which is closest to the start (or end) date.
        // This column has a width which is used to calculate the exact position within this column.
        var calculateTaskPos = function(column, date) {
            return Math.round( (column.left + column.width * self.gantt.columnGenerator.getSubScaleFactor(date)) * 10) / 10;
        };

        // Sets the task from date. The from date is adjusted to the current task placement rounding rule
        self.setFrom = function(date) {
            self.from = self.gantt.columnGenerator.adjustDateToSubScale(date);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Sets the task to date. The from date is adjusted to the current task placement rounding rule
        self.setTo = function(date) {
            self.to = self.gantt.columnGenerator.adjustDateToSubScale(date);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Sets the task from date to the specified date and is keeping the existing task length
        self.moveTo = function(date) {
            var taskLength = self.to - self.from;
            self.from = self.gantt.columnGenerator.adjustDateToSubScale(date);
            self.to = df.addMilliseconds(self.from, taskLength, true);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Moves the task from date by the specified time span and keeps the existing task length
        self.moveBy = function(timespan) {
            var newFromDate = df.addMilliseconds(self.from, timespan, true);
            self.moveTo(newFromDate);
        };

        self.copy = function(task) {
            self.gantt = task.gantt;
            self.row = task.row;
            self.subject = task.subject;
            self.color = task.color;
            self.from = df.clone(task.from);
            self.to = df.clone(task.to);
            self.data = task.data;
        };

        self.clone = function() {
            return new Task(self.id, self.row, self.subject, self.color, self.from, self.to, self.data);
        };
    };

    return Task;
}]);