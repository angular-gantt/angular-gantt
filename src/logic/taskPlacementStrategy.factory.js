gantt.factory('TaskPlacementStrategy', [ 'dateFunctions', 'binarySearch', function (df, bs) {
    return {
        instance: function(viewScale, precision) {
            // Calculate the position and size of a task inside the Gantt
            this.placeTask = function(task, columns) {
                var cmp =  function(c) { return c.date; };
                var cFrom = bs.get(columns, task.from, cmp);
                var cTo = bs.get(columns, task.to, cmp);

                // Task bounds are calculated according to their time
                task.left = calculateTaskPos(cFrom[0], task.from);
                task.width = Math.round( (calculateTaskPos(cTo[0], task.to) - task.left) * 10) / 10;

                // Set minimal width
                // TODO check if left+width exceeds the Gantt width
                if (task.width === 0) {
                    task.width = cFrom[0].width / precision;
                }
            };

            // TODO: Refactor & rename this function
            this.calculateDate = function(date) {
                var res = df.clone(date);

                switch(viewScale) {
                    case 'hour':
                        res.setMinutes(60 * getPrecisionFactor(date));
                        break;
                    case 'day':
                        res.setHours(24 * getPrecisionFactor(date));
                        break;
                    case 'week':
                        df.setToDayOfWeek(res, 7 * getPrecisionFactor(date), false);
                        break;
                    case 'month':
                        res.setDate(1 + df.getDaysInMonth(date) * getPrecisionFactor(date));
                        break;
                    default:
                        throw "Unsupported view scale: " + viewScale;
                }

                return res;
            };

            // Calculates the position of the task start or end
            // The position is based on the column which is closest to the start (or end) date.
            // This column has a width which is used to calculate the exact position within this column.
            var calculateTaskPos = function(column, date) {
                return Math.round( (column.left + column.width * getPrecisionFactor(date)) * 10) / 10;
            };

            // Returns the position factor of a task between two columns.
            // Use the precision parameter to specify if task shall be displayed e.g. in quarter steps
            // precision: 4 = in quarter steps, 2 = in half steps, ..
            var getPrecisionFactor = function(date) {
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
        }
    };
}]);