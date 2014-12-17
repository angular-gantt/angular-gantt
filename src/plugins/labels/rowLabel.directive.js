(function(){
    'use strict';
    angular.module('gantt.labels').directive('ganttRowLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowLabel');
        builder.restrict = 'A';
        builder.templateUrl = undefined;
        return builder.build();
    }]);
}());

