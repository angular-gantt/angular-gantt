import angular from 'angular';

export default function (GanttDirectiveBuilder) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttCornerArea', 'plugins/corner/corner.tmpl.html');
  builder.controller = function ($scope) {
    let headers = $scope.gantt.columnsManager.headers;

    function updateModelWithHeaders(headers) {
      let scopeHeaders = [];
      for (let i = 0; i < headers.length; i++) {
        let columns = headers[i];
        let name = columns[0].name;
        let unit = columns[0].unit;
        let scopeHeader = {columns: columns, unit: unit, name: name};
        scopeHeaders.push(scopeHeader);
      }
      $scope.headers = scopeHeaders;

    }

    updateModelWithHeaders(headers);

    $scope.getLabel = function (header) {
      let label = header.name;

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

    $scope.getLabelContent = function (header) {
      let content;
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

    $scope.gantt.api.columns.on.generate($scope, function (columns, headers) {
      updateModelWithHeaders(headers);
    });
  };
  return builder.build();
}
