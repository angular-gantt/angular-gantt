import angular from 'angular';

import ganttModule from '../../index';

import ganttTooltipsDirective from './tooltips.directive';
import ganttTooltipDirective from './tooltip.directive';

const pluginModule = 'gantt.tooltips';

require('./tooltips.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttTooltips', ganttTooltipsDirective)
  .directive('ganttTooltip', ganttTooltipDirective);

export default pluginModule;
