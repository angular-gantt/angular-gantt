(function(){
    'use strict';
    angular.module('gantt', ['gantt.templates', 'angularMoment'])
        .directive('gantt', ['Gantt', 'ganttEnableNgAnimate', '$timeout', '$templateCache', function(Gantt, enableNgAnimate, $timeout, $templateCache) {
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
                expandToFit: '=?',
                shrinkToFit: '=?',
                showSide: '=?',
                allowSideResizing: '=?',
                fromDate: '=?',
                toDate: '=?',
                currentDateValue: '=?',
                currentDate: '=?',
                daily: '=?',
                autoExpand: '=?',
                taskOutOfRange: '=?',
                taskContent: '=?',
                rowContent: '=?',
                maxHeight: '=?',
                sideWidth: '=?',
                headers: '=?',
                headersFormats: '=?',
                timeFrames: '=?',
                dateFrames: '=?',
                timeFramesWorkingMode: '=?',
                timeFramesNonWorkingMode: '=?',
                timespans: '=?',
                columnMagnet: '=?',
                shiftColumnMagnet: '=?',
                timeFramesMagnet: '=?',
                data: '=?',
                api: '=?',
                options: '=?'
            },
            controller: ['$scope', '$element', function($scope, $element) {
                for (var option in $scope.options) {
                    $scope[option] = $scope.options[option];
                }

                // Disable animation if ngAnimate is present, as it drops down performance.
                enableNgAnimate($element, false);

                $scope.gantt = new Gantt($scope, $element);
                this.gantt = $scope.gantt;
            }],
            link: function(scope, element) {
                scope.gantt.api.directives.raise.new('gantt', scope, element);
                scope.$on('$destroy', function() {
                    scope.gantt.api.directives.raise.destroy('gantt', scope, element);
                });

                $timeout(function() {
                    scope.gantt.initialized();
                });
            }
        };
    }]);
}());

