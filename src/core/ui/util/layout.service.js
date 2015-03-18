(function(){
    'use strict';
    angular.module('gantt').service('ganttLayout', ['$document', function($document) {
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
            /**
             * Compute the height of scrollbar.
             *
             * @returns {number} height of the scrollbar, in px.
             */
            getScrollBarHeight: function() {
                var inner = $document[0].createElement('p');
                inner.style.width = '200px;';
                inner.style.height = '100%';

                var outer = $document[0].createElement('div');
                outer.style.position = 'absolute';
                outer.style.top = '0px';
                outer.style.left = '0px';
                outer.style.visibility = 'hidden';
                outer.style.width = '150px';
                outer.style.height = '200px';
                outer.style.overflow = 'hidden';
                outer.appendChild (inner);

                $document[0].body.appendChild (outer);

                var h1 = inner.offsetHeight;
                outer.style.overflow = 'scroll';

                var h2 = inner.offsetHeight;
                if (h1 === h2) {
                    h2 = outer.clientHeight;
                }

                $document[0].body.removeChild (outer);

                return (h1 - h2);
            },

            setColumnsWidthFactor: function(columns, widthFactor, originalLeftOffset) {
                if (!columns) {
                    return;
                }

                if (!originalLeftOffset) {
                    originalLeftOffset = 0;
                }

                angular.forEach(columns, function(column) {
                    column.left = (widthFactor * (column.originalSize.left + originalLeftOffset)) - originalLeftOffset;
                    column.width = widthFactor * column.originalSize.width;

                    angular.forEach(column.timeFrames, function(timeFrame) {
                        timeFrame.left = widthFactor * timeFrame.originalSize.left;
                        timeFrame.width = widthFactor * timeFrame.originalSize.width;
                    });
                });
            }
        };
    }]);
}());

