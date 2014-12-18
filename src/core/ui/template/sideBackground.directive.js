(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideBackground', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideBackground');
        return builder.build();
    }]);
}());

