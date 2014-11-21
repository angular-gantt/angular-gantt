(function(){
    'use strict';
    angular.module('gantt').factory('GanttBody', ['GanttBodyColumns', 'GanttBodyRows', 'GanttBodyBackground', 'GanttBodyForeground', function(BodyColumns, BodyRows, BodyBackground, BodyForeground) {
        var Body= function(gantt) {
            this.gantt = gantt;

            this.background = new BodyBackground(this);
            this.foreground = new BodyForeground(this);
            this.columns = new BodyColumns(this);
            this.rows = new BodyRows(this);
        };
        Body.prototype.getWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
        };
        return Body;
    }]);
}());

