'use strict';
gantt.factory('GanttScroll', [function() {
    var Scroll = function(gantt) {
        this.gantt = gantt;
    };

    /**
     * Scroll to a position
     *
     * @param {number} position Position to scroll to.
     */
    Scroll.prototype.scrollTo = function(position) {
        this.$element[0].scrollLeft = position;
        this.$element.triggerHandler('scroll');
    };

    /**
     * Scroll to the left side
     *
     * @param {number} offset Offset to scroll.
     */
    Scroll.prototype.scrollToLeft = function(offset) {
        this.$element[0].scrollLeft -= offset;
        this.$element.triggerHandler('scroll');
    };

    /**
     * Scroll to the right side
     *
     * @param {number} offset Offset to scroll.
     */
    Scroll.prototype.scrollToRight = function(offset) {
        this.$element[0].scrollLeft += offset;
        this.$element.triggerHandler('scroll');
    };

    // Tries to center the specified date
    /**
     * Scroll to a date
     *
     * @param {moment} date moment to scroll to.
     */
    Scroll.prototype.scrollToDate = function(date) {
        var position = this.gantt.getPositionByDate(date);

        if (position !== undefined) {
            this.$element[0].scrollLeft = position - this.$element[0].offsetWidth / 2;
        }
    };

    return Scroll;
}]);
