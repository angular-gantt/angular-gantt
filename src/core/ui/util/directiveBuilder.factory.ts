import {IControllerService, ITemplateCacheService} from 'angular'

export class GanttDirectiveBuilder {
  static $templateCache: ITemplateCacheService

  directiveName: string
  templateUrl: string
  require: string | string[]
  restrict: string

  controller: IControllerService
  scope: boolean
  transclude: boolean
  replace: boolean

  constructor (directiveName: string, templateUrl?: string, require: string | string[] = '^gantt', restrict = 'E') {
    this.directiveName = directiveName
    this.templateUrl = templateUrl === undefined ? 'template/' + directiveName + '.tmpl.html' : templateUrl
    this.require = require === undefined ? '^gantt' : require
    this.restrict = restrict === undefined ? 'E' : restrict
    this.scope = false
    this.transclude = true
    this.replace = true
  }

  build () {
    let directiveName = this.directiveName
    let templateUrl = this.templateUrl
    let controllerFunction = this.controller

    let directive = {
      restrict: this.restrict,
      require: this.require,
      transclude: this.transclude,
      replace: this.replace,
      scope: this.scope,
      templateUrl: function (tElement, tAttrs) {
        if (tAttrs.templateUrl !== undefined) {
          templateUrl = tAttrs.templateUrl
        }
        if (tAttrs.template !== undefined) {
          GanttDirectiveBuilder.$templateCache.put(templateUrl, tAttrs.template)
        }
        return templateUrl
      },
      compile: function () {
        return {
          pre: function preLink (scope, iElement, iAttrs, controller) {
            scope.gantt.api.directives.raise.preLink(directiveName, scope, iElement, iAttrs, controller)
          },
          post: function postLink (scope, iElement, iAttrs, controller) {
            scope.gantt.api.directives.raise.postLink(directiveName, scope, iElement, iAttrs, controller)

          }
        }
      },
      controller: function ($scope, $element, $attrs) {
        'ngInject'
        let controller = this

        if (controllerFunction !== undefined) {
          controllerFunction($scope, $element, $attrs, controller)
        }

        $scope.gantt.api.directives.raise.controller(directiveName, $scope, $element, $attrs, controller)
        $scope.$on('$destroy', function () {
          $scope.gantt.api.directives.raise.destroy(directiveName, $scope, $element, $attrs, controller)
        })

        $scope.$applyAsync(function () {
          $scope.gantt.api.directives.raise.new(directiveName, $scope, $element, $attrs, controller)
        })
      }
    }

    if (!templateUrl) {
      delete directive.templateUrl
      delete directive.replace
      delete directive.transclude
    }

    return directive
  }
}

export default function ($templateCache: ITemplateCacheService) {
  'ngInject'

  GanttDirectiveBuilder.$templateCache = $templateCache
  return GanttDirectiveBuilder
}
