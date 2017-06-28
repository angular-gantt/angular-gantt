export default function () {
  'ngInject'
  return {
    restrict: 'A',
    controller: function ($scope, $element, $attrs) {
      'ngInject'
      let scopeVariable = $attrs.ganttContainerWidthListener
      if (scopeVariable === '') {
        scopeVariable = 'ganttContainerWidth'
      }

      let effectiveScope = $scope

      while (scopeVariable.indexOf('$parent.') === 0) {
        scopeVariable = scopeVariable.substring('$parent.'.length)
        effectiveScope = effectiveScope.$parent
      }

      effectiveScope.$watch(function () {
        let el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined
        if (el) {
          let width = el.offsetWidth

          let style = getComputedStyle(el)
          width = width - parseInt(style.marginLeft, 10) - parseInt(style.marginRight, 10)

          return width
        }
        return 0
      }, function (newValue) {
        if (newValue > 0) {
          effectiveScope[scopeVariable] = newValue
        }
      })
    }
  }
}
