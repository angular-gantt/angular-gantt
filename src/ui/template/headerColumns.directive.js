'use strict';
gantt.directive('ganttHeaderColumns', [function() {
    return {
        restrict: 'E',
        require: '^ganttHeader',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.headerColumns.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', 'HeaderColumns', function($scope, $element, HeaderColumns) {
            $scope.template.header.columns = new HeaderColumns($element);
        }]
    };
}]);
