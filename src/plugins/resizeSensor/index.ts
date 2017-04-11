import angular from 'angular';

import ganttModule from '../../index';

import resizeSensorDirective from './resizeSensor.directive';

const pluginModule = 'gantt.resizeSensor';

angular.module(pluginModule, [ganttModule])
  .directive('ganttResizeSensor', resizeSensorDirective);

export default pluginModule;
