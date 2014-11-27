(function(){
    'use strict';
    angular.module('gantt').directive('ganttScrollableHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttScrollableHeader');
        return builder.build();
    }]);
}());

