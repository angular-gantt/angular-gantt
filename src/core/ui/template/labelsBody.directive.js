(function(){
    'use strict';
    angular.module('gantt').directive('ganttLabelsBody', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttLabelsBody');
        return builder.build();
    }]);
}());


