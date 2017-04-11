import angular from 'angular';

import ganttModule from '../../index';

import labelsDirective from './labels.directive';
import sideContentLabelsDirective from './sideContentLabels.directive';
import labelHeaderDirective from './labelsHeader.directive';
import labelsBodyDirective from './labelsBody.directive';

const pluginModule = 'gantt.labels';

require('./labels.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttLabels', labelsDirective)
  .directive('ganttSideContentLabels', sideContentLabelsDirective)
  .directive('ganttLabelsHeader', labelHeaderDirective)
  .directive('ganttLabelsBody', labelsBodyDirective);

export default pluginModule;
