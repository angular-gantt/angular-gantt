'use strict';
gantt.directive('ganttTask', [function() {
    return {
        restrict: 'E',
        require: '^ganttRow',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.task.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.task.$element = $element;

            $scope.gantt.api.directives.raise.new('ganttTask', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTask', $scope, $element);
            });
        }]
    };
}]);
