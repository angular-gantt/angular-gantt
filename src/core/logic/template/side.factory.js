(function(){
    'use strict';
    angular.module('gantt').factory('GanttSide', [function() {
        var Side= function(gantt) {
            this.gantt = gantt;

            this.gantt.api.registerMethod('side', 'setWidth', Side.prototype.setWidth, this);
        };
        Side.prototype.getWidth = function() {
            // If height is 0, returns a 0 width. (Case when no labels plugin is enabled).
            return this.$element === undefined ? undefined : (this.$element[0].offsetHeight === 0 ? 0 : this.$element[0].offsetWidth);
        };
        Side.prototype.setWidth = function(width) {
            if (this.$element !== undefined) {
                this.$element[0].offsetWidth = width;
            }
        };
        return Side;
    }]);
}());

