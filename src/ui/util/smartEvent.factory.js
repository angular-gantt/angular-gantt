gantt.factory('smartEvent',[function () {
    function smartEvent($scope, $element, event, fn) {
        $scope.$on('$destroy', function() {
            $element.unbind(event, fn);
        });

        return {
          bindOnce: function() {
            $element.one(event, fn);
          },
          bind: function() {
            $element.bind(event, fn);
          },
          unbind: function() {
            $element.unbind(event, fn);
          }
        };
    }

    return smartEvent;
}]);