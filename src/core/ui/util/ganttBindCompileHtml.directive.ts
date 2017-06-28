export default function ($compile) {
  'ngInject'

  return {
    restrict: 'A',
    require: '^gantt',
    link: function (scope, element, attrs, ganttCtrl) {
      scope.scope = ganttCtrl.gantt.$scope.$parent
      scope.$watch(function () {
        return scope.$eval(attrs.ganttBindCompileHtml)
      }, function (value) {
        element.html(value)
        $compile(element.contents())(scope)
      })
    }
  }
}
