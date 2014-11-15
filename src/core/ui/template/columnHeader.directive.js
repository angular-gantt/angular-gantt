(function(){
    'use strict';
    angular.module('gantt').directive('ganttColumnHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttColumnHeader');
        return builder.build();
    }]);
}());

