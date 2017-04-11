import angular from 'angular';

import ganttModule from '../../index';

import dependenciesDirective from './dependencies.directive';
import GanttDependenciesEventsFactory from './dependenciesEvents.factory';
import GanttDependenciesManagerFactory from './dependenciesManager.factory';
import GanttDependencyTaskMouseHandler from './taskMouseHandler.factory';
import GanttDependenciesCheckerFactory from './dependenciesChecker.factory';
import GanttDependencyFactory from './dependency.factory';

const pluginModule = 'gantt.dependencies';

require('./dependencies.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttDependencies', dependenciesDirective)
  .factory('GanttDependenciesEvents', GanttDependenciesEventsFactory)
  .factory('GanttDependencyTaskMouseHandler', GanttDependencyTaskMouseHandler)
  .factory('GanttDependenciesManager', GanttDependenciesManagerFactory)
  .factory('GanttDependenciesChecker', GanttDependenciesCheckerFactory)
  .factory('GanttDependency', GanttDependencyFactory);

export default pluginModule;
