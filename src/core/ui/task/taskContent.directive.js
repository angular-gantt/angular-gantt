'use strict';
gantt.directive('ganttTaskContent', [function() {
    return {
        restrict: 'E',
        require: '^ganttTask',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.taskContent.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.task.$element = $element;

            $scope.gantt.api.directives.raise.new('ganttTaskContent', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttTaskContent', $scope, $element);
            });
        }]
    };
}]);
