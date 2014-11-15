(function(){
    'use strict';
    angular.module('gantt').directive('ganttLabelsHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttLabelsHeader');
        return builder.build();
    }]);
}());

