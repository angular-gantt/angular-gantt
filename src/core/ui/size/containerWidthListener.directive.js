(function() {
    'use strict';
    angular.module('gantt').directive('ganttContainerWidthListener', [function() {
        return {
            restrict: 'A',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var scopeVariable = $attrs.ganttContainerWidthListener;
                if (scopeVariable === '') {
                    scopeVariable = 'ganttContainerWidth';
                }

                var effectiveScope = $scope;

                while (scopeVariable.indexOf('$parent.') === 0) {
                    scopeVariable = scopeVariable.substring('$parent.'.length);
                    effectiveScope = effectiveScope.$parent;
                }

                effectiveScope.$watch(function() {
                    var el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined;
                    if (el) {
                        var width = el.offsetWidth;

                        var style = getComputedStyle(el);
                        width = width - parseInt(style.marginLeft) - parseInt(style.marginRight);

                        return width;
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

