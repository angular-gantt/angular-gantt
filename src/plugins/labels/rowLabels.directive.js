(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowLabels', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowLabels', 'plugins/labels/rowLabels.tmpl.html');
        return builder.build();
    }]);
}());

