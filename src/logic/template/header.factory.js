'use strict';
gantt.factory('GanttHeader', ['GanttHeaderColumns', function(HeaderColumns) {
    var Header = function(gantt) {
        this.gantt = gantt;

        this.columns = new HeaderColumns(this);

        this.getWidth = function() {
            return this.$element.width();
        };

        this.getHeight = function() {
            return this.$element[0].offsetHeight;
        };
    };
    return Header;
}]);
