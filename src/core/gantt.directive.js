(function(){
    'use strict';
    angular.module('gantt', ['gantt.templates', 'angularMoment'])
        .directive('gantt', ['Gantt', 'ganttOptions', 'GanttCalendar', 'moment', 'ganttMouseOffset', 'ganttDebounce', 'ganttEnableNgAnimate', '$timeout', '$templateCache', function(Gantt, Options, Calendar, moment, mouseOffset, debounce, enableNgAnimate, $timeout, $templateCache) {
        return {
            restrict: 'A',
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
                sortMode: '=?',
                filterTask: '=?',
                filterTaskComparator: '=?',
                filterRow: '=?',
                filterRowComparator: '=?',
                viewScale: '=?',
                columnWidth: '=?',
                showSide: '=?',
                allowSideResizing: '=?',
                fromDate: '=?',
                toDate: '=?',
                currentDateValue: '=?',
                currentDate: '=?',
                autoExpand: '=?',
                taskOutOfRange: '=?',
                maxHeight: '=?',
                headers: '=?',
                headersFormats: '=?',
                timeFrames: '=?',
                dateFrames: '=?',
                timeFramesWorkingMode: '=?',
                timeFramesNonWorkingMode: '=?',
                timespans: '=?',
                columnMagnet: '=?',
                shiftColumnMagnet: '=?',
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
                scope.gantt.api.directives.raise.new('gantt', scope, element);
                scope.$on('$destroy', function() {
                    scope.gantt.api.directives.raise.destroy('gantt', scope, element);
                });

                $timeout(function() {
                    // Gantt is initialized. Signal that the Gantt is ready.
                    scope.gantt.api.core.raise.ready(scope.gantt.api);

                    scope.gantt.rendered = true;
                    scope.gantt.columnsManager.generateColumns();
                    scope.gantt.api.core.raise.rendered(scope.gantt.api);
                });
            }
        };
    }]);
}());

