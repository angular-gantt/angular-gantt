/*
Project: angular-gantt v1.1.0 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: http://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.table', ['gantt', 'gantt.table.templates']).directive('ganttTable', ['ganttUtils', '$compile', '$document', function(utils, $compile, $document) {
        // Provides the row sort functionality to any Gantt row
        // Uses the sortableState to share the current row

        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                columns: '=',
                headers: '=?',
                formatters: '=?',
                headerFormatter: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sortable) === 'object') {
                    for (var option in scope.options.sortable) {
                        scope[option] = scope.options[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.columns === undefined) {
                    scope.columns = ['model.name'];
                }

                if (scope.headers === undefined) {
                    scope.headers = {'model.name': 'Name'};
                }

                if (scope.formatters === undefined) {
                    scope.formatters = {};
                }

                api.directives.on.new(scope, function(directiveName, sideContentScope, sideContentElement) {
                    if (directiveName === 'ganttSideContent') {
                        var tableScope = sideContentScope.$new();
                        tableScope.pluginScope = scope;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
                        angular.element(ifElement).addClass('side-element');

                        var tableElement = $document[0].createElement('gantt-side-content-table');
                        angular.element(ifElement).append(tableElement);

                        sideContentElement.append($compile(ifElement)(tableScope));
                    }
                });

            }
        };
    }]);
}());


(function(){
    'use strict';
    angular.module('gantt.table').directive('ganttSideContentTable', ['GanttDirectiveBuilder', 'ganttLayout', function(Builder, layout) {
        var builder = new Builder('ganttSideContentTable', 'plugins/table/sideContentTable.tmpl.html');
        builder.controller = function($scope) {
            var hScrollBarHeight = layout.getScrollBarHeight();

            $scope.getMaxHeightCss = function() {
                var css = {};

                if ($scope.maxHeight) {
                    var bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
                    css['max-height'] = $scope.maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';
                }

                return css;
            };
        };
        return builder.build();
    }]);
}());


(function() {
    'use strict';
    angular.module('gantt.table').controller('TableController', ['$scope', function($scope) {
        $scope.getValue = function(scope, column) {
            var value = scope.$eval('row.' + column);

            var formatter = $scope.pluginScope.formatters[column];
            if (formatter !== undefined) {
                value = formatter(value, column, scope.row);
            }

            return value;
        };

        $scope.getHeader = function(scope, column) {
            var header = $scope.pluginScope.headers[column];
            if (header !== undefined) {
                return header;
            }
            var headerFormatter;
            if ($scope.pluginScope.headerFormatter !== undefined) {
                header = headerFormatter(column);
            }
            if (header !== undefined) {
                return header;
            }
            return header;
        };
    }]);
}());


//# sourceMappingURL=angular-gantt-table-plugin.js.map