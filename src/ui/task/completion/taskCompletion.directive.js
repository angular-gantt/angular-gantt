'use strict';
gantt.directive('ganttTaskCompletion', [function() {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.taskCompletion.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: { completion: '=' },
        controller: ['$scope', function($scope) {
            $scope.getCss = function() {
                var css = {};

                if ($scope.completion.color) {
                    css['background-color'] = $scope.completion.color;
                } else {
                    css['background-color'] = '#6699FF';
                }

                css.width = $scope.completion.percent + '%';

                return css;
            };
        }]
    };
}]);
