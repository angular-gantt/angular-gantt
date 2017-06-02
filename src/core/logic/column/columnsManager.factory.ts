import moment from 'moment';

import GanttBinarySearch from '../util/binarySearch.service';
import GanttColumnGenerator from './columnGenerator.service';
import {GanttColumnBuilder} from './columnBuilder.factory';
import {GanttColumn} from './column.factory';
import {GanttColumnHeader} from './columnHeader.factory';
import GanttHeadersGenerator from './headersGenerator.service';
import GanttLayout from '../../ui/util/layout.service';
import {Gantt} from '../gantt.factory';
import {IGanttFilterService} from '../../../index';

export class GanttColumnsManager {
  static GanttColumnGenerator: GanttColumnGenerator;
  static GanttHeadersGenerator: GanttHeadersGenerator;
  static GanttColumnBuilder: { new(columnsManager: GanttColumnsManager): GanttColumnBuilder };
  static ganttBinarySearch: GanttBinarySearch;
  static ganttLayout: GanttLayout;
  static $filter: IGanttFilterService;

  gantt: Gantt;

  from: moment.Moment;
  to: moment.Moment;

  columns: GanttColumn[];
  visibleColumns: GanttColumn[];
  previousColumns: GanttColumn[];
  nextColumns: GanttColumn[];

  headers: GanttColumnHeader[][];
  visibleHeaders: GanttColumnHeader[][];

  columnBuilder: GanttColumnBuilder;
  scrollAnchor: moment.Moment;

  defaultHeadersFormats = {
    year: 'YYYY',
    quarter: '[Q]Q YYYY',
    month: 'MMMM YYYY',
    week: 'w',
    day: 'D',
    hour: 'H',
    minute: 'H:mm',
    second: 'H:mm:ss',
    millisecond: 'H:mm:ss:SSS'
  };

  defaultDayHeadersFormats = {day: 'LL', hour: 'H', minute: 'H:mm', second: 'H:mm:ss', millisecond: 'H:mm:ss:SSS'};
  defaultYearHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q', month: 'MMMM'};

  constructor(gantt) {
    this.gantt = gantt;

    this.from = undefined;
    this.to = undefined;

    this.columns = [];
    this.visibleColumns = [];
    this.previousColumns = [];
    this.nextColumns = [];

    this.headers = [];
    this.visibleHeaders = [];

    this.scrollAnchor = undefined;

    this.columnBuilder = new GanttColumnsManager.GanttColumnBuilder(this);

    // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
    // All those changes need a recalculation of the header columns
    this.gantt.$scope.$watchGroup(['viewScale', 'columnWidth', 'timeFramesWorkingMode', 'timeFramesNonWorkingMode', 'fromDate', 'toDate', 'autoExpand', 'taskOutOfRange'], (newValues, oldValues) => {
      if (newValues !== oldValues && this.gantt.rendered) {
        this.generateColumns();
      }
    });

    this.gantt.$scope.$watchCollection('headers', (newValues, oldValues) => {
      if (newValues !== oldValues && this.gantt.rendered) {
        this.generateColumns();
      }
    });

    this.gantt.$scope.$watchCollection('headersFormats', (newValues, oldValues) => {
      if (newValues !== oldValues && this.gantt.rendered) {
        this.generateColumns();
      }
    });

    this.gantt.$scope.$watchGroup(['ganttElementWidth', 'showSide', 'sideWidth', 'maxHeight', 'daily'], (newValues, oldValues) => {
      if (newValues !== oldValues && this.gantt.rendered) {
        this.updateColumnsMeta();
      }
    });

    (this.gantt.api as any).data.on.load(this.gantt.$scope, () => {
      if ((this.from === undefined || this.to === undefined ||
        this.from > this.gantt.rowsManager.getDefaultFrom() ||
        this.to < this.gantt.rowsManager.getDefaultTo()) && this.gantt.rendered) {
        this.generateColumns();
      }

      this.gantt.rowsManager.sortRows();
    });

    (this.gantt.api as any).data.on.remove(this.gantt.$scope, () => {
      this.gantt.rowsManager.sortRows();
    });

    this.gantt.api.registerMethod('columns', 'clear', this.clearColumns, this);
    this.gantt.api.registerMethod('columns', 'generate', this.generateColumns, this);
    this.gantt.api.registerMethod('columns', 'refresh', this.updateColumnsMeta, this);
    this.gantt.api.registerMethod('columns', 'getColumnsWidth', this.getColumnsWidth, this);
    this.gantt.api.registerMethod('columns', 'getColumnsWidthToFit', this.getColumnsWidthToFit, this);
    this.gantt.api.registerMethod('columns', 'getDateRange', this.getDateRange, this);

    this.gantt.api.registerEvent('columns', 'clear');
    this.gantt.api.registerEvent('columns', 'generate');
    this.gantt.api.registerEvent('columns', 'refresh');
  };

  setScrollAnchor() {
    if (this.gantt.scroll.$element && this.columns.length > 0) {
      let el = this.gantt.scroll.$element[0];
      let center = el.scrollLeft + el.offsetWidth / 2;

      this.scrollAnchor = this.gantt.getDateByPosition(center);
    }
  };

  scrollToScrollAnchor() {
    if (this.columns.length > 0 && this.scrollAnchor !== undefined) {
      // Ugly but prevents screen flickering (unlike $timeout)
      this.gantt.$scope.$$postDigest(() => {
        (this.gantt.api as any).scroll.toDate(this.scrollAnchor);
      });
    }
  };

  clearColumns() {
    this.setScrollAnchor();

    this.from = undefined;
    this.to = undefined;

    this.columns = [];
    this.visibleColumns = [];
    this.previousColumns = [];
    this.nextColumns = [];

    this.headers = [];
    this.visibleHeaders = [];

    (this.gantt.api as any).columns.raise.clear();
  };

  generateColumns(from?: moment.Moment | Date, to?: moment.Moment | Date) {
    if (!from) {
      from = this.gantt.options.value('fromDate');
    }

    if (!to) {
      to = this.gantt.options.value('toDate');
    }

    if (!from || (moment.isMoment(from) && !from.isValid())) {
      from = this.gantt.rowsManager.getDefaultFrom();
      if (!from) {
        return false;
      }
    }

    if (!to || (moment.isMoment(to) && !to.isValid())) {
      to = this.gantt.rowsManager.getDefaultTo();
      if (!to) {
        return false;
      }
    }

    if (from !== undefined && !moment.isMoment(from)) {
      from = moment(from);
    }

    if (to !== undefined && !moment.isMoment(to)) {
      to = moment(to);
    }

    if (this.gantt.options.value('taskOutOfRange') === 'expand') {
      from = this.gantt.rowsManager.getExpandedFrom(from as moment.Moment);
      to = this.gantt.rowsManager.getExpandedTo(to as moment.Moment);
    }

    this.setScrollAnchor();

    this.from = from as moment.Moment;
    this.to = to as moment.Moment;

    this.previousColumns = [];
    this.nextColumns = [];

    this.columns = GanttColumnsManager.GanttColumnGenerator.generate(this.columnBuilder, this.from, this.to, this.gantt.options.value('viewScale'), this.getColumnsWidth());
    this.headers = GanttColumnsManager.GanttHeadersGenerator.generate(this);

    this.updateColumnsMeta();
    this.scrollToScrollAnchor();

    (this.gantt.api as any).columns.raise.generate(this.columns, this.headers);
  };

  updateColumnsMeta() {
    this.gantt.isRefreshingColumns = true;

    let lastColumn = this.getLastColumn();
    this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

    let columnsWidthChanged = this.updateColumnsWidths(this.columns, this.headers, this.previousColumns, this.nextColumns);

    this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

    let showSide = this.gantt.options.value('showSide');
    let sideShown = this.gantt.side.isShown();
    let sideVisibilityChanged = showSide !== sideShown;

    if (sideVisibilityChanged && !showSide) {
      // Prevent unnecessary v-scrollbar if side is hidden here
      this.gantt.side.show(false);
    }

    this.gantt.rowsManager.updateTasksPosAndSize();
    this.gantt.timespansManager.updateTimespansPosAndSize();

    this.updateVisibleColumns(columnsWidthChanged);

    this.gantt.rowsManager.updateVisibleObjects();

    let currentDateValue = this.gantt.options.value('currentDateValue');
    this.gantt.currentDateManager.setCurrentDate(currentDateValue);

    if (sideVisibilityChanged && showSide) {
      // Prevent unnecessary v-scrollbar if side is shown here
      this.gantt.side.show(true);
    }

    this.gantt.isRefreshingColumns = false;
    (this.gantt.api as any).columns.raise.refresh(this.columns, this.headers);
  };

  /**
   * Returns the last Gantt column or undefined
   * @param extended
   * @returns {any}
   */
  getLastColumn(extended = false) {
    let columns = this.columns;
    if (extended) {
      columns = this.nextColumns;
    }
    if (columns && columns.length > 0) {
      return columns[columns.length - 1];
    } else {
      return undefined;
    }
  };

  /**
   * Returns the first Gantt column or undefined
   *
   * @param extended
   * @returns {any}
   */
  getFirstColumn(extended = false) {
    let columns = this.columns;
    if (extended) {
      columns = this.previousColumns;
    }

    if (columns && columns.length > 0) {
      return columns[0];
    } else {
      return undefined;
    }
  };

  /**
   * Returns the column at the given or next possible date
   *
   * @param date
   * @param disableExpand
   * @returns {GanttColumn}
   */
  getColumnByDate(date: moment.Moment, disableExpand?: boolean) {
    if (!disableExpand) {
      this.expandExtendedColumnsForDate(date);
    }
    let extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
    let columns = GanttColumnsManager.ganttBinarySearch.get(extendedColumns, date, function (c) {
      return c.date;
    }, true);
    return columns[0] === undefined ? columns[1] : columns[0];
  };

  /**
   * Returns the column at the given position x (in em)
   *
   * @param x
   * @param disableExpand
   * @returns {GanttColumn}
   */
  getColumnByPosition(x: number, disableExpand?: boolean) {
    if (!disableExpand) {
      this.expandExtendedColumnsForPosition(x);
    }
    let extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
    let columns = GanttColumnsManager.ganttBinarySearch.get(extendedColumns, x, function (c) {
      return c.left;
    }, true);
    return columns[0] === undefined ? columns[1] : columns[0];
  };

  updateColumnsWidths(columns, headers, previousColumns, nextColumns) {
    let columnWidth: number = this.gantt.options.value('columnWidth');
    let expandToFit: boolean = this.gantt.options.value('expandToFit');
    let shrinkToFit: boolean = this.gantt.options.value('shrinkToFit');

    if (columnWidth === undefined || expandToFit || shrinkToFit) {
      let newWidth = this.gantt.getBodyAvailableWidth();

      let lastColumn = this.gantt.columnsManager.getLastColumn(false);
      if (lastColumn !== undefined) {
        let currentWidth = lastColumn.originalSize.left + lastColumn.originalSize.width;

        if (expandToFit && currentWidth < newWidth ||
          shrinkToFit && currentWidth > newWidth ||
          columnWidth === undefined
        ) {
          let widthFactor = newWidth / currentWidth;

          GanttColumnsManager.ganttLayout.setColumnsWidthFactor(columns, widthFactor);
          for (let header of headers) {
            GanttColumnsManager.ganttLayout.setColumnsWidthFactor(header, widthFactor);
          }
          // previous and next columns will be generated again on need.
          previousColumns.splice(0, this.previousColumns.length);
          nextColumns.splice(0, this.nextColumns.length);
          return true;
        }
      }
    }
    return false;
  };

  getColumnsWidth() {
    let columnWidth: number = this.gantt.options.value('columnWidth');
    if (columnWidth === undefined) {
      if (!this.gantt.width || this.gantt.width <= 0) {
        columnWidth = 20;
      } else {
        columnWidth = this.gantt.width / this.columns.length;
      }
    }
    return columnWidth;
  };

  getColumnsWidthToFit() {
    return this.gantt.getBodyAvailableWidth() / this.columns.length;
  };

  expandExtendedColumnsForPosition(x) {
    let viewScale;
    if (x < 0) {
      let firstColumn = this.getFirstColumn();
      let from = firstColumn.date;
      let firstExtendedColumn = this.getFirstColumn(true);
      if (!firstExtendedColumn || firstExtendedColumn.left > x) {
        viewScale = this.gantt.options.value('viewScale');
        this.previousColumns = GanttColumnsManager.GanttColumnGenerator.generate(this.columnBuilder, from, undefined, viewScale, this.getColumnsWidth(), -x, 0, true);
      }
      return true;
    } else if (x > this.gantt.width) {
      let lastColumn = this.getLastColumn();
      let endDate = lastColumn.getDateByPosition(lastColumn.width);
      let lastExtendedColumn = this.getLastColumn(true);
      if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
        viewScale = this.gantt.options.value('viewScale');
        this.nextColumns = GanttColumnsManager.GanttColumnGenerator.generate(this.columnBuilder, endDate, undefined, viewScale, this.getColumnsWidth(), x - this.gantt.width, this.gantt.width, false);
      }
      return true;
    }
    return false;
  };

  expandExtendedColumnsForDate(date) {
    let firstColumn = this.getFirstColumn();
    let from;
    if (firstColumn) {
      from = firstColumn.date;
    }

    let lastColumn = this.getLastColumn();
    let endDate;
    if (lastColumn) {
      endDate = lastColumn.endDate;
    }

    let viewScale;
    if (from && date < from) {
      let firstExtendedColumn = this.getFirstColumn(true);
      if (!firstExtendedColumn || firstExtendedColumn.date > date) {
        viewScale = this.gantt.options.value('viewScale');
        this.previousColumns = GanttColumnsManager.GanttColumnGenerator.generate(this.columnBuilder, from, date, viewScale, this.getColumnsWidth(), undefined, 0, true);
      }
      return true;
    } else if (endDate && date >= endDate) {
      let lastExtendedColumn = this.getLastColumn(true);
      if (!lastExtendedColumn || lastExtendedColumn.date < endDate) {
        viewScale = this.gantt.options.value('viewScale');
        this.nextColumns = GanttColumnsManager.GanttColumnGenerator.generate(this.columnBuilder, endDate, date, viewScale, this.getColumnsWidth(), undefined, this.gantt.width, false);
      }
      return true;
    }
    return false;
  };

  /**
   *  Returns the number of active headers
   *
   * @returns {number}
   */
  getActiveHeadersCount() {
    return this.headers.length;
  };

  updateVisibleColumns(includeViews) {
    let limitThreshold = this.gantt.options.value('columnLimitThreshold');

    let i;
    if (limitThreshold === undefined || limitThreshold > 0 && this.columns.length >= limitThreshold) {
      this.visibleColumns = GanttColumnsManager.$filter('ganttColumnLimit')(this.columns, this.gantt);

      this.visibleHeaders = [];
      for (i = 0; i < this.headers.length; i++) {
        this.visibleHeaders.push.apply(this.visibleHeaders, GanttColumnsManager.$filter('ganttColumnLimit')(this.headers[i], this.gantt));
      }
    } else {
      this.visibleColumns = this.columns;
      this.visibleHeaders = this.headers;
    }

    if (includeViews) {
      for (i = 0; i < this.visibleColumns.length; i++) {
        this.visibleColumns[i].updateView();
      }
      for (i = 0; i < this.visibleHeaders.length; i++) {
        let headerRow = this.visibleHeaders[i];
        for (let headerRowItem of headerRow) {
          headerRowItem.updateView();
        }
      }
    }

    let currentDateValue = this.gantt.options.value('currentDateValue');
    this.gantt.currentDateManager.setCurrentDate(currentDateValue);
  };

  getHeaderFormat(unit) {
    let format;
    let headersFormats = this.gantt.options.value('headersFormats');
    if (headersFormats !== undefined) {
      format = headersFormats[unit];
    }
    if (format === undefined) {
      let viewScale = this.gantt.options.value('viewScale');
      viewScale = viewScale.trim();
      if (viewScale.charAt(viewScale.length - 1) === 's') {
        viewScale = viewScale.substring(0, viewScale.length - 1);
      }

      let viewScaleUnit;
      let splittedViewScale;

      if (viewScale) {
        splittedViewScale = viewScale.split(' ');
      }
      if (splittedViewScale && splittedViewScale.length > 1) {
        viewScaleUnit = splittedViewScale[splittedViewScale.length - 1];
      } else {
        viewScaleUnit = viewScale;
      }

      if (['millisecond', 'second', 'minute', 'hour'].indexOf(viewScaleUnit) > -1) {
        format = this.defaultDayHeadersFormats[unit];
      } else if (['month', 'quarter', 'year'].indexOf(viewScaleUnit) > -1) {
        format = this.defaultYearHeadersFormats[unit];
      }
      if (format === undefined) {
        format = this.defaultHeadersFormats[unit];
      }
    }
    return format;
  };

  getHeaderScale(header) {
    let scale;
    let headersScales = this.gantt.options.value('headersScales');
    if (headersScales !== undefined) {
      scale = headersScales[header];
    }
    if (scale === undefined) {
      scale = header;
    }
    if (['millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'].indexOf(scale) === -1) {
      scale = 'day';
    }
    return scale;
  };

  getDateRange(visibleOnly) {
    let firstColumn;
    let lastColumn;

    if (visibleOnly) {
      if (this.visibleColumns && this.visibleColumns.length > 0) {
        firstColumn = this.visibleColumns[0];
        lastColumn = this.visibleColumns[this.visibleColumns.length - 1];
      }
    } else {
      firstColumn = this.getFirstColumn();
      lastColumn = this.getLastColumn();
    }

    return firstColumn && lastColumn ? [firstColumn.date, lastColumn.endDate] : undefined;
  };
}

export default function (GanttColumnGenerator: GanttColumnGenerator,
                         GanttColumnBuilder: { new(columnsManager: GanttColumnsManager): GanttColumnBuilder },
                         GanttHeadersGenerator: GanttHeadersGenerator,
                         $filter: IGanttFilterService,
                         ganttLayout: GanttLayout,
                         ganttBinarySearch: GanttBinarySearch) {
  'ngInject';

  GanttColumnsManager.GanttColumnGenerator = GanttColumnGenerator;
  GanttColumnsManager.GanttHeadersGenerator = GanttHeadersGenerator;
  GanttColumnsManager.ganttBinarySearch = ganttBinarySearch;
  GanttColumnsManager.GanttColumnBuilder = GanttColumnBuilder;
  GanttColumnsManager.ganttLayout = ganttLayout;
  GanttColumnsManager.$filter = $filter;
  return GanttColumnsManager;
}
