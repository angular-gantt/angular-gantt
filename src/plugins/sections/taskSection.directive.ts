import moment from 'moment';

require('./taskSection.tmpl.html');

export default function ($templateCache) {
  'ngInject';
  return {
    restrict: 'E',
    requires: '^ganttTaskSections',
    templateUrl: function (tElement, tAttrs) {
      let templateUrl;
      if (tAttrs.templateUrl === undefined) {
        templateUrl = 'plugins/sections/taskSection.tmpl.html';
      } else {
        templateUrl = tAttrs.templateUrl;
      }
      if (tAttrs.template !== undefined) {
        $templateCache.put(templateUrl, tAttrs.template);
      }
      return templateUrl;
    },
    replace: true,
    scope: {
      section: '=',
      task: '=',
      index: '=',
      options: '=?'
    },
    controller: ['$scope', '$element', 'ganttUtils', function ($scope, $element, utils) {
      let fromTask = moment($scope.section.from).isSame(moment($scope.task.model.from));
      let toTask = moment($scope.section.to).isSame(moment($scope.task.model.to));

      let loadPreviousScope = function () {
        if ($scope.task._movingTaskSections) {
          // We are coming from a task row change
          let sectionScopes = $scope.task._movingTaskSections;
          let sectionScope = sectionScopes['$$index_' + $scope.index];
          $scope.section = sectionScope.section;
          $scope.sectionCss = sectionScope.sectionCss;
          fromTask = sectionScope.fromTask;
          toTask = sectionScope.toTask;
          delete sectionScopes['$$index_' + $scope.index];
        }

        let sectionScopesEmpty = true;
        for (let property in $scope.task._movingTaskSections) {
          if ($scope.task._movingTaskSections.hasOwnProperty(property)) {
            sectionScopesEmpty = false;
            break;
          }
        }

        if (sectionScopesEmpty) {
          delete $scope.task._movingTaskSections;
        }
      };
      loadPreviousScope();

      let getLeft = function () {
        if (fromTask) {
          return 0;
        }

        let gantt = $scope.task.rowsManager.gantt;
        let taskLeft = $scope.task.left;

        let from;

        let disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);

        from = disableMagnet ? $scope.section.from : gantt.getMagnetDate($scope.section.from);

        let disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);
        if (!disableDaily && gantt.options.value('daily')) {
          from = moment(from).startOf('day');
        }

        let sectionLeft = gantt.getPositionByDate(from);

        return sectionLeft - taskLeft;
      };

      let getRight = function () {
        let keepProportions = utils.firstProperty([$scope.section, $scope.options], 'keepProportions', $scope.$parent.pluginScope.keepProportions);
        if (toTask && keepProportions) {
          return $scope.task.width;
        }

        let gantt = $scope.task.rowsManager.gantt;
        let taskLeft = $scope.task.left;

        let disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);
        let to = disableMagnet ? $scope.section.to : gantt.getMagnetDate($scope.section.to);

        let disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);
        if (!disableDaily && gantt.options.value('daily')) {
          to = moment(to).startOf('day');
        }

        let sectionRight = gantt.getPositionByDate(to);

        return sectionRight - taskLeft;
      };

      let getRelative = function (position) {
        return position / $scope.task.width * 100;
      };

      let updatePosition = function () {
        let sectionLeft = getLeft();
        let sectionWidth = getRight() - sectionLeft;

        let keepProportions = utils.firstProperty([$scope.section, $scope.options], 'keepProportions', $scope.$parent.pluginScope.keepProportions);
        if (keepProportions) {
          // Setting left and width as to keep proportions when changing task size.
          // This may somewhat break the magnet feature, but it seems acceptable
          $scope.sectionCss.left = getRelative(sectionLeft) + '%';
          $scope.sectionCss.width = getRelative(sectionWidth) + '%';
        } else {
          $scope.sectionCss.left = sectionLeft + 'px';
          $scope.sectionCss.width = sectionWidth + 'px';
        }
      };

      let updateCss = function () {
        if ($scope.section.color) {
          $scope.sectionCss['background-color'] = $scope.section.color;
        } else {
          $scope.sectionCss['background-color'] = undefined;
        }
      };

      if ($scope.sectionCss === undefined) {
        $scope.sectionCss = {};
        updatePosition();
        updateCss();
      }

      let taskChangeHandler = function (task) {
        if (task === $scope.task) {
          // Update from/to section model value based on position.
          let gantt = $scope.task.rowsManager.gantt;

          let sectionLeft = $element[0].offsetLeft;

          let disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);

          let from;
          if (fromTask) {
            from = $scope.task.model.from;
          } else {
            from = gantt.getDateByPosition($scope.task.modelLeft + sectionLeft, !disableMagnet);
          }

          let to;
          if (toTask) {
            to = $scope.task.model.to;
          } else {
            let sectionRight = sectionLeft + $element[0].offsetWidth;
            to = gantt.getDateByPosition($scope.task.modelLeft + sectionRight, !disableMagnet);
          }

          $scope.section.from = from;
          $scope.section.to = to;

          updatePosition();
        }
      };

      let taskCleanHandler = function (taskModel) {
        if (taskModel.id === $scope.task.model.id) {
          let model = $scope.section;
          if (model.from !== undefined && !moment.isMoment(model.from)) {
            model.from = moment(model.from);
          }

          if (model.to !== undefined && !moment.isMoment(model.to)) {
            model.to = moment(model.to);
          }
        }
      };
      taskCleanHandler($scope.task.model);

      $scope.task.rowsManager.gantt.api.tasks.on.clean($scope, taskCleanHandler);
      $scope.task.rowsManager.gantt.api.tasks.on.change($scope, taskChangeHandler);

      let beforeViewRowChangeHandler = function (task) {
        let sectionScopes = task._movingTaskSections;
        if (!sectionScopes) {
          sectionScopes = {};
          task._movingTaskSections = sectionScopes;
        }

        sectionScopes['$$index_' + $scope.index] = {
          'section': $scope.section,
          'sectionCss': $scope.sectionCss,
          'fromTask': fromTask,
          'toTask': toTask
        };
      };
      $scope.task.rowsManager.gantt.api.tasks.on.beforeViewRowChange($scope, beforeViewRowChangeHandler);

      $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskSection', $scope, $element);
      $scope.$on('$destroy', function () {
        $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskSection', $scope, $element);
      });
    }]
  };
}
