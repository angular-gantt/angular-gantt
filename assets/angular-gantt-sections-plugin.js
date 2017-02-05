/*
Project: angular-gantt v1.3.0 - Gantt chart component for AngularJS
Authors: Marco Schweighauser, Rémi Alvergnat
License: MIT
Homepage: https://www.angular-gantt.com
Github: https://github.com/angular-gantt/angular-gantt.git
*/
(function(){
    'use strict';
    angular.module('gantt.sections', ['gantt', 'gantt.sections.templates']).directive('ganttSections', ['moment', '$compile', '$document', function(moment, $compile, $document) {
        return {
            restrict: 'E',
            require: '^gantt',
            scope: {
                enabled: '=?',
                keepProportions: '=?',
                disableMagnet: '=?',
                disableDaily: '=?'
            },
            link: function(scope, element, attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

                // Load options from global options attribute.
                if (scope.options && typeof(scope.options.sections) === 'object') {
                    for (var option in scope.options.sections) {
                        scope[option] = scope.options.sections[option];
                    }
                }

                if (scope.enabled === undefined) {
                    scope.enabled = true;
                }

                if (scope.keepProportions === undefined) {
                    scope.keepProportions = true;
                }

                api.directives.on.new(scope, function(directiveName, taskScope, taskElement) {
                    if (directiveName === 'ganttTaskForeground') {
                        var sectionsScope = taskScope.$new();
                        sectionsScope.pluginScope = scope;
                        sectionsScope.task = taskScope.task;

                        var ifElement = $document[0].createElement('div');
                        angular.element(ifElement).attr('data-ng-if', 'task.model.sections !== undefined && pluginScope.enabled');
                        angular.element(ifElement).attr('class', 'gantt-task-foreground-sections');

                        var sectionsElement = $document[0].createElement('gantt-task-sections');

                        if (attrs.templateUrl !== undefined) {
                            angular.element(sectionsElement).attr('data-template-url', attrs.templateUrl);
                        }
                        if (attrs.template !== undefined) {
                            angular.element(sectionsElement).attr('data-template', attrs.template);
                        }
                        angular.element(ifElement).append(sectionsElement);
                        taskElement.append($compile(ifElement)(sectionsScope));
                    }
                });
            }
        };
    }]);
}());


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


(function(){
    'use strict';
    angular.module('gantt.sections').directive('ganttTaskSections', ['$templateCache', function($templateCache) {
        return {
            restrict: 'E',
            requires: '^ganttTask',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
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
            controller: ['$scope', '$element', function($scope, $element) {
                $scope.task.rowsManager.gantt.api.directives.raise.new('ganttTaskSections', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.task.rowsManager.gantt.api.directives.raise.destroy('ganttTaskSections', $scope, $element);
                });
            }]
        };
    }]);
}());


angular.module('gantt.sections.templates', []).run(['$templateCache', function ($templateCache) {
    $templateCache.put('plugins/sections/taskSection.tmpl.html',
        '<div ng-style="sectionCss"\n' +
        '     ng-class="sectionClasses"\n' +
        '     class="gantt-task-section"\n' +
        '     gantt-task-section></div>\n' +
        '');
    $templateCache.put('plugins/sections/taskSections.tmpl.html',
        '<div ng-cloak class="gantt-task-sections">\n' +
        '    <gantt-task-section section="section"\n' +
        '                        task="task"\n' +
        '                        options="task.model.sections"\n' +
        '                        ng-repeat="section in task.model.sections.items track by $index">\n' +
        '    </gantt-task-section>\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=angular-gantt-sections-plugin.js.map