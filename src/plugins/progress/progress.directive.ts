import angular from 'angular';

import moment from 'moment';

export default function ($compile, $document) {
  'ngInject';
  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.progress) === 'object') {
        for (let option in scope.options.progress) {
          scope[option] = scope.options.progress[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      api.directives.on.new(scope, function (directiveName, taskScope, taskElement) {
        if (directiveName === 'ganttTaskBackground') {
          let progressScope = taskScope.$new();
          progressScope.pluginScope = scope;

          let ifElement = $document[0].createElement('div');
          angular.element(ifElement).attr('data-ng-if', 'task.model.progress !== undefined && pluginScope.enabled');

          let progressElement = $document[0].createElement('gantt-task-progress');
          if (attrs.templateUrl !== undefined) {
            angular.element(progressElement).attr('data-template-url', attrs.templateUrl);
          }
          if (attrs.template !== undefined) {
            angular.element(progressElement).attr('data-template', attrs.template);
          }
          angular.element(ifElement).append(progressElement);
          taskElement.append($compile(ifElement)(progressScope));
        }
      });

      api.tasks.on.clean(scope, function (model) {
        if (model.est !== undefined && !moment.isMoment(model.est)) {
          model.est = moment(model.est); // Earliest Start Time
        }

        if (model.lct !== undefined && !moment.isMoment(model.lct)) {
          model.lct = moment(model.lct); // Latest Completion Time
        }
      });
    }
  };
}
