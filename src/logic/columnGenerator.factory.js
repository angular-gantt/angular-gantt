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


    var HourColumnGenerator = function(workHours, showNonWorkHours, showWeekends, weekendDays) {
        this.generate = function(from, to) {
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];

            while(to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());

                for (var i = 0; i<24; i++) {
                    var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i, 0, 0);
                    var isWorkHour = checkIsWorkHour(workHours, i);

                    if ((isWeekend && showWeekends || !isWeekend) && (!isWorkHour && showNonWorkHours || isWorkHour)) {
                        generatedCols.push(new Column.Hour(cDate, isWeekend, isWorkHour));
                    }
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };
    };

    var DayColumnGenerator = function(showWeekends, weekendDays) {
        this.generate = function(from, to) {
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];

            while(to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());

                if (isWeekend && showWeekends || !isWeekend) {
                    generatedCols.push(new Column.Day(df.clone(date), isWeekend));
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };
    };

    var WeekColumnGenerator = function(firstDayOfWeek) {
        this.generate = function(from, to) {
            from = df.setToDayOfWeek(df.setTimeZero(from, true), firstDayOfWeek, false);
            to = df.setToDayOfWeek(df.setTimeZero(to, true), firstDayOfWeek, false);

            var date = df.clone(from);
            var generatedCols = [];

            while(to - date >= 0) {
                generatedCols.push(new Column.Month(df.clone(date)));

                date = df.addWeeks(date, 1);
            }

            return generatedCols;
        };
    };

    var MonthColumnGenerator = function() {
        this.generate = function(from, to) {
            from = df.setToFirstDayOfMonth(df.setTimeZero(from, true), false);
            to = df.setToFirstDayOfMonth(df.setTimeZero(to, true), false);

            var date = df.clone(from);
            var generatedCols = [];

            while(to - date >= 0) {
                generatedCols.push(new Column.Month(df.clone(date)));

                date = df.addMonths(date, 1);
            }

            return generatedCols;
        };
    };

    return {
        HourGenerator: HourColumnGenerator,
        DayGenerator: DayColumnGenerator,
        WeekGenerator: WeekColumnGenerator,
        MonthGenerator: MonthColumnGenerator
    };
}]);