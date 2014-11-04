'use strict';
gantt.factory('GanttTask', ['moment', 'GanttTaskProgress', function(moment, TaskProgress) {
    var Task = function(id, row, name, color, classes, priority, from, to, data, est, lct, progress) {
        this.id = id;
        this.rowsManager = row.rowsManager;
        this.row = row;
        this.name = name;
        this.color = color;
        this.classes = classes;
        this.priority = priority;
        this.from = moment(from);
        this.to = moment(to);
        this.truncatedLeft = false;
        this.truncatedRight = false;
        this.data = data;

        if (progress !== undefined) {
            if (typeof progress === 'object') {
                this.progress = new TaskProgress(this, progress.percent, progress.color, progress.classes);
            } else {
                this.progress = new TaskProgress(this, progress);
            }
        }

        if (est !== undefined && lct !== undefined) {
            this.est = moment(est);  //Earliest Start Time
            this.lct = moment(lct);  //Latest Completion Time
        }

        this._fromLabel = undefined;
        this._toLabel = undefined;
    };


    Task.prototype.getFromLabel = function() {
        if (this._fromLabel === undefined) {
            this._fromLabel = this.from.format(this.rowsManager.gantt.$scope.tooltipDateFormat);
        }
        return this._fromLabel;
    };

    Task.prototype.getToLabel = function() {
        if (this._toLabel === undefined) {
            this._toLabel = this.to.format(this.rowsManager.gantt.$scope.tooltipDateFormat);
        }
        return this._toLabel;
    };

    Task.prototype.checkIfMilestone = function() {
        this.isMilestone = this.from - this.to === 0;
    };

    Task.prototype.checkIfMilestone();

    // Updates the pos and size of the task according to the from - to date
    Task.prototype.updatePosAndSize = function() {
        this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.from);
        this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.to) - this.modelLeft;

        this.outOfRange = this.modelLeft + this.modelWidth < 0 || this.modelLeft > this.rowsManager.gantt.width;

        this.left = Math.min(Math.max(this.modelLeft, 0), this.rowsManager.gantt.width);
        if (this.modelLeft < 0) {
            this.truncatedLeft = true;
            if (this.modelWidth + this.modelLeft > this.rowsManager.gantt.width) {
                this.truncatedRight = true;
                this.width = this.rowsManager.gantt.width;
            } else {
                this.truncatedRight = false;
                this.width = this.modelWidth + this.modelLeft;
            }
        } else if (this.modelWidth + this.modelLeft > this.rowsManager.gantt.width) {
            this.truncatedRight = true;
            this.truncatedLeft = false;
            this.width = this.rowsManager.gantt.width - this.modelLeft;
        } else {
            this.truncatedLeft = false;
            this.truncatedRight = false;
            this.width = this.modelWidth;
        }
    };

    // Expands the start of the task to the specified position (in em)
    Task.prototype.setFrom = function(x) {
        this.from = this.rowsManager.gantt.getDateByPosition(x, true);
        this._fromLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
        this.checkIfMilestone();
    };

    // Expands the end of the task to the specified position (in em)
    Task.prototype.setTo = function(x) {
        this.to = this.rowsManager.gantt.getDateByPosition(x, true);
        this._toLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
        this.checkIfMilestone();
    };

    // Moves the task to the specified position (in em)
    Task.prototype.moveTo = function(x) {
        this.from = this.rowsManager.gantt.getDateByPosition(x, true);
        this._fromLabel = undefined;
        var newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.from);
        this.to = this.rowsManager.gantt.getDateByPosition(newTaskLeft + this.modelWidth, true);
        this._toLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
    };

    Task.prototype.copy = function(task) {
        this.name = task.name;
        this.color = task.color;
        this.classes = task.classes;
        this.priority = task.priority;
        this.from = moment(task.from);
        this.to = moment(task.to);
        this.est = task.est !== undefined ? moment(task.est) : undefined;
        this.lct = task.lct !== undefined ? moment(task.lct) : undefined;
        this.data = task.data;
        this.isMilestone = task.isMilestone;
    };

    Task.prototype.clone = function() {
        return new Task(this.id, this.row, this.name, this.color, this.classes, this.priority, this.from, this.to, this.data, this.est, this.lct, this.progress);
    };

    return Task;
}]);
