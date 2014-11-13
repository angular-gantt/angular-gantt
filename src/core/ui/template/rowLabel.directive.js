'use strict';
gantt.directive('ganttRowLabel', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttRowLabel');
    return builder.build();
}]);
