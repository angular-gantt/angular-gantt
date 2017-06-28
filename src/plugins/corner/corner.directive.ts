import angular from 'angular'

import GanttUtilsService from '../../core/logic/util/utils.service'

require('./corner.tmpl.html')

export default function (ganttUtils: GanttUtilsService, $compile, $document) {
  'ngInject'
  // Provides customization for corner area

  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      headersLabels: '=?',
      headersLabelsTemplates: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.corner) === 'object') {
        for (let option in scope.options.corner) {
          scope[option] = scope.options.corner[option]
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true
      }

      api.directives.on.new(scope, function (directiveName, sideBackgroundScope, sideBackgroundElement) {
        if (directiveName === 'ganttSideBackground') {
          let cornerScope = sideBackgroundScope.$new()
          cornerScope.pluginScope = scope

          let ifElement = $document[0].createElement('div')
          angular.element(ifElement).attr('data-ng-if', 'pluginScope.enabled')
          angular.element(ifElement).addClass('gantt-corner-area')

          let topElement = $document[0].createElement('gantt-corner-area')
          angular.element(ifElement).append(topElement)

          sideBackgroundElement[0].parentNode.insertBefore($compile(ifElement)(cornerScope)[0], sideBackgroundElement[0].nextSibling)
        }
      })

    }
  }
}
