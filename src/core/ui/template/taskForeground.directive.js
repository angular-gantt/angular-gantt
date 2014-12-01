(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskForeground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskForeground');
        return builder.build();
    }]);
}());

