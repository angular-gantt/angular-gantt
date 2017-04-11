import angular from 'angular';

import ganttModule from '../../index';

import ganttSortableDirective from './sortable.directive';

const pluginModule = 'gantt.sortable';

require('./sortable.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttSortable', ganttSortableDirective);

export default pluginModule;
