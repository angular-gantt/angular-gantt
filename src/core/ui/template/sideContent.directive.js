(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideContent', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContent');
        return builder.build();
    }]);
}());

