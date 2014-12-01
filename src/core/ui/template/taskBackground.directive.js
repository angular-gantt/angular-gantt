(function(){
    'use strict';
    angular.module('gantt').directive('ganttTaskBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttTaskBackground');
        return builder.build();
    }]);
}());

