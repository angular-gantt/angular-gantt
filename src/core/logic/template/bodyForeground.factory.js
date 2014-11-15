(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyForeground', [function() {
        var GanttBodyForeground = function(body) {
            this.body = body;
        };
        return GanttBodyForeground;
    }]);
}());

