export default function () {
  'ngInject';
  // Auto released the binding when the scope is destroyed. Use if an event is registered on another element than the scope.

  function ganttSmartEvent($scope, $element, event, fn) {
    $scope.$on('$destroy', function () {
      $element.unbind(event, fn);
    });

    return {
      bindOnce: function () {
        $element.one(event, fn);
      },
      bind: function () {
        $element.bind(event, fn);
      },
      unbind: function () {
        $element.unbind(event, fn);
      }
    };
  }

  return ganttSmartEvent;
}
