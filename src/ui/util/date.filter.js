'use strict';
gantt.filter('ganttDate', ['$filter', function($filter) {
    var defaultFilter = $filter('date');

    if (typeof moment === 'function') {
        return function(date, format) {
            date = moment(date);
            if (moment.isMoment(date)) {
                // Those replacement are craps, but it makes default native formats working with momentJS
                format = format.replace('yyyy', 'YYYY');
                format = format.replace('yy', 'YY');
                format = format.replace('dd', 'DD');
                format = format.replace('EEEE', 'dddd');

                return date.utc().format(format);
            }
            return defaultFilter(date, format);
        };
    } else {
        return defaultFilter;
    }
}]);