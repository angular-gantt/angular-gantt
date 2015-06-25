(function(){
    'use strict';
    angular.module('gantt.selector', ['gantt']).directive('ganttTaskSelector', ['$compile', '$document', 'ganttDebounce', 'ganttSmartEvent', function($compile, $document, debounce, smartEvent) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?'
                // Add other option attributes for this plugin
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                if (scope.options && typeof(scope.options.tooltips) === 'object') {
                    for (var option in scope.options.tooltips) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                scope.api = api;

                api.directives.on.new(scope, function(directiveName, columnScope, columnElement) {
                   if (directiveName === 'ganttColumn') {
                          var selectorScope = columnScope.$new();

                       selectorScope.pluginScope = scope;
                       // var ifElement = $document[0].createElement('div');
                       // angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');


                       var mouseMoveHandler = smartEvent(selectorScope, columnElement, 'mousemove', debounce(function(e) {
                        var mouseEnterX = e.clientX;
                        columnScope.getDateByPosition(mouseEnterX);
                       }, 5, false));

                       mouseMoveHandler.bind();
                   }
               });

            }
        };
    }]);
}());

