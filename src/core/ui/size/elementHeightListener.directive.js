(function(){
    'use strict';
    angular.module('gantt').directive('ganttElementHeightListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttElementHeightListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttElementHeight';
                }

                var effectiveScope = $scope;

                while(scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    if ($element[0].offsetHeight > 0) {
                        effectiveScope[scopeVariable] = $element[0].offsetHeight;
                    }
                });
            }]
        };
    }]);
}());

