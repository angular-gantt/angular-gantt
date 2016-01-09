(function(){
    'use strict';
    angular.module('gantt').factory('GanttScroll', [function() {
        var Scroll = function(gantt) {
            this.gantt = gantt;

            this.gantt.api.registerEvent('scroll', 'scroll');

            this.gantt.api.registerMethod('scroll', 'to', Scroll.prototype.scrollTo, this);
            this.gantt.api.registerMethod('scroll', 'toDate', Scroll.prototype.scrollToDate, this);
            this.gantt.api.registerMethod('scroll', 'left', Scroll.prototype.scrollToLeft, this);
            this.gantt.api.registerMethod('scroll', 'right', Scroll.prototype.scrollToRight, this);

            this.gantt.api.registerMethod('scroll', 'setWidth', Scroll.prototype.setWidth, this);
        };

        Scroll.prototype.getScrollLeft = function() {
            if (this.$element === undefined) {
                return undefined;
            } else {
                if (this.cachedScrollLeft === undefined) {
                    this.cachedScrollLeft = this.$element[0].scrollLeft;
                }

                return this.cachedScrollLeft;
            }
        };

        Scroll.prototype.getScrollWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].scrollWidth;
        };

        Scroll.prototype.getWidth = function() {
            return this.$element === undefined ? undefined : this.$element[0].offsetWidth;
        };

        Scroll.prototype.setWidth = function(width) {
            if (this.$element[0]) {
                this.$element[0].offsetWidth = width;
            }
        };

        Scroll.prototype.getBordersWidth = function() {
            if (this.$element === undefined) {
               return undefined;
            }

            if (this.$element[0].clientWidth) {
               return this.$element[0].offsetWidth - this.$element[0].clientWidth;
            } else {
               //fix for IE11
               var borderLeft = window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-left-width').match(/\d+/)[0] : 0;
               var borderRight = window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width') ? window.getComputedStyle(this.$element[0]).getPropertyValue('border-right-width').match(/\d+/)[0] : 0;

               return parseInt(borderLeft) + parseInt(borderRight);
            }
        };

        Scroll.prototype.getBordersHeight = function() {
            return this.$element === undefined ? undefined : (this.$element[0].offsetHeight - this.$element[0].clientHeight);
        };

        Scroll.prototype.isVScrollbarVisible = function () {
            if (this.$element !== undefined) {
                return this.$element[0].scrollHeight > this.$element[0].offsetHeight;
            }
        };

        Scroll.prototype.isHScrollbarVisible = function () {
            if (this.$element !== undefined) {
                return this.$element[0].scrollWidth > this.$element[0].offsetWidth;
            }
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
}());
