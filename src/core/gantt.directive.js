(function(){
    'use strict';
    angular.module('gantt', ['gantt.templates', 'angularMoment'])
        .directive('gantt', ['Gantt', 'ganttOptions', 'GanttCalendar', 'moment', 'ganttMouseOffset', 'ganttDebounce', 'ganttEnableNgAnimate', '$timeout', '$templateCache', function(Gantt, Options, Calendar, moment, mouseOffset, debounce, enableNgAnimate, $timeout, $templateCache) {
        return {
            restrict: 'EA',
            transclude: true,
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
                if (tAttrs.templateUrl === undefined) {
                    templateUrl = 'template/gantt.tmpl.html';
                } else {
                    templateUrl = tAttrs.templateUrl;
                }
                if (tAttrs.template !== undefined) {
                    $templateCache.put(templateUrl, tAttrs.template);
                }
                return templateUrl;
            },
            scope: {
                sortMode: '=?', // Possible modes: 'name', 'date', 'custom'
                filterTask: '=?', // Task filter as a angularJS expression
                filterTaskComparator: '=?', // Comparator to use for the task filter
                filterRow: '=?', // Row filter as a angularJS expression
                filterRowComparator: '=?', // Comparator to use for the row filter
                viewScale: '=?', // Possible scales: 'hour', 'day', 'week', 'month'
                columnWidth: '=?', // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
                allowLabelsResizing: '=?', // Set to true if the user should be able to resize the label section.
                fromDate: '=?', // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
                toDate: '=?', // If not specified will use the latest task date (note: as of now this can only expand not shrink)
                currentDateValue: '=?', // If specified, the current date will be displayed
                currentDate: '=?', // The display of currentDate ('none', 'line' or 'column').
                autoExpand: '=?', // Set this both, left or right if the date range shall expand if the user scroll to the left or right end. Otherwise set to false or none.
                taskOutOfRange: '=?', // Set this to expand or truncate to define the behavior of tasks going out of visible range.
                maxHeight: '=?', // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
                showLabelsColumn: '=?', // Whether to show column with labels or not. Default (true)
                showTooltips: '=?', // True when tooltips shall be enabled. Default (true)
                headers: '=?', // An array of units for headers.
                headersFormats: '=?', // An array of corresponding formats for headers.
                timeFrames: '=?',
                dateFrames: '=?',
                timeFramesWorkingMode: '=?',
                timeFramesNonWorkingMode: '=?',
                timespans: '=?',
                columnMagnet: '=?',
                data: '=?',
                api: '=?',
                options: '=?'
            },
            controller: ['$scope', '$element', function($scope, $element) {
                for (var option in $scope.options) {
                    $scope[option] = $scope.options[option];
                }

                Options.initialize($scope);

                // Disable animation if ngAnimate is present, as it drops down performance.
                enableNgAnimate(false, $element);

                $scope.gantt = new Gantt($scope, $element);
                this.gantt = $scope.gantt;
            }],
            link: function(scope, element) {
                // Gantt is initialized. Signal that the Gantt is ready.
                scope.gantt.api.core.raise.ready(scope.gantt.api);

                scope.gantt.api.directives.raise.new('gantt', scope, element);
                scope.$on('$destroy', function() {
                    scope.gantt.api.directives.raise.destroy('gantt', scope, element);
                });

                $timeout(function() {
                    scope.gantt.rendered = true;
                    scope.gantt.columnsManager.generateColumns();
                    scope.gantt.api.core.raise.rendered(scope.gantt.api);
                });
            }
        };
    }]);
}());

