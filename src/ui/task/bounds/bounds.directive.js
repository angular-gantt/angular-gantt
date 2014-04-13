gantt.directive('ganttBounds', [function () {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: "E",
        template: "<div ng-if='visible' class='gantt-task-bounds' ng-style='getCss()' ng-class='getClass()'></div>",
        replace: true,
        scope: { task: "=ngModel" },
        controller: ['$scope', '$element', function ($scope, $element) {
            var css = {};

            if(!$scope.task.hasBounds()) {
               $scope.visible = false;
            }

            $scope.getCss = function() {
                if($scope.task.hasBounds()){
                    css.width = $scope.task.bounds.width + 'em';

                    if($scope.task.isMilestone === true || $scope.task.width === 0)
                        css.left = ($scope.task.bounds.left-($scope.task.left-0.3)) + 'em';
                    else
                        css.left = ($scope.task.bounds.left - $scope.task.left) + 'em';
                }

                return css;
            };

            $scope.getClass = function() {
                if($scope.task.est === undefined || $scope.task.lct === undefined)
                    return 'gantt-task-bounds-in';
                else if($scope.task.est > $scope.task.from)
                    return 'gantt-task-bounds-out';
                else if($scope.task.lct < $scope.task.to)
                    return 'gantt-task-bounds-out';
                else
                    return 'gantt-task-bounds-in';
            };

            $scope.$watch("task.isMouseOver", function () {
                if ($scope.task.hasBounds() && !$scope.task.isMoving) {
                    $scope.visible = !($scope.task.isMouseOver === undefined || $scope.task.isMouseOver === false);
                }
            });

            $scope.$watch("task.isMoving", function(newValue, oldValue) {
                if ($scope.task.hasBounds()) {
                    $scope.visible = newValue === true;
                }
            });
        }]
    };
}]);