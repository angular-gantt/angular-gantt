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

    // Returns the count of days until the next working day
    // For example with a Mon-Fri working week, Wed would return 1, Fri would return 3, Sat would return 2
    var getDaysToNextWorkingDay = function(weekendDays, day){
        for(var i = 1; i < 8; i++) {
            var nextDay = (day+i)%7;
            if(!checkIsWeekend(weekendDays, nextDay)){
                return i;
            }
        }
        return 1; //default to 1, should only get here if the whole week is the weekend
    };

    // Returns the count of days from the previous working day
    // For example with a Mon-Fri working week, Wed would return 1, Mon would return 3.
    var getDaysToPrevWorkingDay = function(weekendDays, day){
        for(var i = 1; i < 8; i++) {
            var prevDay = (((day-i)%7)+7)%7;
            if(!checkIsWeekend(weekendDays, prevDay)){
                return i;
            }
        }
        return 1; //default to 1, should only get here if the whole week is the weekend
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
            var excludeTo = df.isTimeZero(to);
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());

                for (var i = 0; i<24; i++) {
                    var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i, 0, 0);
                    var isWorkHour = checkIsWorkHour(workHours, i);

                    if ((isWeekend && showWeekends || !isWeekend) && (!isWorkHour && showNonWorkHours || isWorkHour)) {
                        generatedCols.push(new Column.Hour(cDate, left, columnWidth, columnSubScale, isWeekend, isWorkHour));
                        left += columnWidth;
                    }
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };
    };

    var DayColumnGenerator = function(columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours) {
        this.generate = function(from, to) {
            var excludeTo = df.isTimeZero(to);
            from = df.setTimeZero(from, true);
            to = df.setTimeZero(to, true);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDays, date.getDay());
                var daysToNextWorkingDay = 1;
                var daysToPreviousWorkingDay = 1;
                if(!showWeekends){ //days to next/prev working day is only relevant if weekends are hidden
                    daysToNextWorkingDay = getDaysToNextWorkingDay(weekendDays, date.getDay());
                    daysToPreviousWorkingDay = getDaysToPrevWorkingDay(weekendDays, date.getDay());
                }

                if (isWeekend && showWeekends || !isWeekend) {
                    generatedCols.push(new Column.Day(df.clone(date), left, columnWidth, columnSubScale, isWeekend, daysToNextWorkingDay, daysToPreviousWorkingDay, workHours, showNonWorkHours));
                    left += columnWidth;
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };
    };

    var WeekColumnGenerator = function(columnWidth, columnSubScale, firstDayOfWeek) {
        this.generate = function(from, to) {
            var excludeTo = to.getDay() === firstDayOfWeek && df.isTimeZero(to);
            from = df.setToDayOfWeek(df.setTimeZero(from, true), firstDayOfWeek, false);
            to = df.setToDayOfWeek(df.setTimeZero(to, true), firstDayOfWeek, false);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                generatedCols.push(new Column.Week(df.clone(date), left, columnWidth, columnSubScale, firstDayOfWeek));
                left += columnWidth;

                date = df.addWeeks(date, 1);
            }

            return generatedCols;
        };
    };

    var MonthColumnGenerator = function(columnWidth, columnSubScale) {
        this.generate = function(from, to) {
            var excludeTo = to.getDate() === 1 && df.isTimeZero(to);
            from = df.setToFirstDayOfMonth(df.setTimeZero(from, true), false);
            to = df.setToFirstDayOfMonth(df.setTimeZero(to, true), false);

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                generatedCols.push(new Column.Month(df.clone(date), left, columnWidth, columnSubScale));
                left += columnWidth;

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