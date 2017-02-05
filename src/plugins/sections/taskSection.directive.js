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
                var getLeft = function() {
                    var gantt = $scope.task.rowsManager.gantt;
                    var disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);

                    var taskLeft = $scope.task.left;
                    var from = disableMagnet ? $scope.section.from : gantt.getMagnetDate($scope.section.from);

                    var sectionLeft;
                    var disableDaily = utils.firstProperty([$scope.section, $scope.options], 'disableDaily', $scope.$parent.pluginScope.disableDaily);
                    if (!disableDaily && gantt.options.value('daily')) {
                        from = moment(from).startOf('day');
                    }
                    sectionLeft = gantt.getPositionByDate(from);

                    return sectionLeft - taskLeft;
                };

                var getRight = function() {
                    var gantt = $scope.task.rowsManager.gantt;
                    var disableMagnet = utils.firstProperty([$scope.section, $scope.options], 'disableMagnet', $scope.$parent.pluginScope.disableMagnet);

                    var taskLeft = $scope.task.left;
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

                        var from = gantt.getDateByPosition($scope.task.modelLeft + sectionLeft, !disableMagnet);
                        if (!disableDaily && gantt.options.value('daily')) {
                            from = moment(from).startOf('day');
                        }

                        var sectionRight = sectionLeft + $element[0].offsetWidth;
                        var to = gantt.getDateByPosition($scope.task.modelLeft + sectionRight, !disableMagnet);

                        if (!disableDaily && gantt.options.value('daily')) {
                            to = moment(to).startOf('day');
                        }

                        $scope.section.from = from;
                        $scope.section.to = to;

                        updatePosition();
                    }
                };

                $scope.task.rowsManager.gantt.api.tasks.on.change($scope, taskChangeHandler);

                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskSection', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskSection', $scope, $element);
                });
            }]
        };
    }]);
}());

