export default function () {
  'ngInject';
  return {
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
      let scopeVariable = $attrs.ganttContainerHeightListener;
      if (scopeVariable === '') {
        scopeVariable = 'ganttContainerHeight';
      }

      let effectiveScope = $scope;

      while (scopeVariable.indexOf('$parent.') === 0) {
        scopeVariable = scopeVariable.substring('$parent.'.length);
        effectiveScope = effectiveScope.$parent;
      }

      effectiveScope.$watch(function () {
        let el = $element[0].parentElement ? $element[0].parentElement.parentElement : undefined;
        if (el) {
          let height = el.offsetHeight;

          let style = getComputedStyle(el);
          height = height - parseInt(style.marginTop, 10) - parseInt(style.marginBottom, 10);

          return height;
        }
        return 0;
      }, function (newValue) {
        if (newValue > 0) {
          effectiveScope[scopeVariable] = newValue;
        }
      });
    }]
  };
}
