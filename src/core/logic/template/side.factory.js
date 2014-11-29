(function(){
    'use strict';
    angular.module('gantt').factory('GanttSide', [function() {
        var Side= function(gantt) {
            this.gantt = gantt;

            this.gantt.api.registerMethod('side', 'setWidth', Side.prototype.setWidth, this);
        };
        Side.prototype.getWidth = function() {
            return this.gantt.$scope.showSide ? this.gantt.$scope.sideWidth: 0;
        };
        Side.prototype.show = function(value) {
            this.$element.toggleClass('ng-hide', !value);
        };

        return Side;
    }]);
}());

