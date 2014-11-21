(function() {
    'use strict';

    angular.module('gantt').directive('ganttResizer', ['$document', 'ganttMouseOffset', function($document, mouseOffset) {
        return {
            restrict: 'A',
            require: '^gantt',
            scope: {
                targetElement: '=ganttResizer',
                enabled: '=?ganttResizerEnabled'
            },
            link: function ($scope, $element, $attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;
                var eventTopic = $attrs.ganttResizerEventTopic;

                if ($scope.enabled === undefined) {
                    $scope.enabled = true;
                }

                $scope.$watch('enabled', function (value) {
                    if (value === undefined) {
                        value = true;
                    }

                    $element.toggleClass('gantt-resizer-enabled', value);

                    if (value) {
                        $element.on('mousedown', mousedown);
                    } else {
                        $element.off('mousedown', mousedown);
                    }
                });

                function mousedown(event) {
                    event.preventDefault();

                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeBegin(getWidth());
                    }
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                function mousemove(event) {
                    var offset = mouseOffset.getOffsetForElement($scope.targetElement[0], event);
                    var width = offset.x;

                    if (width !== undefined) {
                        setWidth(width);
                    }
                }

                function mouseup() {
                    if (eventTopic !== undefined) {
                        api[eventTopic].raise.resizeEnd(getWidth());
                    }
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }

                function setWidth(width) {
                    var oldWidth = getWidth();
                    if (oldWidth !== width) {
                        $scope.targetElement[0].style.width = width + 'px';

                        if ($attrs.resizerWidth) {
                            $scope.$eval($attrs.resizerWidth + ' =  $$xValue', {'$$xValue': width});
                            ganttCtrl.gantt.$scope.$digest(); // May not be there as resizer is generic ?
                        }

                        if (eventTopic !== undefined) {
                            api[eventTopic].raise.resize(width);
                        }
                    }
                }

                function getWidth() {
                    return $scope.targetElement[0].offsetWidth;
                }

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
