import angular from 'angular'

import ganttModule from '../../index'

import boundsDirective from './bounds.directive'
import taskBoundsDirective from './taskBounds.directive'

const pluginModule = 'gantt.bounds'

require('./bounds.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttBounds', boundsDirective)
  .directive('ganttTaskBounds', taskBoundsDirective)

export default pluginModule
