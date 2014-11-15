(function(){
    'use strict';
    angular.module('gantt').directive('ganttElementWidthListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttElementWidthListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttElementWidth';
                }

                var effectiveScope = $scope;

                while(scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    if ($element[0].offsetWidth > 0) {
                        effectiveScope[scopeVariable] = $element[0].offsetWidth;
                    }
                });
            }]
        };
    }]);
}());

