import angular from 'angular'

import ganttModule from '../../index'

import groupsDirective from './groups.directive'
import taskGroupDirective from './taskGroup.directive'
import GanttTaskGroupFactory from './taskGroup.factory'
import ganttTaskOverviewDirective from './taskOverview.directive'
import GanttGroupController from './group.controller'

const pluginModule = 'gantt.groups'

require('./groups.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttGroups', groupsDirective)
  .directive('ganttTaskGroup', taskGroupDirective)
  .directive('ganttTaskOverview', ganttTaskOverviewDirective)
  .factory('GanttTaskGroup', GanttTaskGroupFactory)
  .controller('GanttGroupController', GanttGroupController)

export default pluginModule
