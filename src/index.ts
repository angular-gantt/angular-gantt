import angular, {IFilterService} from 'angular';

require('./template/gantt.tmpl.html');
require('./gantt.css');

import ganttDirective from './core/gantt.directive';
import ganttResizerDirective from './core/ui/resizer/resizer.directive';
import ganttContainerHeightListenerDirective from './core/ui/size/containerHeightListener.directive';
import ganttContainerWidthListenerDirective from './core/ui/size/containerWidthListener.directive';
import ganttElementHeightListenerDirective from './core/ui/size/elementHeightListener.directive';
import ganttElementWidthListenerDirective from './core/ui/size/elementWidthListener.directive';
import ganttHorizontalScrollReceiverDirective from './core/ui/scroll/horizontalScrollReceiver.directive';
import ganttScrollableDirective from './core/ui/scroll/scrollable.directive';
import ganttScrollManagerDirective from './core/ui/scroll/scrollManager.directive';
import ganttScrollSenderDirective from './core/ui/scroll/scrollSender.directive';
import ganttVerticalScrollReceiver from './core/ui/scroll/verticalScrollReceiver.directive';
import ganttBodyDirective from './core/ui/template/body.directive';
import ganttBodyBackgroundDirective from './core/ui/template/bodyBackground.directive';
import ganttBodyColumnsDirective from './core/ui/template/bodyColumns.directive';
import ganttBodyForegroundDirective from './core/ui/template/bodyForeground.directive';
import ganttBodyRowsDirective from './core/ui/template/bodyRows.directive';
import ganttColumnDirective from './core/ui/template/column.directive';
import ganttColumnHeaderDirective from './core/ui/template/columnHeader.directive';
import ganttHeaderDirective from './core/ui/template/header.directive';
import ganttHeaderColumnsDirective from './core/ui/template/headerColumns.directive';
import ganttRowDirective from './core/ui/template/row.directive';
import ganttRowBackgroundDirective from './core/ui/template/rowBackground.directive';
import ganttRowLabelDirective from './core/ui/template/rowLabel.directive';
import ganttScrollableHeaderDirective from './core/ui/template/scrollableHeader.directive';
import ganttSideDirective from './core/ui/template/side.directive';
import ganttSideBackgroundDirective from './core/ui/template/sideBackground.directive';
import ganttSideContentDirective from './core/ui/template/sideContent.directive';
import ganttTaskDirective from './core/ui/template/task.directive';
import ganttTaskBackgroundDirective from './core/ui/template/taskBackground.directive';
import ganttTaskContentDirective from './core/ui/template/taskContent.directive';
import ganttTaskForegroundDirective from './core/ui/template/taskForeground.directive';
import ganttTimeFrameDirective from './core/ui/template/timeFrame.directive';
import ganttTimespanDirective from './core/ui/template/timespan.directive';
import ganttBindCompileHtmlDirective from './core/ui/util/ganttBindCompileHtml.directive';

import ganttFactory from './core/logic/gantt.factory';
import ganttApiFactory from './core/logic/api/api.factory';
import ganttOptionsFactory from './core/logic/api/options.factory';
import ganttCalendarFactory from './core/logic/calendar/calendar.factory';
import ganttScrollFactory from './core/logic/template/scroll.factory';
import ganttBodyFactory from './core/logic/template/body.factory';
import ganttBodyColumnsFactory from './core/logic/template/bodyColumns.factory';
import ganttBodyRowsFactory from './core/logic/template/bodyRows.factory';
import ganttBodyBackgroundFactory from './core/logic/template/bodyBackground.factory';
import ganttBodyForegroundFactory from './core/logic/template/bodyForeground.factory';
import ganttHeaderFactory from './core/logic/template/header.factory';
import ganttHeaderColumnsFactory from './core/logic/template/headerColumns.factory';
import ganttSideFactory from './core/logic/template/side.factory';
import ganttObjectModelFactory from './core/logic/model/objectModel.factory';
import ganttTaskFactory from './core/logic/task/task.factory';
import ganttRowFactory from './core/logic/row/row.factory';
import ganttRowsManagerFactory from './core/logic/row/rowsManager.factory';
import ganttColumnFactory from './core/logic/column/column.factory';
import ganttColumnBuilderFactory from './core/logic/column/columnBuilder.factory';
import ganttColumnHeaderFactory from './core/logic/column/columnHeader.factory';
import ganttColumnsManagerFactory from './core/logic/column/columnsManager.factory';
import ganttTimespanFactory from './core/logic/timespan/timespan.factory';
import ganttTimespansManagerFactory from './core/logic/timespan/timespansManager.factory';
import ganttCurrentDateManagerFactory from './core/logic/calendar/currentDateManager.factory';
import ganttHierarchyFactory from './core/logic/util/hierarchy.factory';
import ganttDebounceFactory from './core/ui/util/debounce.factory';
import ganttSmartEventFactory from './core/ui/util/smartEvent.factory';

import ganttEnableNgAnimateService from './core/ui/util/enableNgAnimate.service';
import ganttUtilsService from './core/logic/util/utils.service';
import ganttArraysService from './core/logic/util/arrays.service';
import ganttDirectiveBuilderService from './core/ui/util/directiveBuilder.service';
import ganttBinarySearchService from './core/logic/util/binarySearch.service';
import ganttLayoutService from './core/ui/util/layout.service';
import ganttHeadersGeneratorService from './core/logic/column/headersGenerator.service';
import ganttColumnGeneratorService from './core/logic/column/columnGenerator.service';
import ganttDomService from './core/ui/util/dom.service';
import ganttMouseButtonService from './core/ui/util/mouseButton.service';
import ganttMouseOffsetService from './core/ui/util/mouseOffset.service';

import ganttColumnLimitFilter, {IFilterGanttColumnLimit} from './core/ui/limit/columnLimit.filter';
import ganttTaskLimitFilter, {IFilterGanttTaskLimit} from './core/ui/limit/taskLimit.filter';

const module = 'gantt';

angular
  .module(module, [])
  .directive('gantt', ganttDirective)
  .directive('ganttResizer', ganttResizerDirective)
  .directive('ganttContainerWidthListener', ganttContainerWidthListenerDirective)
  .directive('ganttContainerHeightListener', ganttContainerHeightListenerDirective)
  .directive('ganttElementWidthListener', ganttElementWidthListenerDirective)
  .directive('ganttElementHeightListener', ganttElementHeightListenerDirective)
  .directive('ganttHorizontalScrollReceiver', ganttHorizontalScrollReceiverDirective)
  .directive('ganttScrollable', ganttScrollableDirective)
  .directive('ganttScrollManager', ganttScrollManagerDirective)
  .directive('ganttScrollSender', ganttScrollSenderDirective)
  .directive('ganttVerticalScrollReceiver', ganttVerticalScrollReceiver)
  .directive('ganttBindCompileHtml', ganttBindCompileHtmlDirective)
  .directive('ganttBody', ganttBodyDirective)
  .directive('ganttBodyBackground', ganttBodyBackgroundDirective)
  .directive('ganttBodyColumns', ganttBodyColumnsDirective)
  .directive('ganttBodyForeground', ganttBodyForegroundDirective)
  .directive('ganttBodyRows', ganttBodyRowsDirective)
  .directive('ganttColumn', ganttColumnDirective)
  .directive('ganttColumnHeader', ganttColumnHeaderDirective)
  .directive('ganttHeader', ganttHeaderDirective)
  .directive('ganttHeaderColumns', ganttHeaderColumnsDirective)
  .directive('ganttRow', ganttRowDirective)
  .directive('ganttRowBackground', ganttRowBackgroundDirective)
  .directive('ganttRowLabel', ganttRowLabelDirective)
  .directive('ganttScrollableHeader', ganttScrollableHeaderDirective)
  .directive('ganttSide', ganttSideDirective)
  .directive('ganttSideBackground', ganttSideBackgroundDirective)
  .directive('ganttSideContent', ganttSideContentDirective)
  .directive('ganttTask', ganttTaskDirective)
  .directive('ganttTaskBackground', ganttTaskBackgroundDirective)
  .directive('ganttTaskContent', ganttTaskContentDirective)
  .directive('ganttTaskForeground', ganttTaskForegroundDirective)
  .directive('ganttTimeFrame', ganttTimeFrameDirective)
  .directive('ganttTimespan', ganttTimespanDirective)
  .factory('Gantt', ganttFactory)
  .factory('GanttApi', ganttApiFactory)
  .factory('GanttOptions', ganttOptionsFactory)
  .factory('GanttCalendar', ganttCalendarFactory)
  .factory('GanttScroll', ganttScrollFactory)
  .factory('GanttBody', ganttBodyFactory)
  .factory('GanttBodyColumns', ganttBodyColumnsFactory)
  .factory('GanttBodyRows', ganttBodyRowsFactory)
  .factory('GanttBodyBackground', ganttBodyBackgroundFactory)
  .factory('GanttBodyForeground', ganttBodyForegroundFactory)
  .factory('GanttHeader', ganttHeaderFactory)
  .factory('GanttHeaderColumns', ganttHeaderColumnsFactory)
  .factory('GanttSide', ganttSideFactory)
  .factory('GanttObjectModel', ganttObjectModelFactory)
  .factory('GanttTask', ganttTaskFactory)
  .factory('GanttRow', ganttRowFactory)
  .factory('GanttRowsManager', ganttRowsManagerFactory)
  .factory('GanttColumn', ganttColumnFactory)
  .factory('GanttColumnHeader', ganttColumnHeaderFactory)
  .factory('GanttColumnBuilder', ganttColumnBuilderFactory)
  .factory('GanttColumnsManager', ganttColumnsManagerFactory)
  .factory('GanttTimespan', ganttTimespanFactory)
  .factory('GanttTimespansManager', ganttTimespansManagerFactory)
  .factory('GanttCurrentDateManager', ganttCurrentDateManagerFactory)
  .factory('GanttHierarchy', ganttHierarchyFactory)
  .factory('ganttDebounce', ganttDebounceFactory)
  .factory('ganttSmartEvent', ganttSmartEventFactory)
  .service('ganttEnableNgAnimate', ganttEnableNgAnimateService)
  .service('ganttUtils', ganttUtilsService)
  .service('ganttArrays', ganttArraysService)
  .service('GanttDirectiveBuilder', ganttDirectiveBuilderService)
  .service('ganttBinarySearch', ganttBinarySearchService)
  .service('ganttLayout', ganttLayoutService)
  .service('GanttHeadersGenerator', ganttHeadersGeneratorService)
  .service('GanttColumnGenerator', ganttColumnGeneratorService)
  .service('ganttDom', ganttDomService)
  .service('ganttMouseButton', ganttMouseButtonService)
  .service('ganttMouseOffset', ganttMouseOffsetService)
  .filter('ganttColumnLimit', ganttColumnLimitFilter)
  .filter('ganttTaskLimit', ganttTaskLimitFilter);

export interface IGanttFilterService extends IFilterService {
  (name: 'ganttTaskLimit'): IFilterGanttTaskLimit;
  (name: 'ganttColumnLimit'): IFilterGanttColumnLimit;
}

export default module;
