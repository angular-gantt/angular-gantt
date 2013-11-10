gantt.directive('ganttSortable', ['$document', 'sortableState', function ($document, sortableState) {
    // Provides the row sort functionality to any Gantt row
    // Uses the sortableState to share the current row

    return {
        restrict: "E",
        template: "<div ng-transclude></div>",
        replace: true,
        transclude: true,
        scope: { row: "=ngModel", swap: "&" },
        controller: ['$scope', '$element', function ($scope, $element) {
            $element.bind("mousedown", function () {
                enableDragMode();

                var disableHandler = function () {
                    angular.element($document[0].body).unbind('mouseup', disableHandler);
                    disableDragMode();
                };
                angular.element($document[0].body).bind("mouseup", disableHandler);
            });

            $element.bind("mousemove", function (e) {
                if (isInDragMode()) {
                    var elementBelowMouse = angular.element($document[0].elementFromPoint(e.clientX, e.clientY));
                    var targetRow = elementBelowMouse.controller("ngModel").$modelValue;

                    $scope.$apply(function() {
                        $scope.swap({a: targetRow, b: sortableState.startRow});
                    });
                }
            });

            var isInDragMode = function () {
                return sortableState.startRow !== undefined && !angular.equals($scope.row, sortableState.startRow);
            };

            var enableDragMode = function () {
                sortableState.startRow = $scope.row;
                $element.css("cursor", "move");
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': 'no-drop'
                });
            };

            var disableDragMode = function () {
                sortableState.startRow = undefined;
                $element.css("cursor", "pointer");
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