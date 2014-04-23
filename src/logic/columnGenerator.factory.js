gantt.factory('ColumnGenerator', [ 'Column', 'dateFunctions', function (Column, df) {

    // Returns a map to lookup if the current day is a weekend day
    var getWeekendDaysMap = function(weekendDays) {
        var weekendDaysMap = {};

        for (var i = 0, l = weekendDays.length; i < l; i++) {
            weekendDaysMap[weekendDays[i]] = true;
        }

        return weekendDaysMap;
    };

    // Returns true if the given day is a weekend day
    var checkIsWeekend = function(weekendDaysMap, day) {
        return weekendDaysMap[day] === true;
    };

    // Returns a map to lookup if the current hour is a work hour
    var getWorkHoursMap = function(workHours) {
        var workHoursMap = {};

        for (var i = 0, l = workHours.length; i < l; i++) {
            workHoursMap[workHours[i]] = true;
        }

        return workHoursMap;
    };

    // Returns true if the given hour is a work hour
    var checkIsWorkHour = function(workHoursMap, hour) {
        return workHoursMap[hour] === true;
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
            var workHoursMap = getWorkHoursMap(workHours);
            var weekendDaysMap = getWeekendDaysMap(weekendDays);

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDaysMap, date.getDay());

                for (var i = 0; i<24; i++) {
                    var cDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), i, 0, 0);
                    var isWorkHour = checkIsWorkHour(workHoursMap, i);

                    if ((isWeekend && showWeekends || !isWeekend) && (!isWorkHour && showNonWorkHours || isWorkHour)) {
                        var hoursToNextWorkingDay = 1;
                        var hoursToPrevWorkingDay = 1;
                        if(!showNonWorkHours) { //hours to next/prev working day is only relevant if non-work hours are hidden
                            hoursToNextWorkingDay = getHoursToNextWorkingDay(workHoursMap, cDate.getHours());
                            hoursToPrevWorkingDay = getHoursToPreviousWorkingDay(workHoursMap, cDate.getHours());
                        }

                        generatedCols.push(new Column.Hour(cDate, left, columnWidth, columnSubScale, isWeekend, isWorkHour, hoursToNextWorkingDay, hoursToPrevWorkingDay));
                        left += columnWidth;
                    }
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
        };


        // Returns the count of hours until the next working day
        // For example with working hours from 8-16, Wed 9am would return 1, Thu 16pm would return 16
        // Should also be able to handle gaps like 8-12, 13-17
        var getHoursToNextWorkingDay = function(workHoursMap, hour){
            for(var i = 1; i < 25; i++) {
                var nextHour = (hour+i)%24;
                if(checkIsWorkHour(workHoursMap, nextHour)){
                    return i;
                }
            }
            return 1; //default to 1, should only get here if the whole day is a work day
        };

        var getHoursToPreviousWorkingDay = function(workHours, hour){
            for(var i = 1; i < 25; i++) {
                var prevHour = (((hour-i)%24)+24)%24;
                if(checkIsWorkHour(workHours, prevHour)){
                    return i;
                }
            }
            return 1; //default to 1, should only get here if the whole day is a work day
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
            var weekendDaysMap = getWeekendDaysMap(weekendDays);

            while(excludeTo && to - date > 0 || !excludeTo && to - date >= 0) {
                var isWeekend = checkIsWeekend(weekendDaysMap, date.getDay());
                if (isWeekend && showWeekends || !isWeekend) {
                    var daysToNextWorkingDay = 1;
                    var daysToPreviousWorkingDay = 1;
                    if(!showWeekends){ //days to next/prev working day is only relevant if weekends are hidden
                        daysToNextWorkingDay = getDaysToNextWorkingDay(weekendDaysMap, date.getDay());
                        daysToPreviousWorkingDay = getDaysToPrevWorkingDay(weekendDaysMap, date.getDay());
                    }

                    generatedCols.push(new Column.Day(df.clone(date), left, columnWidth, columnSubScale, isWeekend, daysToNextWorkingDay, daysToPreviousWorkingDay, workHours, showNonWorkHours));
                    left += columnWidth;
                }

                date = df.addDays(date, 1);
            }

            return generatedCols;
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