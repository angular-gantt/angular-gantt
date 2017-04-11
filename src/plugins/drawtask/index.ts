import angular from 'angular';

import ganttModule from '../../index';

import drawTaskDirective from './drawTask.directive';

const pluginModule = 'gantt.drawtask';

angular.module(pluginModule, [ganttModule])
  .directive('ganttDrawTask', drawTaskDirective);

export default pluginModule;
