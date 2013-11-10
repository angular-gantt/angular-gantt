gantt.filter('ganttDateWeek', ['dateFunctions', function (df) {
    return function (date) {
        return df.getWeek(date);
    };
}]);