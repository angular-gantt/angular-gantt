(function() {
    'use strict';
    angular.module('gantt').directive('ganttContainerHeightListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttContainerHeightListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttContainerHeight';
                }

                var effectiveScope = $scope;

                while (scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    var el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined;
                    if (el) {
                        var height = el.offsetHeight;

                        var style = getComputedStyle(el);
                        height = height - parseInt(style.marginTop) - parseInt(style.marginBottom);

                        return height;
                    }
                    return 0;
                }, function(newValue) {
                    if (newValue > 0) {
                        effectiveScope[scopeVariable] = newValue;
                    }
                });
            }]
        };
    }]);
}());

