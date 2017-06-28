export default function () {
  'ngInject'
  return {
    restrict: 'A',
    controller: function ($scope, $element, $attrs) {
      'ngInject'
      let scopeVariable = $attrs.ganttElementHeightListener
      if (scopeVariable === '') {
        scopeVariable = 'ganttElementHeight'
      }

      let el = $element[0]
      let effectiveScope = $scope

      while (scopeVariable.indexOf('$parent.') === 0) {
        scopeVariable = scopeVariable.substring('$parent.'.length)
        effectiveScope = effectiveScope.$parent
      }

      effectiveScope.$watch(function () {
        return el.clientHeight
      }, function (newValue) {
        if (newValue > 0) {
          effectiveScope[scopeVariable] = newValue
        }
      })
    }
  }
}
