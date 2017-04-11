import angular from 'angular';

export default function (ganttUtils, $compile, $document, $log) {
  'ngInject';
  // Provides the row sort functionality to any Gantt row
  // Uses the sortableState to share the current row

  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      header: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      $log.warn('Angular Gantt Labels plugin is deprecated. Please use Table plugin instead.');

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.labels) === 'object') {
        for (let option in scope.options.labels) {
          scope[option] = scope.options.labels[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      if (scope.header === undefined) {
        scope.header = 'Name';
      }

      api.directives.on.new(scope, function (directiveName, sideContentScope, sideContentElement) {
        if (directiveName === 'ganttSideContent') {
          let labelsScope = sideContentScope.$new();
          labelsScope.pluginScope = scope;

          let ifElement = $document[0].createElement('div');
          angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled');
          angular.element(ifElement).addClass('side-element');

          let labelsElement = $document[0].createElement('gantt-side-content-labels');
          angular.element(ifElement).append(labelsElement);

          sideContentElement.append($compile(ifElement)(labelsScope));
        }
      });

      function fitSideWidthToLabels() {
        let labels = ganttCtrl.gantt.side.$element[0].getElementsByClassName('gantt-row-label');
        let newSideWidth = 0;

        for (let i = 0; i < labels.length; i++) {
          let width = labels[i].children[0].offsetWidth;
          newSideWidth = Math.max(newSideWidth, width);
        }

        if (newSideWidth >= 0) {
          api.side.setWidth(newSideWidth);
        }
      }

      api.registerMethod('labels', 'fitSideWidth', fitSideWidthToLabels, this);
    }
  };
}
