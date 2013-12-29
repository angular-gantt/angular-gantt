gantt.factory('TaskPlacement', [ 'dateFunctions', function (df) {
    // Returns the position factor of a task between two columns.
    // Use the precision parameter to specify if task shall be displayed e.g. in quarter steps
    // precision: 4 = in quarter steps, 2 = in half steps, ..

    return {
        instance: function(viewScale, precision) {
            this.getPrecisionFactor = function(date) {
                switch(viewScale) {
                    case 'hour':
                        return Math.round(date.getMinutes()/60 * precision) / precision;
                    case 'day':
                        return Math.round(date.getHours()/24 * precision) / precision;
                    case 'week':
                        return Math.round(date.getDay()/7 * precision) / precision;
                    case 'month':
                        return Math.round(date.getDate()/df.getDaysInMonth(date) * precision) / precision;
                    default:
                        throw "Unsupported view scale: " + viewScale;
                }
            };

            this.getPrecision = function() {
                return precision;
            };
        }
    };
}]);