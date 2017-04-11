import angular from 'angular';

import ganttModule from '../../index';

import ganttTableDirective from './table.directive';
import ganttSideContentTable from './sideContentTable.directive';
import TableColumnController from './tableColumn.controller';
import TableColumnRowController from './tableColumnRow.controller';

const pluginModule = 'gantt.table';

require('./table.css');

angular.module(pluginModule, [ganttModule])
  .directive('ganttTable', ganttTableDirective)
  .directive('ganttSideContentTable', ganttSideContentTable)
  .controller('TableColumnController', TableColumnController)
  .controller('TableColumnRowController', TableColumnRowController);

export default pluginModule;
