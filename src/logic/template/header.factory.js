'use strict';
gantt.factory('GanttHeader', ['GanttHeaderColumns', function(HeaderColumns) {
    var Header = function(gantt) {
        this.gantt = gantt;
        this.columns = new HeaderColumns(this);
    };
    return Header;
}]);
