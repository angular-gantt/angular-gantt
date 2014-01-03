gantt.directive('ganttResizable', ['$document', 'mouseOffset', function ($document, mouseOffset) {

    return {
        restrict: "A",
        scope: { modes: "=resizeModes",
                 width: "=resizeWidth",
                 height: "=resizeHeight",
                 minWidth: "=resizeMinWidth",
                 minHeight: "=resizeMinHeight" },
        controller: ['$scope', '$element', function ($scope, $element) {
            $scope.modes = $scope.modes.toUpperCase();
            var originalPos;

            $element.bind("mousedown", function (e) {
                var mode = getMode(e);
                if (mode !== "") {
                    enableResizeMode(mode, e);

                    var moveHandler = function(e) {
                        $scope.$apply(function() {

                            if (mode === "N" || mode === "S") {
                                $scope.height += e.screenY - originalPos;
                                if ($scope.height < $scope.minHeight) {
                                    $scope.height  = $scope.minHeight;
                                }

                                originalPos = e.screenY;
                            } else {
                                $scope.width += e.screenX - originalPos;
                                if ($scope.width < $scope.minWidth) {
                                    $scope.width  = $scope.minWidth;
                                }

                                originalPos = e.screenX;
                            }
                        });
                    };

                    angular.element($document[0].body).bind("mousemove", moveHandler);

                    var disableHandler = function () {
                        angular.element($document[0].body).unbind('mousemove', moveHandler);
                        angular.element($document[0].body).unbind('mouseup', disableHandler);
                        disableResizeMode();
                    };

                    angular.element($document[0].body).bind("mouseup", disableHandler);

                    e.preventDefault();
                }
            });

            $element.bind("mousemove", function (e) {
                var mode = getMode(e);

                if (mode !== "") {
                    $element.css("cursor", getCursor(mode));
                } else {
                    $element.css("cursor", '');
                }
            });

            var getMode = function (e) {
                var offset = mouseOffset.getOffset(e);
                var x = offset.x, y = offset.y;
                var distance = 5;

                if ($scope.modes.indexOf('E') !== -1 && x > $element[0].offsetWidth - distance) {
                    return "E";
                } else if ($scope.modes.indexOf('W') !== -1 && x < distance) {
                    return "W";
                } else  if ($scope.modes.indexOf('S') !== -1 && y > $element[0].offsetHeight - distance) {
                    return "S";
                } else if ($scope.modes.indexOf('N') !== -1 && y < distance) {
                    return "N";
                } else {
                    return "";
                }
            };

            var getCursor = function(mode) {
                switch(mode) {
                    case "N": return 'n-resize';
                    case "E": return 'e-resize';
                    case "S": return 's-resize';
                    case "W": return 'w-resize';
                }
            };

            var enableResizeMode = function (mode, e) {
                originalPos = mode === "N" || mode === "S" ? e.screenY: e.screenX;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
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