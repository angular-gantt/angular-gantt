(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowLabel', 'plugins/labels/rowLabel.tmpl.html');
        return builder.build();
    }]);
}());

