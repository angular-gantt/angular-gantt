(function() {
    'use strict';

    angular.module('gantt').directive('ganttResizer', ['$document', '$parse', '$timeout', 'ganttMouseOffset', function($document, $parse, $timeout, mouseOffset) {
        return {
            restrict: 'A',
            require: '^gantt',
            scope: {
                targetElement: '=ganttResizer',
                enabled: '@?ganttResizerEnabled'
            },
            link: function ($scope, $element, $attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;
                var eventTopic = $attrs.ganttResizerEventTopic;

                if ($scope.enabled === undefined) {
                    $scope.enabled = true;
                }

                function getWidth() {
                    return ganttCtrl.gantt.options.value($attrs.resizerWidth);
                }

                function setWidth(width) {
                    if (width !== getWidth()) {
                        ganttCtrl.gantt.options.set($attrs.resizerWidth, width);

                        if (eventTopic !== undefined) {
                            api[eventTopic].raise.resize(width);
                        }

                        $timeout(function() {
                            ganttCtrl.gantt.columnsManager.updateColumnsMeta();
                        });
                    }
                }

                function dblclick(event) {
                    event.preventDefault();
                    setWidth(undefined);
                }

                function mousemove(event) {
                    $scope.$evalAsync(function (){
                        var offset = mouseOffset.getOffsetForElement($scope.targetElement[0], event);
                        var maxWidth = ganttCtrl.gantt.getWidth()-ganttCtrl.gantt.scroll.getBordersWidth();
                        var width = Math.min(Math.max(offset.x, 0), maxWidth);
                        setWidth(width);
                    });
                }

                function mouseup() {
                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeEnd(getWidth());
                    }
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }


                function mousedown(event) {
                    event.preventDefault();

                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeBegin(getWidth());
                    }
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                $attrs.$observe('ganttResizerEnabled', function(value) {
                    $scope.enabled = $parse(value)();
                });

                $scope.$watch('enabled', function (value) {
                    if (value === undefined) {
                        value = true;
                    }

                    $element.toggleClass('gantt-resizer-enabled', value);

                    if (value) {
                        $element.on('dblclick', dblclick);
                        $element.on('mousedown', mousedown);
                    } else {
                        $element.off('dblclick', dblclick);
                        $element.off('mousedown', mousedown);
                    }
                });

                $scope.$watch(function() {
                    return getWidth();
                }, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        $scope.targetElement.css('width', newValue + 'px');
                        // Setting width again is required when min-width of max-width is set on targetElement.
                        // This avoid going to a smaller or bigger value than targetElement capabilities.
                        // Call of 'offsetWidth' is slow. Behaviour needs to be improved.
                        if ($scope.targetElement[0].offsetWidth > 0) {
                            setWidth($scope.targetElement[0].offsetWidth);
                        }
                    }
                });

                if (eventTopic) {
                    api.registerEvent(eventTopic, 'resize');
                    api.registerEvent(eventTopic, 'resizeBegin');
                    api.registerEvent(eventTopic, 'resizeEnd');
                    api.registerMethod(eventTopic, 'setWidth', setWidth, this);
                    api.registerMethod(eventTopic, 'getWidth', getWidth, this);
                }
            }
        };
    }]);
}());
