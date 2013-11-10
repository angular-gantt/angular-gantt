gantt.factory('Task', ['dateFunctions', function (df) {
    var Task = function(id, subject, color, from, to, data) {
        var self = this;

        self.id = id;
        self.subject = subject;
        self.color = color;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;

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