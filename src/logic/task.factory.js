gantt.factory('Task', ['dateFunctions', 'binarySearch', function (df, bs) {
    var Task = function(id, subject, color, from, to, data) {
        var self = this;

        self.id = id;
        self.subject = subject;
        self.color = color;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;

        // Calculate the bounds of a task and publishes it as properties
        self.updateTaskBounds = function(columns, taskPlacement) {
            var cmp =  function(c) { return c.date; };
            var cFrom = bs.get(columns, self.from, cmp);
            var cTo = bs.get(columns, self.to, cmp);

            // Task bounds are calculated according to their time
            self.left = calculateTaskPos(cFrom[0], self.from, taskPlacement);
            self.width = Math.round( (calculateTaskPos(cTo[0], self.to, taskPlacement) - self.left) * 10) / 10;

            // Set minimal width
            if (self.width === 0) {
                self.width = cFrom[0].width / taskPlacement.getPrecision;
            }
        };

        // Calculates the position of the task start or end
        // The position is based on the column which is closest to the start (or end) date.
        // This column has a width which is used to calculate the exact position within this column.
        var calculateTaskPos = function(column, date, taskPlacement) {
            return Math.round( (column.left + column.width * taskPlacement.getPrecisionFactor(date)) * 10) / 10;
        };

        self.copy = function(task) {
            self.subject = task.subject;
            self.color = task.color;
            self.from = df.clone(task.from);
            self.to = df.clone(task.to);
            self.data = task.data;
        };

        self.clone = function() {
            return new Task(self.id, self.subject, self.color, self.from, self.to, self.data);
        };
    };

    return Task;
}]);