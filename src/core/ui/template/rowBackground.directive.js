'use strict';
gantt.directive('ganttRowBackground', ['GanttDirectiveBuilder', function(Builder) {
    var builder = new Builder('ganttRowBackground');
    return builder.build();
}]);
