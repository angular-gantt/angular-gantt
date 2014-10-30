'use strict';
gantt.factory('GanttScroll', [function() {
    var Scrollable = function(gantt) {
        var self = this;

        self.gantt = gantt;

        /**
         * Scroll to a position
         *
         * @param {number} position Position to scroll to.
         */
        self.scrollTo = function(position) {
            self.$element[0].scrollLeft = position;
            self.$element.triggerHandler('scroll');
        };

        /**
         * Scroll to the left side
         *
         * @param {number} offset Offset to scroll.
         */
        self.scrollToLeft = function(offset) {
            self.$element[0].scrollLeft -= offset;
            self.$element.triggerHandler('scroll');
        };

        /**
         * Scroll to the right side
         *
         * @param {number} offset Offset to scroll.
         */
        self.scrollToRight = function(offset) {
            self.$element[0].scrollLeft += offset;
            self.$element.triggerHandler('scroll');
        };

        // Tries to center the specified date
        /**
         * Scroll to a date
         *
         * @param {moment} date moment to scroll to.
         */
        self.scrollToDate = function(date) {
            var position = self.gantt.getPositionByDate(date);

            if (position !== undefined) {
                self.$element[0].scrollLeft = position - self.$element[0].offsetWidth / 2;
            }
        };
    };
    return Scrollable;
}]);
