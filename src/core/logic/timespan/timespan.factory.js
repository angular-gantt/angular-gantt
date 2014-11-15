(function(){
    'use strict';
    angular.module('gantt').factory('GanttTimespan', [function() {
        var Timespan = function(gantt, model) {
            this.gantt = gantt;
            this.model = model;
        };

        // Updates the pos and size of the timespan according to the from - to date
        Timespan.prototype.updatePosAndSize = function() {
            this.left = this.gantt.getPositionByDate(this.model.from);
            this.width = this.gantt.getPositionByDate(this.model.to) - this.left;
        };

        // Expands the start of the timespan to the specified position (in em)
        Timespan.prototype.setFrom = function(x) {
            this.from = this.gantt.getDateByPosition(x);
            this.updatePosAndSize();
        };

        // Expands the end of the timespan to the specified position (in em)
        Timespan.prototype.setTo = function(x) {
            this.to = this.gantt.getDateByPosition(x);
            this.updatePosAndSize();
        };

        // Moves the timespan to the specified position (in em)
        Timespan.prototype.moveTo = function(x) {
            this.from = this.gantt.getDateByPosition(x);
            this.to = this.gantt.getDateByPosition(x + this.width);
            this.updatePosAndSize();
        };

        Timespan.prototype.clone = function() {
            return new Timespan(this.gantt, angular.copy(this.model));
        };

        return Timespan;
    }]);
}());

