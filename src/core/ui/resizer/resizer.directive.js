(function() {
    'use strict';

    angular.module('gantt').directive('ganttResizer', ['$document', 'ganttMouseOffset', function($document, mouseOffset) {
        return {
            restrict: 'A',
            require: '^gantt',
            scope: {
                targetElement: '=ganttResizer',
                enabled: '=ganttResizerEnabled',
                eventTopic: '=ganttResizerEventTopic'
            },
            link: function ($scope, $element, $attrs, ganttCtrl) {
                var api = ganttCtrl.gantt.api;

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

                    raiseEvent('resizeBegin', getWidth());
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                function mousemove(event) {
                    var offset = mouseOffset.getOffsetForElement($scope.targetElement[0], event);
                    var width = offset.x;

                    if (width !== undefined) {
                        setWidth(width);
                        $scope.$apply(function () {
                            raiseEvent('resize', width);
                        });
                    }
                }

                function mouseup() {
                    raiseEvent('resizeEnd', getWidth());
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }

                function setWidth(width) {
                    $scope.targetElement[0].style.width = width + 'px';

                    if ($attrs.resizerWidth) {
                        $scope.$eval($attrs.resizerWidth + ' =  $$xValue', {'$$xValue': width});
                    }
                }

                function getWidth() {
                    return $scope.targetElement[0].offsetWidth;
                }

                function raiseEvent(type, width) {
                    if ($scope.eventTopic !== undefined) {
                        api[$scope.eventTopic].raise[type](width);
                    }
                }

                if ($scope.eventTopic !== undefined) {
                    api.registerMethod($scope.eventTopic, 'setWidth', setWidth, this);
                    api.registerMethod($scope.eventTopic, 'getWidth', getWidth, this);
                }
            }
        };
    }]);
}());
