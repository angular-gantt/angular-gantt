(function(){
    'use strict';
    angular.module('gantt').directive('ganttSideContentLabels', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContentLabels', 'plugins/labels/sideContentLabels.tmpl.html');
        return builder.build();
    }]);
}());

