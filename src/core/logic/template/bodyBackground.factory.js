(function(){
    'use strict';
    angular.module('gantt').factory('GanttBodyBackground', [function() {
        var GanttBodyBackground = function(body) {
            this.body = body;
        };
        return GanttBodyBackground;
    }]);
}());
