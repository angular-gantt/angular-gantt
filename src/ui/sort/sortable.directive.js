'use strict';
gantt.directive('ganttSortable', ['$document', 'ganttSortManager', function($document, sortManager) {
    // Provides the row sort functionality to any Gantt row
    // Uses the sortableState to share the current row

    return {
        restrict: 'E',
        template: '<div ng-transclude></div>',
        replace: true,
        transclude: true,
        scope: { row: '=ngModel', swap: '&', active: '=?' },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function() {
                if ($scope.active !== true) {
                    return;
                }

                enableDragMode();

                var disableHandler = function() {
                    $scope.$apply(function() {
                        angular.element($document[0].body).unbind('mouseup', disableHandler);
                        disableDragMode();
                    });
                };
                angular.element($document[0].body).bind('mouseup', disableHandler);
            });

            $element.bind('mousemove', function(e) {
                if (isInDragMode()) {
                    var elementBelowMouse = angular.element($document[0].elementFromPoint(e.clientX, e.clientY));
                    var targetRow = elementBelowMouse.controller('ngModel').$modelValue;

                    if (targetRow.id !== sortManager.startRow.id) {
                        $scope.$apply(function () {
                            $scope.swap({a: targetRow, b: sortManager.startRow});
                        });
                    }
                }
            });

            var isInDragMode = function() {
                return sortManager.startRow !== undefined && !angular.equals($scope.row, sortManager.startRow);
            };

            var enableDragMode = function() {
                sortManager.startRow = $scope.row;
                $element.css('cursor', 'move');
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': 'no-drop'
                });
            };

            var disableDragMode = function() {
                sortManager.startRow = undefined;
                $element.css('cursor', 'pointer');
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': 'auto'
                });
            };
        }]
    };
}]);