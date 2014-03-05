gantt.directive('ganttBounds', [function () {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: "E",
        template: "<div ng-if='visible' class='gantt-task-bounds' ng-style='getCss()' ng-class='getClass()'></div>",
        replace: true,
        scope: { task: "=ngModel" },
        controller: ['$scope', '$element', function ($scope, $element) {
            
            var css = {};
            if($scope.task.bounds !== undefined) css.width = $scope.task.bounds.width + 'em';
            else css.display = 'none';

            $scope.getCss = function() {
                if($scope.task.bounds !== undefined){
                    if($scope.task.isMilestone === true || $scope.task.width === 0) css.left = ($scope.task.bounds.left-($scope.task.left-0.3)) + 'em';
                    else css.left = ($scope.task.bounds.left - $scope.task.left) + 'em';
                }
                return css;
            };

            $scope.getClass = function() {
                if($scope.task.est === undefined || $scope.task.lct === undefined) return 'gantt-task-bounds-in';
                if($scope.task.est > $scope.task.from) return 'gantt-task-bounds-out';
                if($scope.task.lct < $scope.task.to) return 'gantt-task-bounds-out';
                return 'gantt-task-bounds-in';
            };

            $scope.$watch("task.mouseOver", function () {
                if ($scope.task.isMoving) return true;
                else if($scope.task.mouseOver === undefined || $scope.task.mouseOver === false) $scope.visible = false;
                else $scope.visible = true; //console.log($scope.mouseOver);
            });

            $scope.$watch("task.isMoving", function(newValue, oldValue) {
                if (newValue === true) $scope.visible = true;
                else $scope.visible = false;
            });
        }]
    };
}]);