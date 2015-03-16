(function() {
    'use strict';
    angular.module('gantt').directive('ganttBindCompileHtml', ['$compile', function($compile) {
        return {
            restrict: 'A',
            require: '^gantt',
            link: function(scope, element, attrs, ganttCtrl) {
                scope.scope = ganttCtrl.gantt.$scope.$parent;
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
