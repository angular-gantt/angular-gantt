'use strict';
gantt.service('ganttLayout', ['$document', function($document) {
    return {
        /**
         * Compute the width of scrollbar.
         *
         * @returns {number} width of the scrollbar, in px.
         */
        getScrollBarWidth: function() {
            var inner = $document[0].createElement('p');
            inner.style.width = '100%';
            inner.style.height = '200px';

            var outer = $document[0].createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.width = '200px';
            outer.style.height = '150px';
            outer.style.overflow = 'hidden';
            outer.appendChild (inner);

            $document[0].body.appendChild (outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 === w2) {
                w2 = outer.clientWidth;
            }
            $document[0].body.removeChild (outer);

            return (w1 - w2);
        },

        setColumnsWidth: function(width, originalWidth, columns) {
            if (width && originalWidth && columns) {

                var widthFactor = Math.abs(width / originalWidth);

                angular.forEach(columns, function(column) {
                    column.left = widthFactor * column.originalSize.left;
                    column.width = widthFactor * column.originalSize.width;

                    angular.forEach(column.timeFrames, function(timeFrame) {
                        timeFrame.left = widthFactor * timeFrame.originalSize.left;
                        timeFrame.width = widthFactor * timeFrame.originalSize.width;
                    });
                });
            }
        }
    };
}]);
