import angular from 'angular'
import 'angular-native-dragdrop'

import ganttModule from '../../index'

import ganttSortableDirective from './sortable.directive'

const pluginModule = 'gantt.sortable'

require('./sortable.css')

angular.module(pluginModule, ['ang-drag-drop', ganttModule])
  .directive('ganttSortable', ganttSortableDirective)

export default pluginModule
