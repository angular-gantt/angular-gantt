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
        };

        // Calculates the position of the task start or end
        // The position is based on the column which is closest to the start (or end) date.
        // This column has a width which is used to calculate the exact position within this column.
        var calculateTaskPos = function(column, date) {
            return Math.round( (column.left + column.width * self.gantt.columnGenerator.getSubScaleFactor(date)) * 10) / 10;
        };

        // Expands the start of the task to the specified position (in em)
        self.setFrom = function(x) {
            if (x > self.left + self.width) {
                x = self.left + self.width;
            }

            self.from = self.row.gantt.getDateByPosition(x);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Expands the end of the task to the specified position (in em)
        self.setTo = function(x) {
            if (x < self.left) {
                x = self.left;
            }

            self.to = self.row.gantt.getDateByPosition(x);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Moves the task to the specified position (in em)
        self.moveTo = function(x) {
            if (x < 0 || x + self.width >= self.row.gantt.width) {
                return;
            }

            var cmp =  function(c) { return c.date; };

            self.from = self.row.gantt.getDateByPosition(x);
            var cFrom = bs.get(self.gantt.columns, self.from, cmp);
            self.left = calculateTaskPos(cFrom[0], self.from);

            self.to = self.row.gantt.getDateByPosition(self.left + self.width);
            var cTo = bs.get(self.gantt.columns, self.to, cmp);
            self.width = Math.round( (calculateTaskPos(cTo[0], self.to) - self.left) * 10) / 10;

            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
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