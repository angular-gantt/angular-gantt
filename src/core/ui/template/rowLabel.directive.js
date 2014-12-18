(function(){
    'use strict';
    angular.module('gantt').directive('ganttRowLabel', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttRowLabel');
        builder.restrict = 'A';
        builder.templateUrl = undefined;
        return builder.build();
    }]);
}());

