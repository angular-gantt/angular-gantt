gantt.factory('Task', ['dateFunctions', function (df) {
    var Task = function(id, row, subject, color, classes, priority, from, to, data, est, lct, onDraw) {
        var self = this;

        self.id = id;
        self.gantt = row.gantt;
        self.row = row;
        self.subject = subject;
        self.color = color;
        self.classes = classes;
        self.priority = priority;
        self.from = df.clone(from);
        self.to = df.clone(to);
        self.data = data;
		
		//Draw Event with Mouse
		self.onDraw = onDraw;

        if(est !== undefined && lct !== undefined){
            self.est = df.clone(est);  //Earliest Start Time
            self.lct = df.clone(lct);  //Latest Completion Time
        }

        self.checkIfMilestone = function() {
            self.isMilestone = self.from - self.to === 0;
        };

        self.checkIfMilestone();

        self.hasBounds = function() {
            return self.bounds !== undefined;
        };

        // Updates the pos and size of the task according to the from - to date
        self.updatePosAndSize = function() {
            self.left = self.gantt.getPositionByDate(self.from);
            self.width = Math.round( (self.gantt.getPositionByDate(self.to) - self.left) * 10) / 10;

            if (self.est !== undefined && self.lct !== undefined) {
                self.bounds = {};
                self.bounds.left = self.gantt.getPositionByDate(self.est);
                self.bounds.width = Math.round( (self.gantt.getPositionByDate(self.lct) - self.bounds.left) * 10) / 10;
            }
        };

        // Expands the start of the task to the specified position (in em)
        self.setFrom = function(x) {
            if (x > self.left + self.width) {
                x = self.left + self.width;
            } else if (x < 0) {
                x = 0;
            }

            self.from = self.gantt.getDateByPosition(x, true);
            self.row.setMinMaxDateByTask(self);
            self.updatePosAndSize();
            self.checkIfMilestone();
        };

        // Expands the end of the task to the specified position (in em)
        self.setTo = function(x) {
            if (x < self.left) {
                x = self.left;
            } else if (x > self.gantt.width) {
                x = self.gantt.width;
            }

            self.to = self.gantt.getDateByPosition(x, false);
            self.row.setMinMaxDateByTask(self);
            self.updatePosAndSize();
            self.checkIfMilestone();
        };

        // Moves the task to the specified position (in em)
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

            self.row.setMinMaxDateByTask(self);
        };

        self.copy = function(task) {
            self.subject = task.subject;
            self.color = task.color;
            self.classes = task.classes;
            self.priority = task.priority;
            self.from = df.clone(task.from);
            self.to = df.clone(task.to);
            self.est = task.est !== undefined ? df.clone(task.est): undefined;
            self.lct = task.lct !== undefined ? df.clone(task.lct): undefined;
            self.data = task.data;
            self.isMilestone = task.isMilestone;
			self.onDrag = task.onDrag;
        };

        self.clone = function() {
            return new Task(self.id, self.row, self.subject, self.color, self.classes, self.priority, self.from, self.to, self.data, self.est, self.lct, self.onDraw);
        };
    };

    return Task;
}]);