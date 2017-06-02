import angular from 'angular';

export default function (GanttDirectiveBuilder) {
  'ngInject';

  let builder = new GanttDirectiveBuilder('ganttCornerArea', 'plugins/corner/corner.tmpl.html');
  builder.controller = function ($scope) {
    let headers = $scope.gantt.columnsManager.headers;

    function updateModelWithHeaders(headers) {
      let scopeHeaders = [];
      for (let columns of headers) {
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
        if (typeof(label) === 'function') {
          label = label(header.name, header.unit, header.columns);
        }
      } else if (typeof($scope.pluginScope.headersLabels) === 'function') {
        label = $scope.pluginScope.headersLabels(header.name, header.unit, header.columns);
      }

      return label;
    };

    $scope.getLabelContent = function (header) {
      let content;
      if (content === undefined && $scope.pluginScope.headersLabelsTemplates !== undefined) {
        content = $scope.pluginScope.headersLabelsTemplates;

        if (content !== null && typeof content === 'object' && header.name in content) {
          content = content[header.name];
        }

        if (typeof content === 'function') {
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
