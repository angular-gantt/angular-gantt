gantt.directive('ganttLabelResizable', ['$document', 'mouseOffset', function ($document, mouseOffset) {

    return {
        restrict: "A",
        scope: { width: "=ganttLabelResizable",
                 minWidth: "=resizeMin" },
        controller: ['$scope', '$element', function ($scope, $element) {
            var originalPos;
            var resizeAreaWidth = 5;
            var cursor = 'ew-resize';

            $element.bind("mousedown", function (e) {
                if (isInResizeArea(e)) {
                    enableResizeMode(e);

                    var moveHandler = function(e) {
                        $scope.$apply(function() {

                            if ($scope.width === 0) {
                                $scope.width = $element[0].offsetWidth;
                            }

                            $scope.width += e.screenX - originalPos;
                            if ($scope.width < $scope.minWidth) {
                                $scope.width  = $scope.minWidth;
                            }

                            originalPos = e.screenX;
                        });
                    };

                    angular.element($document[0].body).bind("mousemove", moveHandler);

                    var disableHandler = function () {
                        $scope.$apply(function(){
                            angular.element($document[0].body).unbind('mousemove', moveHandler);
                            angular.element($document[0].body).unbind('mouseup', disableHandler);
                            disableResizeMode();
                        });
                    };

                    angular.element($document[0].body).bind("mouseup", disableHandler);

                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                if (isInResizeArea(e)) {
                    $element.css("cursor", cursor);
                } else {
                    $element.css("cursor", '');
                }
            });

            var isInResizeArea = function (e) {
                var x = mouseOffset.getOffset(e).x;

                return x > $element[0].offsetWidth - resizeAreaWidth;
            };

            var enableResizeMode = function (e) {
                originalPos = e.screenX;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': cursor
                });
            };

            var disableResizeMode = function () {
                $element.css("cursor", '');

                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });
            };
        }]
    };
}]);