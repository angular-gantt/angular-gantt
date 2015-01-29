(function() {
    'use strict';
    angular.module('gantt').directive('ganttBindCompileHtml', ['$compile', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(function() {
                    return scope.$eval(attrs.ganttBindCompileHtml);
                }, function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    }]);
}());
