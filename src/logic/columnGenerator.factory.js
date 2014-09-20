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

    var setWidth = function(width, originalWidth, columns) {
        if (width && originalWidth && columns) {

            var widthFactor = Math.abs(width / originalWidth);

            angular.forEach(columns, function(column) {
                column.left = widthFactor * column.left;
                column.width = widthFactor * column.width;
            });
        }
    };


    var HourColumnGenerator = function(width, columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours) {
        // Generates 24 columns for each day between the given from and to date. The task will later be places between the matching columns.
        this.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = df.setTimeZero(from, true);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = df.setTimeZero(to, true);
            }

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;
            var workHoursMap = getWorkHoursMap(workHours);
            var weekendDaysMap = getWeekendDaysMap(weekendDays);

            while(true) {
                if ((maximumWidth && Math.abs(left) > maximumWidth + columnWidth * 24)) {
                    break;
                }

                if (reverse) {
                    left -= columnWidth * 24;
                }

                var isWeekend = checkIsWeekend(weekendDaysMap, df.getDay(date));

                for (var i = 0; i<24; i++) {
                    var cDate = new Date(df.getFullYear(date), df.getMonth(date), df.getDate(date), i, 0, 0);
                    var isWorkHour = checkIsWorkHour(workHoursMap, i);

                    if ((isWeekend && showWeekends || !isWeekend) && (!isWorkHour && showNonWorkHours || isWorkHour)) {
                        var hoursToNextWorkingDay = 1;
                        var hoursToPrevWorkingDay = 1;
                        if(!showNonWorkHours) { //hours to next/prev working day is only relevant if non-work hours are hidden
                            hoursToNextWorkingDay = getHoursToNextWorkingDay(workHoursMap, cDate.getHours());
                            hoursToPrevWorkingDay = getHoursToPreviousWorkingDay(workHoursMap, cDate.getHours());
                        }

                        generatedCols.push(new Column.Hour(cDate, leftOffset ? left + leftOffset : left, columnWidth, columnSubScale, isWeekend, isWorkHour, hoursToNextWorkingDay, hoursToPrevWorkingDay));
                        left += columnWidth;
                    }

                }

                if (reverse) {
                    left -= columnWidth * 24;
                }

                if (to) {
                    if (reverse) {
                        if (excludeTo && date < to || !excludeTo && date <= to) {
                            break;
                        }
                    } else {
                        if (excludeTo && date > to || !excludeTo && date >= to) {
                            break;
                        }
                    }
                }

                date = df.addDays(date, reverse ? -1 : 1);
            }

            setWidth(width, left, generatedCols);

            return generatedCols;
        };

        this.columnExpandNecessary = function(firstColDate, lastColDate, newFromDate, newToDate) {
            // If the To date was excluded from generating then go back one hour.
            if (isToDateToExclude(newToDate)) {
                newToDate = df.addHours(newToDate, -1, true);
            }

            // Set time of newToDate to zero before comparing as the hour columns are generated for the whole day
            // and the newToDate could be e.g. 23:35 while the last column for this date has time 23:00.
            // If we wouldn`t set the time to zero the comparison would trigger an expand in that case.
            return firstColDate > newFromDate || lastColDate < df.setTimeZero(newToDate, true);
        };

        // Columns are generated including or excluding the to date.
        // If the To date time is 00:00 then no new columns are generated for this day.
        var isToDateToExclude = function(to) {
            return df.isTimeZero(to);
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

    var DayColumnGenerator = function(width, columnWidth, columnSubScale, weekendDays, showWeekends, workHours, showNonWorkHours) {
        // Generates one column for each day between the given from and to date.
        this.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = df.setTimeZero(from, true);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = df.setTimeZero(to, true);
            }

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;
            var weekendDaysMap = getWeekendDaysMap(weekendDays);

            while(true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                var isWeekend = checkIsWeekend(weekendDaysMap, df.getDay(date));
                if (isWeekend && showWeekends || !isWeekend) {
                    var daysToNextWorkingDay = 1;
                    var daysToPreviousWorkingDay = 1;
                    if(!showWeekends){ //days to next/prev working day is only relevant if weekends are hidden
                        daysToNextWorkingDay = getDaysToNextWorkingDay(weekendDaysMap, df.getDay(date));
                        daysToPreviousWorkingDay = getDaysToPrevWorkingDay(weekendDaysMap, df.getDay(date));
                    }

                    generatedCols.push(new Column.Day(df.clone(date), leftOffset ? left + leftOffset : left, columnWidth, columnSubScale, isWeekend, daysToNextWorkingDay, daysToPreviousWorkingDay, workHours, showNonWorkHours));
                    if (reverse) {
                        left -= columnWidth;
                    } else {
                        left += columnWidth;
                    }

                }

                if (to) {
                    if (reverse) {
                        if (excludeTo && date < to || !excludeTo && date <= to) {
                            break;
                        }
                    } else {
                        if (excludeTo && date > to || !excludeTo && date >= to) {
                            break;
                        }
                    }
                }

                date = df.addDays(date, reverse ? -1: 1);
            }

            if (reverse) {
                if (isToDateToExclude(from)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            setWidth(width, left, generatedCols);

            return generatedCols;
        };

        this.columnExpandNecessary = function(firstColDate, lastColDate, newFromDate, newToDate) {
            // If the To date was excluded from generating then go back one day.
            if (isToDateToExclude(newToDate)) {
                newToDate = df.addDays(newToDate, -1, true);
            }

            // Set time of newToDate to zero before comparing as the day columns generated have time 00:00
            // and the newToDate could be e.g. 16:23.
            // If we wouldn`t set the time to zero the comparison would trigger an expand in that case.
            return firstColDate > newFromDate || lastColDate < df.setTimeZero(newToDate, true);
        };

        // Columns are generated including or excluding the to date.
        // If the To date time is 00:00 then no new column is generated for this day.
        var isToDateToExclude = function(to) {
            return df.isTimeZero(to);
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

    var WeekColumnGenerator = function(width, columnWidth, columnSubScale, firstDayOfWeek) {
        // Generates one column for each week between the given from and to date.
        this.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = df.setToDayOfWeek(df.setTimeZero(from, true), firstDayOfWeek, false);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = df.setToDayOfWeek(df.setTimeZero(to, true), firstDayOfWeek, false);
            }

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                generatedCols.push(new Column.Week(df.clone(date), leftOffset ? left + leftOffset : left, columnWidth, columnSubScale, firstDayOfWeek));
                if (reverse) {
                    left -= columnWidth;
                } else {
                    left += columnWidth;
                }

                if (to) {
                    if (reverse) {
                        if (excludeTo && date < to || !excludeTo && date <= to) {
                            break;
                        }
                    } else {
                        if (excludeTo && date > to || !excludeTo && date >= to) {
                            break;
                        }
                    }
                }

                date = df.addWeeks(date, reverse ? -1 : 1);
            }

            if (reverse) {
                if (isToDateToExclude(from)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            setWidth(width, left, generatedCols);

            return generatedCols;
        };

        this.columnExpandNecessary = function(firstColDate, lastColDate, newFromDate, newToDate) {
            // If the To date was excluded from generating then go back one week.
            if (isToDateToExclude(newToDate)) {
                newToDate = df.addWeeks(newToDate, -1, true);
            }

            // Set time of newToDate to zero before comparing as the week columns generated have day = firstDayOfWeek and time = 00:00
            // and the newToDate could be e.g. day 3 and time 16:23.
            // If we wouldn`t set the day to firstDayOfWeek and time to zero the comparison would trigger an expand in that case.
            return firstColDate > newFromDate || lastColDate < df.setToDayOfWeek(df.setTimeZero(newToDate, true), firstDayOfWeek);
        };

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of week and the time is 00:00 then no new column is generated for this week.
        var isToDateToExclude = function(to) {
            return df.getDay(to) === firstDayOfWeek && df.isTimeZero(to);
        };
    };

    var MonthColumnGenerator = function(width, columnWidth, columnSubScale) {
        // Generates one column for each month between the given from and to date.
        this.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = df.setToFirstDayOfMonth(df.setTimeZero(from, true), false);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = df.setToFirstDayOfMonth(df.setTimeZero(to, true), false);
            }

            var date = df.clone(from);
            var generatedCols = [];
            var left = 0;

            while(true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                generatedCols.push(new Column.Month(df.clone(date), leftOffset ? left + leftOffset : left, columnWidth, columnSubScale));
                if (reverse) {
                    left -= columnWidth;
                } else {
                    left += columnWidth;
                }

                if (to) {
                    if (reverse) {
                        if (excludeTo && date < to || !excludeTo && date <= to) {
                            break;
                        }
                    } else {
                        if (excludeTo && date > to || !excludeTo && date >= to) {
                            break;
                        }
                    }
                }

                date = df.addMonths(date, reverse ? -1 : 1);
            }

            if (reverse) {
                if (isToDateToExclude(from)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            setWidth(width, left, generatedCols);

            return generatedCols;
        };

        this.columnExpandNecessary = function(firstColDate, lastColDate, newFromDate, newToDate) {
            // If the To date was excluded from generating then go back one month.
            if (isToDateToExclude(newToDate)) {
                newToDate = df.addMonths(newToDate, -1, true);
            }

            // Set time of newToDate to zero before comparing as the month columns generated have day = 1 and time = 00:00
            // and the newToDate could be e.g. day 7 and time 16:23.
            // If we wouldn`t set the day to 1 and time to zero the comparison would trigger an expand in that case.
            return firstColDate > newFromDate || lastColDate < df.setToFirstDayOfMonth(df.setTimeZero(newToDate, true));
        };

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.
        var isToDateToExclude = function(to) {
            return df.getDate(to) === 1 && df.isTimeZero(to);
        };
    };

    return {
        HourGenerator: HourColumnGenerator,
        DayGenerator: DayColumnGenerator,
        WeekGenerator: WeekColumnGenerator,
        MonthGenerator: MonthColumnGenerator
    };
}]);