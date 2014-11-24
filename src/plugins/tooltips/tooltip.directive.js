(function(){
    'use strict';
    angular.module('gantt.tooltips').directive('ganttTooltip', ['$timeout', '$compile', '$document', '$templateCache', 'ganttDebounce', 'ganttSmartEvent', function($timeout, $compile, $document, $templateCache, debounce, smartEvent) {
        // This tooltip displays more information about a task

        return {
            restrict: 'E',
            templateUrl: function(tElement, tAttrs) {
                var templateUrl;
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
            controller: ['$scope', '$element', 'ganttUtils', function($scope, $element, utils) {
                var bodyElement = angular.element($document[0].body);
                var parentElement = $scope.task.$element;
                var showTooltipPromise;
                var mousePositionX;

                $element.toggleClass('ng-hide', true);

                $scope.getFromLabel = function() {
                    var dateFormat = utils.firstProperty([$scope.task.model.tooltips, $scope.task.row.model.tooltips], 'dateFormat', $scope.pluginScope.dateFormat);
                    return $scope.task.model.from.format(dateFormat);
                };

                $scope.getToLabel = function() {
                    var dateFormat = utils.firstProperty([$scope.task.model.tooltips, $scope.task.row.model.tooltips], 'dateFormat', $scope.pluginScope.dateFormat);
                    return $scope.task.model.to.format(dateFormat);
                };

                var displayTooltip = function(newValue) {
                    if (showTooltipPromise) {
                        $timeout.cancel(showTooltipPromise);
                    }
                    var enabled = utils.firstProperty([$scope.task.model.tooltips, $scope.task.row.model.tooltips], 'enabled', $scope.pluginScope.enabled);
                    if (enabled && newValue === true) {
                        showTooltipPromise = $timeout(function() {
                            showTooltip(mousePositionX);
                        }, 500, true);
                    } else {
                        if (!$scope.task.active) {
                            hideTooltip();
                        }
                    }
                };

                $scope.task.$element.bind('mousemove', function(evt) {
                    mousePositionX = evt.clientX;
                });

                $scope.task.$element.bind('mouseenter', function(evt) {
                    $scope.mouseEnterX = evt.clientX;
                    displayTooltip(true);
                    $scope.$digest();
                });

                $scope.task.$element.bind('mouseleave', function() {
                    $scope.mouseEnterX = undefined;
                    displayTooltip(false);
                    $scope.$digest();
                });

                if ($scope.pluginScope.api.tasks.on.moveBegin) {
                    var mouseMoveHandler = smartEvent($scope, bodyElement, 'mousemove', debounce(function(e) {
                        updateTooltip(e.clientX);
                    }, 5, false));

                    $scope.pluginScope.api.tasks.on.moveBegin($scope, function(task) {
                        if (task === $scope.task) {
                            mouseMoveHandler.bind();
                        }
                    });

                    $scope.pluginScope.api.tasks.on.moveEnd($scope, function(task) {
                        if (task === $scope.task) {
                            mouseMoveHandler.unbind();
                        }
                    });

                    $scope.pluginScope.api.tasks.on.resizeBegin($scope, function(task) {
                        if (task === $scope.task) {
                            mouseMoveHandler.bind();
                        }
                    });

                    $scope.pluginScope.api.tasks.on.resizeEnd($scope, function(task) {
                        if (task === $scope.task) {
                            mouseMoveHandler.unbind();
                        }
                    });
                }

                var getViewPortWidth = function() {
                    var d = $document[0];
                    return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
                };

                var showTooltip = function(x) {
                    $element.toggleClass('ng-hide', false);

                    $timeout(function() {
                        updateTooltip(x);

                        $element.css('top', parentElement[0].getBoundingClientRect().top + 'px');
                        $element.css('marginTop', -$element[0].offsetHeight - 8 + 'px');
                        $element.css('opacity', 1);
                    }, 0, true);
                };

                var updateTooltip = function(x) {
                    // Check if info is overlapping with view port
                    if (x + $element[0].offsetWidth > getViewPortWidth()) {
                        $element.css('left', (x + 20 - $element[0].offsetWidth) + 'px');
                        $element.addClass('gantt-task-infoArrowR'); // Right aligned info
                        $element.removeClass('gantt-task-infoArrow');
                    } else {
                        $element.css('left', (x - 20) + 'px');
                        $element.addClass('gantt-task-infoArrow');
                        $element.removeClass('gantt-task-infoArrowR');
                    }
                };

                var hideTooltip = function() {
                    $element.css('opacity', 0);
                    $element.toggleClass('ng-hide', true);
                };

                $scope.gantt.api.directives.raise.new('ganttTooltip', $scope, $element);
                $scope.$on('$destroy', function() {
                    $scope.gantt.api.directives.raise.destroy('ganttTooltip', $scope, $element);
                });
            }]
        };
    }]);
}());

