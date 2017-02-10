(function() {
    'use strict';
    angular.module('gantt.sections').directive('ganttTaskSection', ['$templateCache', function($templateCache) {
        return {
            restrict: 'E',
            requires: '^ganttTaskSections',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
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
                options: '=?'
            },
            controller: ['$scope', '$element', 'ganttUtils', 'moment', function($scope, $element, utils, moment) {
                var fromTask = moment($scope.section.from).isSame(moment($scope.task.model.from));
                var toTask = moment($scope.section.to).isSame(moment($scope.task.model.to));

                var getLeft = function() {
                    if (fromTask) {
                        return 0;
                    }

                    var gantt = $scope.task.rowsManager.gantt;
                    var taskLeft = $scope.task.left;

                    var from;

                    var disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);

                    from = disableMagnet ? $scope.section.from : gantt.getMagnetDate($scope.section.from);

                    var disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);
                    if (!disableDaily && gantt.options.value('daily')) {
                        from = moment(from).startOf('day');
                    }

                    var sectionLeft = gantt.getPositionByDate(from);

                    return sectionLeft - taskLeft;
                };

                var getRight = function() {
                    var keepProportions = utils.firstProperty([$scope.section, $scope.options], 'keepProportions', $scope.$parent.pluginScope.keepProportions);
                    if (toTask && keepProportions) {
                        return $scope.task.width;
                    }

                    var gantt = $scope.task.rowsManager.gantt;
                    var taskLeft = $scope.task.left;

                    var disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);
                    var to = disableMagnet ? $scope.section.to : gantt.getMagnetDate($scope.section.to);

                    var disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);
                    if (!disableDaily && gantt.options.value('daily')) {
                        to = moment(to).startOf('day');
                    }

                    var sectionRight = gantt.getPositionByDate(to);

                    return sectionRight - taskLeft;
                };

                var getRelative = function(position) {
                    return position / $scope.task.width * 100;
                };

                var updatePosition = function() {
                    var sectionLeft = getLeft();
                    var sectionWidth = getRight() - sectionLeft;

                    var keepProportions = utils.firstProperty([$scope.section, $scope.options], 'keepProportions', $scope.$parent.pluginScope.keepProportions);
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

                var getCss = function() {
                    var css = {};

                    if ($scope.section.color) {
                        css['background-color'] = $scope.section.color;
                    }

                    return css;
                };

                $scope.sectionClasses = $scope.section.classes;
                $scope.sectionCss = getCss();

                updatePosition();

                var taskChangeHandler = function(task) {
                    if (task === $scope.task) {
                        // Update from/to section model value based on position.
                        var gantt = $scope.task.rowsManager.gantt;

                        var sectionLeft = $element[0].offsetLeft;

                        var disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);
                        var disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);

                        var from;
                        if (fromTask) {
                            from = $scope.task.model.from;
                        } else {
                            from = gantt.getDateByPosition($scope.task.modelLeft + sectionLeft, !disableMagnet);
                            if (!disableDaily && gantt.options.value('daily')) {
                                from = moment(from).startOf('day');
                            }
                        }

                        var to;
                        if (toTask) {
                            to = $scope.task.model.to;
                        } else {
                            var sectionRight = sectionLeft + $element[0].offsetWidth;
                            to = gantt.getDateByPosition($scope.task.modelLeft + sectionRight, !disableMagnet);

                            if (!disableDaily && gantt.options.value('daily')) {
                                to = moment(to).startOf('day');
                            }
                        }

                        $scope.section.from = from;
                        $scope.section.to = to;

                        updatePosition();
                    }
                };

                var taskCleanHandler = function(taskModel) {
                    if (taskModel.id === $scope.task.model.id) {
                        var model = $scope.section;
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

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskSection', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskSection', $scope, $element);
                });
            }]
        };
    }]);
}());

