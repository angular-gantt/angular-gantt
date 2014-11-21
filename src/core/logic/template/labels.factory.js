(function(){
    'use strict';
    angular.module('gantt').factory('GanttLabels', [function() {
        var Labels= function(gantt) {
            this.gantt = gantt;
        };
        Labels.prototype.getWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
        };
        return Labels;
    }]);
}());

