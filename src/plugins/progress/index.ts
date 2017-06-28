import angular from 'angular'

import ganttModule from '../../index'

import progressDirective from './progress.directive'
import taskProgressDirective from './taskProgress.directive'

const pluginModule = 'gantt.progress'

require('./progress.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttProgress', progressDirective)
  .directive('ganttTaskProgress', taskProgressDirective)

export default pluginModule
