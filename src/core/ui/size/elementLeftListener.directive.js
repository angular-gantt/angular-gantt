(function(){
    'use strict';
    angular.module('gantt').directive('ganttElementLeftListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttElementLeftListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttElementLeft';
                }

                var effectiveScope = $scope;

                while(scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    effectiveScope[scopeVariable] = $element[0].left;
                });
            }]
        };
    }]);
}());

