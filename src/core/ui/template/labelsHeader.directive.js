'use strict';
gantt.directive('ganttLabelsHeader', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttLabelsHeader');
    return builder.build();
}]);
