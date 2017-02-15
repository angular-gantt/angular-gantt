(function(){
    'use strict';
    angular.module('gantt.corner').directive('ganttCornerArea', ['GanttDirectiveBuilder', function(Builder) {
        var builder = new Builder('ganttCornerArea', 'plugins/corner/corner.tmpl.html');
        builder.controller = function($scope) {
            var headers = $scope.gantt.columnsManager.headers;

            function updateModelWithHeaders(headers) {
                var scopeHeaders = [];
                for (var i=0; i<headers.length; i++) {
                    var columns = headers[i];
                    var name = columns[0].name;
                    var unit = columns[0].unit;
                    var scopeHeader = {columns: columns, unit: unit, name: name};
                    scopeHeaders.push(scopeHeader);
                }
                $scope.headers = scopeHeaders;

            }
            updateModelWithHeaders(headers);

            $scope.getLabel = function(header) {
                var label = header.name;

                if ($scope.pluginScope.headersLabels && header.name in $scope.pluginScope.headersLabels) {
                    label = $scope.pluginScope.headersLabels[header.name];
                    if (angular.isFunction(label)) {
                        label = label(header.name, header.unit, header.columns);
                    }
                } else if (angular.isFunction($scope.pluginScope.headersLabels)) {
                    label = $scope.pluginScope.headersLabels(header.name, header.unit, header.columns);
                }

                return label;
            };

            $scope.getLabelContent = function(header) {
                var content;
                if (content === undefined && $scope.pluginScope.headersLabelsTemplates !== undefined) {
                    content = $scope.pluginScope.headersLabelsTemplates;

                    if (angular.isObject(content) && header.name in content) {
                        content = content[header.name];
                    }

                    if (angular.isFunction(content)) {
                        content = content(header.name, header.unit, header.columns);
                    }
                }
                if (content === undefined) {
                    return '{{getLabel(header)}}';
                }
                return content;
            };

            $scope.gantt.api.columns.on.generate($scope, function(columns, headers) {
                updateModelWithHeaders(headers);
            });
        };
        return builder.build();
    }]);
}());

