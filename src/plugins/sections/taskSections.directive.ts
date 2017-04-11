require('./taskSections.tmpl.html');

export default function ($templateCache) {
  'ngInject';
  return {
    restrict: 'E',
    requires: '^ganttTask',
    templateUrl: function (tElement, tAttrs) {
      let templateUrl;
      if (tAttrs.templateUrl === undefined) {
        templateUrl = 'plugins/sections/taskSections.tmpl.html';
      } else {
        templateUrl = tAttrs.templateUrl;
      }
      if (tAttrs.template !== undefined) {
        $templateCache.put(templateUrl, tAttrs.template);
      }
      return templateUrl;
    },
    replace: true,
    scope: true,
    controller: ['$scope', '$element', function ($scope, $element) {
      $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskSections', $scope, $element);
      $scope.$on('$destroy', function () {
        $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskSections', $scope, $element);
      });
    }]
  };
}
