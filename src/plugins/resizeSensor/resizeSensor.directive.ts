import ElementQueries from 'css-element-queries/src/ElementQueries';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';

ElementQueries.listen();

export default function () {
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
      if (scope.options && typeof(scope.options.resizeSensor) === 'object') {
        for (let option in scope.options.resizeSensor) {
          scope[option] = scope.options.resizeSensor[option];
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true;
      }

      function buildSensors() {
        let ganttElement = ganttCtrl.gantt.$element[0];
        let ganttSensor = new ResizeSensor(ganttElement, function () {
          // See issue #664
          let changed = false;
          if (Math.abs(ganttElement.clientWidth - ganttCtrl.gantt.$scope.ganttElementWidth) > 1) {
            ganttCtrl.gantt.$scope.ganttElementWidth = ganttElement.clientWidth;
            changed = true;
          }
          if (Math.abs(ganttElement.clientHeight - ganttCtrl.gantt.$scope.ganttElementHeight) > 1) {
            ganttCtrl.gantt.$scope.ganttElementHeight = ganttElement.clientHeight;
            changed = true;
          }
          if (changed) {
            ganttCtrl.gantt.$scope.$apply();
          }
        });
        let containerSensor = new ResizeSensor(ganttElement.parentElement, function () {
          let el = ganttElement.parentElement;
          let height = el.offsetHeight;

          let style = getComputedStyle(el);
          height = height - parseInt(style.marginTop, 10) - parseInt(style.marginBottom, 10);

          ganttCtrl.gantt.$scope.ganttContainerHeight = height;

          let width = el.offsetWidth;

          style = getComputedStyle(el);
          width = width - parseInt(style.marginLeft, 10) - parseInt(style.marginRight, 10);

          ganttCtrl.gantt.$scope.ganttContainerWidth = width;

          ganttCtrl.gantt.$scope.$apply();
        });
        return [ganttSensor, containerSensor];
      }

      let rendered = false;
      let sensors = [];

      function detach(sensors) {
        for (let i = 0; i < sensors; i++) {
          sensors[i].detach();
        }
      }

      api.core.on.rendered(scope, function () {
        rendered = true;
        detach(sensors);
        if (scope.enabled) {
          ElementQueries.update();
          sensors = buildSensors();
        }
      });

      scope.$watch('enabled', function (newValue) {
        if (rendered) {
          if (newValue) {
            ElementQueries.update();
            sensors = buildSensors();
          } else if (!newValue) {
            detach(sensors);
            sensors = [];
          }
        }
      });
    }
  };
}
