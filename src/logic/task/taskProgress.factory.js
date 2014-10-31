'use strict';
gantt.factory('GanttTaskProgress', [function() {
    var TaskProgress = function(task, percent, color, classes) {
        this.task = task;
        this.percent = percent;
        this.color = color;
        this.classes = classes;
    };

    TaskProgress.prototype.clone = function() {
        return new TaskProgress(this.task, this.percent, this.color, this.classes);
    };

    return TaskProgress;
}]);
