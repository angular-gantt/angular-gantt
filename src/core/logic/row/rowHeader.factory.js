(function(){
    'use strict';
    angular.module('gantt').factory('GanttRowHeader', [function() {
        var RowHeader = function(gantt) {
            this.gantt = gantt;
        };
        return RowHeader;
    }]);
}());

