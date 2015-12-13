(function(){
    'use strict';

    angular.module('gantt').factory('GanttSide', [function() {
        var Side= function(gantt) {
            this.gantt = gantt;
        };
        Side.prototype.getWidth = function() {
            if (this.gantt.options.value('showSide')) {
                var width = this.gantt.options.value('sideWidth');
                if (width === undefined && this.$element !== undefined) {
                    if (this.$element.css('width') !== undefined) {
                        this.$element.css('width', '');
                    }
                }
                if (this.$element !== undefined) {
                    width = this.$element[0].offsetWidth;
                }
                if (width !== undefined) {
                    return width;
                }
            }
            return 0;
        };
        Side.prototype.show = function(value) {
            if (this.$element !== undefined) {
                this.$element.toggleClass('ng-hide', !value);
            }
        };
        Side.prototype.isShown = function() {
            if (this.$element !== undefined) {
                return !this.$element.hasClass('ng-hide');
            }
        };

        return Side;
    }]);
}());

