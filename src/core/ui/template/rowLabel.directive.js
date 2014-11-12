'use strict';
gantt.directive('ganttRowLabel', [function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.rowLabel.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        compile: function () {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.gantt.api.directives.raise.preLink('ganttRowLabel', scope, iElement, iAttrs, controller);
                },
                post: function postLink(scope, iElement, iAttrs, controller) {
                    scope.gantt.api.directives.raise.postLink('ganttRowLabel', scope, iElement, iAttrs, controller);
                }
            };
        },
        controller: ['$scope', '$element', function($scope, $element) {

            $scope.gantt.api.directives.raise.new('ganttRowLabel', $scope, $element);
            $scope.$on('$destroy', function() {
                $scope.gantt.api.directives.raise.destroy('ganttRowLabel', $scope, $element);
            });
        }]
    };
}]);
