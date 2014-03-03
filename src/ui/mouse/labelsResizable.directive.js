gantt.directive('ganttLabelResizable', ['$document', 'debounce', 'mouseOffset', function ($document, debounce, mouseOffset) {

    return {
        restrict: "A",
        scope: { width: "=ganttLabelResizable",
                 minWidth: "=resizeMin" },
        controller: ['$scope', '$element', function ($scope, $element) {
            var resizeAreaWidth = 5;
            var cursor = 'ew-resize';
            var originalPos;

            $element.bind("mousedown", function (e) {
                if (isInResizeArea(e)) {
                    enableResizeMode(e);
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

            var resize = function(x) {
                if ($scope.width === 0) {
                    $scope.width = $element[0].offsetWidth;
                }

                $scope.width += x - originalPos;
                if ($scope.width < $scope.minWidth) {
                    $scope.width  = $scope.minWidth;
                }

                originalPos = x;
            };

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

                var moveHandler = debounce(function(e) {
                    resize(e.screenX);
                }, 5);

                angular.element($document[0].body).bind("mousemove", moveHandler);

                angular.element($document[0].body).one("mouseup", function() {
                    angular.element($document[0].body).unbind('mousemove', moveHandler);
                    disableResizeMode();
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