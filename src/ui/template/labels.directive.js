'use strict';
gantt.directive('ganttLabels', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.labels.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'Labels', function($scope, $element, Labels) {
            $scope.template.labels = new Labels($element);
        }]
    };
}]);
