(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowHeader', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowHeader', 'plugins/labels/rowHeader.tmpl.html');
        return builder.build();
    }]);
}());

