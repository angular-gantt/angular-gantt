(function(){
    'use strict';
    angular.module('gantt.labels', ['gantt', 'gantt.labels.templates']).directive('ganttLabels', ['ganttUtils', '$compile', '$document', '$log', function(utils, $compile, $document, $log) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                header: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                $log.warn('Angular Gantt Labels plugin is deprecated. Please use Table plugin instead.');

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.header === undefined) {
                    scope.header = 'Name';
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var labelsScope = sideContentScope.$new();
                        labelsScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
                        angular.element(ifElement).addClass('side-element');

                        var labelsElement = $document[0].createElement('gantt-side-content-labels');
                        angular.element(ifElement).append(labelsElement);

                        sideContentElement.append($compile(ifElement)(labelsScope));
                    }
                });

                function fitSideWidthToLabels() {
                    var labels = ganttCtrl.gantt.side.$element[0].getElementsByClassName('gantt-row-label');
                    var newSideWidth = 0;

                    angular.forEach(labels, function (label) {
                        var width = label.children[0].offsetWidth;
                        newSideWidth = Math.max(newSideWidth, width);
                    });

                    if (newSideWidth >= 0) {
                        api.side.setWidth(newSideWidth);
                    }
                }

                api.registerMethod('labels', 'fitSideWidth', fitSideWidthToLabels, this);
            }
        };
    }]);
}());

