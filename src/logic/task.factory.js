gantt.factory('Task', ['dateFunctions', function (df) {
    var Task = function(id, gantt, row, subject, color, from, to, data) {
        var self = this;

        self.id = id;
        self.gantt = gantt;
        self.row = row;
        self.subject = subject;
        self.color = color;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;

        // Updates the pos and size of the task according to the from - to date
        self.updatePosAndSize = function() {
            self.gantt.taskPlacement.placeTask(self, self.gantt.columns);
        };

        // Sets the task from date. The from date is adjusted to the current task placement precision rule
        self.setFrom = function(date) {
            self.from = self.gantt.taskPlacement.calculateDate(date);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
        };

        // Sets the task to date. The from date is adjusted to the current task placement precision rule
        self.setTo = function(date) {
            self.to = self.gantt.taskPlacement.calculateDate(date);
            self.row.setMinMaxDateByTask(self);
            self.gantt.expandColumns(self.from, self.to);
            self.updatePosAndSize();
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
            return new Task(self.id, self.gantt, self.row, self.subject, self.color, self.from, self.to, self.data);
        };
    };

    return Task;
}]);