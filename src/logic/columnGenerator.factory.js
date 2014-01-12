gantt.factory('ColumnGenerator', [ 'Column', 'dateFunctions', function (Column, df) {

    // Returns true if the given day is a weekend day
    var checkIsWeekend = function(weekendDays, day) {
        for (var i = 0, l = weekendDays.length; i < l; i++) {
            if (weekendDays[i] === day) {
                return true;
            }
        }

        return false;
    };

    // Returns true if the given hour is a work hour
    var checkIsWorkHour = function(workHours, hour) {
        for (var i = 0, l = workHours.length; i < l; i++) {
            if (workHours[i] === hour) {
                return true;
            }
        }

        return false;
    };


    var HourColumnGenerator = function(columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours) {
        // Generates the columns between from and to date. The task will later be places between the matching columns.
        this.generate = function(from, to) {
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());

                for (var i = 0; i<24; i++) {
                    var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i, 0, 0);
                    var isWorkHour = checkIsWorkHour(workHours, i);

                    if ((isWeekend && showWeekends || !isWeekend) && (!isWorkHour && showNonWorkHours || isWorkHour)) {
                        generatedCols.push(new Column.Hour(cDate, left, columnWidth, isWeekend, isWorkHour));
                        left += columnWidth;
                    }
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };

        // Takes a date and adjusts it to the current column sub scale. E.g. if subScale=4 and date is 13:40 result will be 13:45
        this.adjustDateToSubScale = function(date) {
            var res = df.clone(date);
            res.setMinutes(60 * this.getSubScaleFactor(res));
            return res;
        };

        this.getSubScale = function() {
            return columnSubScale;
        };

        // Returns the column sub scale factor from the specified date.
        // Use the  parameter to specify if task shall be displayed e.g. in quarter steps
        // columnSubScale: 4 = in quarter steps, 2 = in half steps, ..
        this.getSubScaleFactor = function(date) {
            return Math.round(date.getMinutes()/60 * columnSubScale) / columnSubScale;
        };
    };

    var DayColumnGenerator = function(columnWidth, columnSubScale, weekendDays, showWeekends) {
        this.generate = function(from, to) {
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());

                if (isWeekend && showWeekends || !isWeekend) {
                    generatedCols.push(new Column.Day(df.clone(date), left, columnWidth, isWeekend));
                    left += columnWidth;
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };

        this.adjustDateToSubScale = function(date) {
            var res = df.clone(date);
            res.setHours(24 * this.getSubScaleFactor(res));
            return res;
        };

        this.getSubScale = function() {
            return columnSubScale;
        };

        this.getSubScaleFactor = function(date) {
            return Math.round(date.getHours()/24 * columnSubScale) / columnSubScale;
        };
    };

    var WeekColumnGenerator = function(columnWidth, columnSubScale, firstDayOfWeek) {
        this.generate = function(from, to) {
            from = df.setToDayOfWeek(df.setTimeZero(from, true), firstDayOfWeek, false);
            to = df.setToDayOfWeek(df.setTimeZero(to, true), firstDayOfWeek, false);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(to - date >= 0) {
                generatedCols.push(new Column.Month(df.clone(date), left, columnWidth));
                left += columnWidth;

                date = df.addWeeks(date, 1);
            }

            return generatedCols;
        };

        this.adjustDateToSubScale = function(date) {
            var res = df.clone(date);
            df.setToDayOfWeek(res, 7 * this.getSubScaleFactor(res), false);
            return res;
        };

        this.getSubScale = function() {
            return columnSubScale;
        };

        this.getSubScaleFactor = function(date) {
            return Math.round(date.getDay()/7 * columnSubScale) / columnSubScale;
        };
    };

    var MonthColumnGenerator = function(columnWidth, columnSubScale) {
        this.generate = function(from, to) {
            from = df.setToFirstDayOfMonth(df.setTimeZero(from, true), false);
            to = df.setToFirstDayOfMonth(df.setTimeZero(to, true), false);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(to - date >= 0) {
                generatedCols.push(new Column.Month(df.clone(date), left, columnWidth));
                left += columnWidth;

                date = df.addMonths(date, 1);
            }

            return generatedCols;
        };

        this.adjustDateToSubScale = function(date) {
            var res = df.clone(date);
            res.setDate(1 + df.getDaysInMonth(res) * this.getSubScaleFactor(res));
            return res;
        };

        this.getSubScale = function() {
            return columnSubScale;
        };

        this.getSubScaleFactor = function(date) {
            return Math.round(date.getDate()/df.getDaysInMonth(date) * columnSubScale) / columnSubScale;
        };
    };

    return {
        HourGenerator: HourColumnGenerator,
        DayGenerator: DayColumnGenerator,
        WeekGenerator: WeekColumnGenerator,
        MonthGenerator: MonthColumnGenerator
    };
}]);