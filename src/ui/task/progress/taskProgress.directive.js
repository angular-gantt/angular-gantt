'use strict';
gantt.directive('ganttTaskProgress', [function() {
    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.taskProgress.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: { progress: '=' },
        controller: ['$scope', function($scope) {
            $scope.getCss = function() {
                var css = {};

                if ($scope.progress.color) {
                    css['background-color'] = $scope.progress.color;
                } else {
                    css['background-color'] = '#6699FF';
                }

                css.width = $scope.progress.percent + '%';

                return css;
            };
        }]
    };
}]);
