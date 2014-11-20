(function(){
    'use strict';
    angular.module('gantt').factory('GanttLabels', [function() {
        var Labels= function(gantt) {
            this.gantt = gantt;
            this.gantt.api.registerEvent('labels', 'resize');
            this.gantt.api.registerEvent('labels', 'resizeBegin');
            this.gantt.api.registerEvent('labels', 'resizeEnd');
        };
        Labels.prototype.getWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
        };
        return Labels;
    }]);
}());

