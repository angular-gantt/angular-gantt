import angular from 'angular';

import ganttModule from '../../index';

import cornerDirective from './corner.directive';
import cornerAreaDirective from './cornerArea.directive';

const pluginModule = 'gantt.corner';

require('./corner.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttCorner', cornerDirective)
  .directive('ganttCornerArea', cornerAreaDirective);

export default pluginModule;
