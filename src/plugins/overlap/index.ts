import angular from 'angular'

import ganttModule from '../../index'

import overlapDirective from './overlap.directive'

const pluginModule = 'gantt.overlap'

require('./overlap.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttOverlap', overlapDirective)

export default pluginModule
