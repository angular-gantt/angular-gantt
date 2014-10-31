'use strict';
gantt.factory('GanttTaskProgress', [function() {
    var TaskProgress = function(task, percent, color, classes) {
        var self = this;

        self.task = task;
        self.percent = percent;
        self.color = color;
        self.classes = classes;

        self.clone = function() {
            return new TaskProgress(self.task, self.percent, self.color, self.classes);
        };
    };
    return TaskProgress;
}]);
