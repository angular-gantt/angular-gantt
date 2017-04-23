import angular from 'angular';

require('./tooltip.tmpl.html');

export default function ($log, $timeout, $compile, $document, $templateCache, ganttDebounce, ganttSmartEvent) {
  'ngInject';
  // This tooltip displays more information about a task

  return {
    restrict: 'E',
    templateUrl: function (tElement, tAttrs) {
      let templateUrl;
      if (tAttrs.templateUrl === undefined) {
        templateUrl = 'plugins/tooltips/tooltip.tmpl.html';
      } else {
        templateUrl = tAttrs.templateUrl;
      }
      if (tAttrs.template !== undefined) {
        $templateCache.put(templateUrl, tAttrs.template);
      }
      return templateUrl;
    },
    scope: true,
    replace: true,
    controller: function ($scope, $element, ganttUtils) {
      let bodyElement = angular.element($document[0].body);
      let parentElement = $scope.task.$element;
      let showTooltipPromise;
      let visible = false;
      let mouseEnterX;
      let mouseMoveHandler;

      let getViewPortWidth = function () {
        let d = $document[0];
        return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
      };

      let updateTooltip = function (x) {
        // Check if info is overlapping with view port
        if (x + $element[0].offsetWidth > getViewPortWidth()) {
          $element.css('left', (x + 20 - $element[0].offsetWidth) + 'px');
          $scope.isRightAligned = true;
        } else {
          $element.css('left', (x - 20) + 'px');
          $scope.isRightAligned = false;
        }
      };

      let showTooltip = function (x) {
        visible = true;
        mouseMoveHandler.bind();

        $scope.displayed = true;

        $scope.$evalAsync(function () {
          let restoreNgHide;
          if ($element.hasClass('ng-hide')) {
            $element.removeClass('ng-hide');
            restoreNgHide = true;
          }
          $scope.elementHeight = $element[0].offsetHeight;
          if (restoreNgHide) {
            $element.addClass('ng-hide');
          }
          $scope.taskRect = parentElement[0].getBoundingClientRect();
          updateTooltip(x);
        });
      };

      let hideTooltip = function () {
        visible = false;
        mouseMoveHandler.unbind();
        $scope.$evalAsync(function () {
          $scope.displayed = false;
        });
      };

      let displayTooltip = function (newValue, showDelayed?) {
        if (showTooltipPromise) {
          $timeout.cancel(showTooltipPromise);
        }

        let taskTooltips = $scope.task.model.tooltips;
        let rowTooltips = $scope.task.row.model.tooltips;

        if (typeof(taskTooltips) === 'boolean') {
          taskTooltips = {enabled: taskTooltips};
        }

        if (typeof(rowTooltips) === 'boolean') {
          rowTooltips = {enabled: rowTooltips};
        }

        let enabled = ganttUtils.firstProperty([taskTooltips, rowTooltips], 'enabled', $scope.pluginScope.enabled);
        if (enabled && !visible && mouseEnterX !== undefined && newValue) {
          let content = ganttUtils.firstProperty([taskTooltips, rowTooltips], 'content', $scope.pluginScope.content);
          $scope.content = content;

          if (showDelayed) {
            showTooltipPromise = $timeout(function () {
              showTooltip(mouseEnterX);
            }, $scope.pluginScope.delay, false);
          } else {
            showTooltip(mouseEnterX);
          }
        } else if (!newValue) {
          if (!$scope.task.active) {
            hideTooltip();
          }
        }
      };

      mouseMoveHandler = ganttSmartEvent($scope, bodyElement, 'mousemove', ganttDebounce(function (e) {
        if (!visible) {
          mouseEnterX = e.clientX;
          displayTooltip(true, false);
        } else {
          // check if mouse goes outside the parent
          if (
            !$scope.taskRect ||
            e.clientX < $scope.taskRect.left ||
            e.clientX > $scope.taskRect.right ||
            e.clientY > $scope.taskRect.bottom ||
            e.clientY < $scope.taskRect.top
          ) {
            displayTooltip(false, false);
          }

          updateTooltip(e.clientX);
        }
      }, 5, false));

      $scope.getFromLabel = function () {
        let taskTooltips = $scope.task.model.tooltips;
        let rowTooltips = $scope.task.row.model.tooltips;

        if (typeof(taskTooltips) === 'boolean') {
          taskTooltips = {enabled: taskTooltips};
        }

        if (typeof(rowTooltips) === 'boolean') {
          rowTooltips = {enabled: rowTooltips};
        }

        let dateFormat = ganttUtils.firstProperty([taskTooltips, rowTooltips], 'dateFormat', $scope.pluginScope.dateFormat);
        return $scope.task.model.from.format(dateFormat);
      };

      $scope.getToLabel = function () {
        let taskTooltips = $scope.task.model.tooltips;
        let rowTooltips = $scope.task.row.model.tooltips;

        if (typeof(taskTooltips) === 'boolean') {
          taskTooltips = {enabled: taskTooltips};
        }

        if (typeof(rowTooltips) === 'boolean') {
          rowTooltips = {enabled: rowTooltips};
        }

        let dateFormat = ganttUtils.firstProperty([taskTooltips, rowTooltips], 'dateFormat', $scope.pluginScope.dateFormat);
        return $scope.task.model.to.format(dateFormat);
      };

      $scope.task.getContentElement().bind('mousemove', function (evt) {
        mouseEnterX = evt.clientX;
      });

      $scope.task.getContentElement().bind('mouseenter', function (evt) {
        mouseEnterX = evt.clientX;
        displayTooltip(true, true);
      });

      $scope.task.getContentElement().bind('mouseleave', function () {
        displayTooltip(false);
      });

      if ($scope.pluginScope.api.tasks.on.moveBegin) {
        $scope.pluginScope.api.tasks.on.moveBegin($scope, function (task) {
          if (task === $scope.task) {
            displayTooltip(true);
          }
        });

        $scope.pluginScope.api.tasks.on.moveEnd($scope, function (task) {
          if (task === $scope.task) {
            displayTooltip(false);
          }
        });

        $scope.pluginScope.api.tasks.on.resizeBegin($scope, function (task) {
          if (task === $scope.task) {
            displayTooltip(true);
          }
        });

        $scope.pluginScope.api.tasks.on.resizeEnd($scope, function (task) {
          if (task === $scope.task) {
            displayTooltip(false);
          }
        });
      }

      if ($scope.task.isMoving) {
        // Display tooltip because task has been moved to a new row
        displayTooltip(true, false);
      }

      $scope.gantt.api.directives.raise.new('ganttTooltip', $scope, $element);
      $scope.$on('$destroy', function () {
        $scope.gantt.api.directives.raise.destroy('ganttTooltip', $scope, $element);
      });
    }
  };
}
