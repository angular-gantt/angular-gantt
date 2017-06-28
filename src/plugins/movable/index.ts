import angular from 'angular'

import ganttModule from '../../index'

import movableDirective from './movable.directive'
import movableOptionsFactory from './movableOptions.factory'

const pluginModule = 'gantt.movable'

require('./movable.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttMovable', movableDirective)
  .factory('ganttMovableOptions', movableOptionsFactory)

export default pluginModule
