gantt.factory('Column', [ function () {
    var Column = function(fromDate, toDate) {
        var self = this;
        self.fromDate = fromDate;
        self.toDate = toDate;
        self.clone = function() {
            var column = new Column(self.fromDate, self.toDate);
            column.isWeekend = self.isWeekend;
            column.widthDay = self.widthDay;
            column.widthWeek = self.widthWeek;
            column.widthMonth = self.widthMonth;
            return  column;
        };
    };

    return Column;
}]);