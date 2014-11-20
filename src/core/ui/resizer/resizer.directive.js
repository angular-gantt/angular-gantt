(function() {
    'use strict';

    angular.module('gantt').directive('ganttResizer', ['$document', 'ganttMouseOffset', function($document, mouseOffset) {
        return {
            scope: {
                ganttResizer: '='
            },
            link: function($scope, $element, $attrs) {
                $scope.$watch('ganttResizer', function(value) {
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

                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                }

                function mousemove(event) {
                    if ($attrs.resizerClasses) {
                        // Handle vertical resizer
                        var width;

                        angular.forEach($document[0].getElementsByClassName($attrs.resizerClasses), function(element) {
                            var offset = mouseOffset.getOffsetForElement(element, event);
                            width = offset.x;
                            element.style.width = width + 'px';
                        });

                        if ($attrs.resizerWidth && width !== undefined) {
                            $scope.$eval($attrs.resizerWidth + ' =  $$xValue', {'$$xValue': width});
                            $scope.$apply();
                        }
                    }
                }

                function mouseup() {
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }]);
}());
