import angular from 'angular';

import uiTree from 'angular-ui-tree';

import ganttModule from '../../index';

import ganttTreeDirective from './tree.directive';
import ganttRowTreeLabelDirective from './rowTreeLabel.directive';
import ganttSideContentTreeDirective from './sideContentTree.directive';
import ganttTreeBodyDirective from './treeBody.directive';
import ganttTreeHeaderDirective from './treeHeader.directive';
import GanttUiTreeController from './uiTree.controller';
import GanttTreeNodeController from './treeNode.controller';
import GanttTreeController from './tree.controller';

const pluginModule = 'gantt.tree';

require('angular-ui-tree/dist/angular-ui-tree.css');
require('./tree.css');

angular.module(pluginModule, [ganttModule, uiTree || 'ui.tree']) // https://github.com/angular-ui-tree/angular-ui-tree/issues/937
  .directive('ganttTree', ganttTreeDirective)
  .directive('ganttRowTreeLabel', ganttRowTreeLabelDirective)
  .directive('ganttSideContentTree', ganttSideContentTreeDirective)
  .directive('ganttTreeBody', ganttTreeBodyDirective)
  .directive('ganttTreeHeader', ganttTreeHeaderDirective)
  .controller('GanttUiTreeController', GanttUiTreeController)
  .controller('GanttTreeNodeController', GanttTreeNodeController)
  .controller('GanttTreeController', GanttTreeController);

export default pluginModule;
