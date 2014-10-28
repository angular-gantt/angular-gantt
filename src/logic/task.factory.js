'use strict';
gantt.factory('GanttTask', ['moment', 'GanttTaskProgress', function(moment, TaskProgress) {
    var Task = function(id, row, name, color, classes, priority, from, to, data, est, lct, progress) {
        var self = this;

        self.id = id;
        self.gantt = row.gantt;
        self.row = row;
        self.name = name;
        self.color = color;
        self.classes = classes;
        self.priority = priority;
        self.from = moment(from);
        self.to = moment(to);
        self.truncatedLeft = false;
        self.truncatedRight = false;
        self.data = data;
        if (progress !== undefined) {
            if (typeof progress === 'object') {
                self.progress = new TaskProgress(self, progress.percent, progress.color, progress.classes);
            } else {
                self.progress = new TaskProgress(self, progress);
            }
        }

        if (est !== undefined && lct !== undefined) {
            self.est = moment(est);  //Earliest Start Time
            self.lct = moment(lct);  //Latest Completion Time
        }

        self._fromLabel = undefined;
        self.getFromLabel = function() {
            if (self._fromLabel === undefined) {
                self._fromLabel = self.from.format(self.gantt.$scope.tooltipDateFormat);
            }
            return self._fromLabel;
        };

        self._toLabel = undefined;
        self.getToLabel = function() {
            if (self._toLabel === undefined) {
                self._toLabel = self.to.format(self.gantt.$scope.tooltipDateFormat);
            }
            return self._toLabel;
        };

        self.checkIfMilestone = function() {
            self.isMilestone = self.from - self.to === 0;
        };

        self.checkIfMilestone();

        self.hasBounds = function() {
            return self.bounds !== undefined;
        };

        // Updates the pos and size of the task according to the from - to date
        self.updatePosAndSize = function() {
            self.modelLeft = self.gantt.getPositionByDate(self.from);
            self.modelWidth = self.gantt.getPositionByDate(self.to) - self.modelLeft;

            self.outOfRange = self.modelLeft + self.modelWidth < 0 || self.modelLeft > self.gantt.width;

            self.left = Math.min(Math.max(self.modelLeft, 0), self.gantt.width);
            if (self.modelLeft < 0) {
                self.truncatedLeft = true;
                if (self.modelWidth + self.modelLeft > self.gantt.width) {
                    self.truncatedRight = true;
                    self.width = self.gantt.width;
                } else {
                    self.truncatedRight = false;
                    self.width = self.modelWidth + self.modelLeft;
                }
            } else if (self.modelWidth + self.modelLeft > self.gantt.width) {
                self.truncatedRight = true;
                self.truncatedLeft = false;
                self.width = self.gantt.width - self.modelLeft;
            } else {
                self.truncatedLeft = false;
                self.truncatedRight = false;
                self.width = self.modelWidth;
            }

            if (self.est !== undefined && self.lct !== undefined) {
                self.bounds = {};
                self.bounds.left = self.gantt.getPositionByDate(self.est);
                self.bounds.width = self.gantt.getPositionByDate(self.lct) - self.bounds.left;
            }
        };

        // Expands the start of the task to the specified position (in em)
        self.setFrom = function(x) {
            self.from = self.gantt.getDateByPosition(x, true);
            self._fromLabel = undefined;
            self.row.setFromToByTask(self);
            self.updatePosAndSize();
            self.checkIfMilestone();
        };

        // Expands the end of the task to the specified position (in em)
        self.setTo = function(x) {
            self.to = self.gantt.getDateByPosition(x, true);
            self._toLabel = undefined;
            self.row.setFromToByTask(self);
            self.updatePosAndSize();
            self.checkIfMilestone();
        };

        // Moves the task to the specified position (in em)
        self.moveTo = function(x) {
            self.from = self.gantt.getDateByPosition(x, true);
            self._fromLabel = undefined;
            var newTaskLeft = self.gantt.getPositionByDate(self.from);
            self.to = self.gantt.getDateByPosition(newTaskLeft + self.modelWidth, true);
            self._toLabel = undefined;
            self.row.setFromToByTask(self);
            self.updatePosAndSize();
        };

        self.copy = function(task) {
            self.name = task.name;
            self.color = task.color;
            self.classes = task.classes;
            self.priority = task.priority;
            self.from = moment(task.from);
            self.to = moment(task.to);
            self.est = task.est !== undefined ? moment(task.est) : undefined;
            self.lct = task.lct !== undefined ? moment(task.lct) : undefined;
            self.data = task.data;
            self.isMilestone = task.isMilestone;
        };

        self.clone = function() {
            return new Task(self.id, self.row, self.name, self.color, self.classes, self.priority, self.from, self.to, self.data, self.est, self.lct, self.progress);
        };
    };

    return Task;
}]);
