'use strict';
gantt.directive('ganttHeader', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.header.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'GanttHeader', function($scope, $element, Header) {
            $scope.template.header = new Header($element);
        }]
    };
}]);
