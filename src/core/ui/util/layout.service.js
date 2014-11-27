(function(){
    'use strict';
    angular.module('gantt').service('ganttLayout', [function() {
        return {
            /**
             * Compute the width of scrollbar.
             *
             * @returns {number} width of the scrollbar, in px.
             */
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
}());

