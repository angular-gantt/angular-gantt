(function(){
    'use strict';
    angular.module('gantt.table').directive('ganttSideContentTable', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttSideContentTable', 'plugins/table/sideContentTable.tmpl.html');
        return builder.build();
    }]);
}());

