'use strict';
gantt.factory('GanttTaskCompletion', [function() {
    var TaskCompletion = function(task, percent, color, classes) {
        var self = this;

        self.task = task;
        self.percent = percent;
        self.color = color;
        self.classes = classes;

        self.clone = function() {
            return new TaskCompletion(self.percent, self.color, self.classes);
        };
    };
    return TaskCompletion;
}]);
