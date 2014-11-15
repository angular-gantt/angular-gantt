(function(){
    'use strict';
    angular.module('gantt').factory('GanttHeader', ['GanttHeaderColumns', function(HeaderColumns) {
        var Header = function(gantt) {
            this.gantt = gantt;
            this.columns = new HeaderColumns(this);

            this.getHeight = function() {
                return this.$element[0].offsetHeight;
            };
        };
        return Header;
    }]);
}());

