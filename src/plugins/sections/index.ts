import angular from 'angular'

import ganttModule from '../../index'

import sectionsDirective from './sections.directive'
import taskSectionDirective from './taskSection.directive'
import taskSectionsDirective from './taskSections.directive'

const pluginModule = 'gantt.sections'

require('./sections.css')

angular.module(pluginModule, [ganttModule])
  .directive('ganttSections', sectionsDirective)
  .directive('ganttTaskSection', taskSectionDirective)
  .directive('ganttTaskSections', taskSectionsDirective)

export default pluginModule
