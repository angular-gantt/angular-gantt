(function(){
    'use strict';
    angular.module('gantt').factory('ganttOptions', ['moment', function(moment) {
        return {initialize: function(options) {
            options.api = options.api || angular.noop();

            options.data = options.data || [];

            options.timespans = options.timespans || [];

            options.sortMode = options.sortMode || undefined;

            options.filterTask = options.filterTask || undefined;
            options.filterTaskComparator = options.filterTaskComparator || undefined;

            options.filterRow = options.filterRow || undefined;
            options.filterRowComparator = options.filterRowComparator || undefined;

            options.viewScale = options.viewScale || 'day';
            options.columnMagnet = options.columnMagnet || '15 minutes';
            options.columnWidth = options.columnWidth || undefined;

            options.fromDate = options.fromDate || undefined;
            options.toDate = options.toDate || undefined;

            options.sideWidth = options.sideWidth || 150;
            options.showSide = options.showSide !== undefined ? !!options.showSide : true;
            options.allowSideResizing = options.allowSideResizing !== undefined ? !!options.allowSideResizing : true;

            options.currentDate = options.currentDate || 'line';
            options.currentDateValue = options.currentDateValue || moment();

            options.autoExpand = options.autoExpand || 'none';
            options.taskOutOfRange = options.taskOutOfRange || 'truncate';

            options.maxHeight = options.maxHeight || 0;

            options.headers = options.headers || undefined;
            options.headersFormats = options.headersFormats || undefined;

            options.timeFrames = options.timeFrames || [];
            options.dateFrames = options.dateFrames || [];

            options.timeFramesWorkingMode = options.timeFramesWorkingMode || 'hidden';
            options.timeFramesNonWorkingMode = options.timeFramesNonWorkingMode || 'visible';

            return options;
        }
        };
    }]);
}());
