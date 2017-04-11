import angular from 'angular';

import moment from 'moment';

export default function (GanttApi, GanttOptions, GanttCalendar, GanttScroll, GanttBody, GanttRowHeader, GanttHeader, GanttSide, GanttObjectModel, GanttRowsManager, GanttColumnsManager, GanttTimespansManager, GanttCurrentDateManager, ganttArrays, $document, $timeout) {
  'ngInject';
  // Gantt logic. Manages the columns, rows and sorting functionality.
  let Gantt = function ($scope, $element) {
    let self = this;

    this.$scope = $scope;
    this.$element = $element;

    this.options = new GanttOptions($scope, {
      'api': angular.noop,
      'data': [],
      'timespans': [],
      'viewScale': 'day',
      'columnMagnet': '15 minutes',
      'timeFramesMagnet': true,
      'showSide': true,
      'allowSideResizing': true,
      'currentDate': 'line',
      'currentDateValue': moment,
      'autoExpand': 'none',
      'taskOutOfRange': 'truncate',
      'taskContent': '{{task.model.name}}',
      'rowContent': '{{row.model.name}}',
      'maxHeight': 0,
      'timeFrames': [],
      'dateFrames': [],
      'timeFramesWorkingMode': 'hidden',
      'timeFramesNonWorkingMode': 'visible',
      'taskLimitThreshold': 100,
      'columnLimitThreshold': 500
    });

    this.api = new GanttApi(this);

    this.api.registerEvent('core', 'ready');
    this.api.registerEvent('core', 'rendered');

    this.api.registerEvent('directives', 'controller');
    this.api.registerEvent('directives', 'preLink');
    this.api.registerEvent('directives', 'postLink');
    this.api.registerEvent('directives', 'new');
    this.api.registerEvent('directives', 'destroy');

    this.api.registerEvent('data', 'change');
    this.api.registerEvent('data', 'load');
    this.api.registerEvent('data', 'remove');
    this.api.registerEvent('data', 'clear');

    this.api.registerMethod('core', 'getDateByPosition', this.getDateByPosition, this);
    this.api.registerMethod('core', 'getPositionByDate', this.getPositionByDate, this);

    this.api.registerMethod('data', 'load', this.loadData, this);
    this.api.registerMethod('data', 'remove', this.removeData, this);
    this.api.registerMethod('data', 'clear', this.clearData, this);
    this.api.registerMethod('data', 'get', this.getData, this);

    this.calendar = new GanttCalendar(this);
    this.calendar.registerTimeFrames(this.options.value('timeFrames'));
    this.calendar.registerDateFrames(this.options.value('dateFrames'));

    this.api.registerMethod('timeframes', 'registerTimeFrames', this.calendar.registerTimeFrames, this.calendar);
    this.api.registerMethod('timeframes', 'clearTimeframes', this.calendar.clearTimeFrames, this.calendar);
    this.api.registerMethod('timeframes', 'registerDateFrames', this.calendar.registerDateFrames, this.calendar);
    this.api.registerMethod('timeframes', 'clearDateFrames', this.calendar.clearDateFrames, this.calendar);
    this.api.registerMethod('timeframes', 'registerTimeFrameMappings', this.calendar.registerTimeFrameMappings, this.calendar);
    this.api.registerMethod('timeframes', 'clearTimeFrameMappings', this.calendar.clearTimeFrameMappings, this.calendar);

    $scope.$watchGroup(['timeFrames', 'dateFrames'], function (newValues, oldValues) {
      if (newValues !== oldValues) {
        let timeFrames = newValues[0];
        let dateFrames = newValues[1];

        let oldTimeFrames = oldValues[0];
        let oldDateFrames = oldValues[1];

        let framesChanged = false;

        if (!angular.equals(timeFrames, oldTimeFrames)) {
          self.calendar.clearTimeFrames();
          self.calendar.registerTimeFrames(timeFrames);
          framesChanged = true;
        }

        if (!angular.equals(dateFrames, oldDateFrames)) {
          self.calendar.clearDateFrames();
          self.calendar.registerDateFrames(dateFrames);
          framesChanged = true;
        }

        if (framesChanged) {
          self.columnsManager.generateColumns();
        }
      }
    });

    $scope.$watch('columnMagnet', function () {
      let splittedColumnMagnet;
      let columnMagnet = self.options.value('columnMagnet');
      if (columnMagnet) {
        splittedColumnMagnet = columnMagnet.trim().split(' ');
      }
      if (splittedColumnMagnet && splittedColumnMagnet.length > 1) {
        self.columnMagnetValue = parseFloat(splittedColumnMagnet[0]);
        self.columnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
      } else {
        self.columnMagnetValue = 1;
        self.columnMagnetUnit = moment.normalizeUnits(columnMagnet);
      }
    });

    $scope.$watchGroup(['shiftColumnMagnet', 'viewScale'], function () {
      let splittedColumnMagnet;
      let shiftColumnMagnet = self.options.value('shiftColumnMagnet');
      if (shiftColumnMagnet) {
        splittedColumnMagnet = shiftColumnMagnet.trim().split(' ');
      }
      if (splittedColumnMagnet !== undefined && splittedColumnMagnet.length > 1) {
        self.shiftColumnMagnetValue = parseFloat(splittedColumnMagnet[0]);
        self.shiftColumnMagnetUnit = moment.normalizeUnits(splittedColumnMagnet[splittedColumnMagnet.length - 1]);
      } else {
        self.shiftColumnMagnetValue = 1;
        self.shiftColumnMagnetUnit = moment.normalizeUnits(shiftColumnMagnet);
      }
    });

    let keyHandler = function (e) {
      self.shiftKey = e.shiftKey;
      return true;
    };

    $document.on('keyup keydown', keyHandler);

    $scope.$on('$destroy', function () {
      $document.off('keyup keydown', keyHandler);
    });

    this.scroll = new GanttScroll(this);
    this.body = new GanttBody(this);
    this.header = new GanttHeader(this);
    this.side = new GanttSide(this);

    this.objectModel = new GanttObjectModel(this.api);

    this.rowsManager = new GanttRowsManager(this);
    this.columnsManager = new GanttColumnsManager(this);
    this.timespansManager = new GanttTimespansManager(this);
    this.currentDateManager = new GanttCurrentDateManager(this);

    this.originalWidth = 0;
    this.width = 0;

    if (angular.isFunction(this.$scope.api)) {
      this.$scope.api(this.api);
    }

    let hasRowModelOrderChanged = function (data1, data2) {
      if (data2 === undefined || data1.length !== data2.length) {
        return true;
      }

      // tslint:disable:one-variable-per-declaration
      for (let i = 0, l = data1.length; i < l; i++) {
        if (data1[i].id !== data2[i].id) {
          return true;
        }
      }

      return false;
    };

    $scope.$watchCollection('data', function (newData, oldData) {
      if (oldData !== undefined) {
        let toRemoveIds = ganttArrays.getRemovedIds(newData, oldData);
        if (toRemoveIds.length === oldData.length) {
          self.rowsManager.removeAll();

          // DEPRECATED
          self.api.data.raise.clear();
        } else {
          for (let i = 0, l = toRemoveIds.length; i < l; i++) {
            let toRemoveId = toRemoveIds[i];
            self.rowsManager.removeRow(toRemoveId);
          }

          // DEPRECATED
          let removedRows = [];
          for (let i = 0, l = oldData.length; i < l; i++) {
            if (toRemoveIds.indexOf(oldData[i].id) > -1) {
              removedRows.push(oldData[i]);
            }
          }
          self.api.data.raise.remove(removedRows);
        }
      }

      if (newData !== undefined) {
        let modelOrderChanged = hasRowModelOrderChanged(newData, oldData);

        if (modelOrderChanged) {
          self.rowsManager.resetNonModelLists();
        }

        for (let j = 0, k = newData.length; j < k; j++) {
          let rowData = newData[j];
          self.rowsManager.addRow(rowData, modelOrderChanged);
        }

        self.api.data.raise.change(newData, oldData);

        // DEPRECATED
        self.api.data.raise.load(newData);
      }
    });
  };

  /**
   * Get the magnet value and unit considering the current gantt state.
   *
   * @returns {[*,*]}
   */
  Gantt.prototype.getMagnetValueAndUnit = function () {
    if (this.shiftKey) {
      if (this.shiftColumnMagnetValue !== undefined && this.shiftColumnMagnetUnit !== undefined) {
        return [this.shiftColumnMagnetValue, this.shiftColumnMagnetUnit];
      } else {
        let viewScale = this.options.value('viewScale');
        viewScale = viewScale.trim();
        let viewScaleValue;
        let viewScaleUnit;
        let splittedViewScale;

        if (viewScale) {
          splittedViewScale = viewScale.split(' ');
        }
        if (splittedViewScale && splittedViewScale.length > 1) {
          viewScaleValue = parseFloat(splittedViewScale[0]);
          viewScaleUnit = moment.normalizeUnits(splittedViewScale[splittedViewScale.length - 1]);
        } else {
          viewScaleValue = 1;
          viewScaleUnit = moment.normalizeUnits(viewScale);
        }
        return [viewScaleValue * 0.25, viewScaleUnit];
      }
    } else {
      return [this.columnMagnetValue, this.columnMagnetUnit];
    }
  };

  // Get the date transformed by magnet feature.
  Gantt.prototype.getMagnetDate = function (date, disableExpand) {
    if (date === undefined) {
      return undefined;
    }

    if (!moment.isMoment(moment)) {
      date = moment(date);
    }

    let column = this.columnsManager.getColumnByDate(date, disableExpand);
    let magnetValueAndUnit = this.getMagnetValueAndUnit();

    let magnetValue = magnetValueAndUnit[0];
    let magnetUnit = magnetValueAndUnit[1];

    return column.getMagnetDate(date, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
  };

  // Returns the exact column date at the given position x (in em)
  Gantt.prototype.getDateByPosition = function (x, magnet, disableExpand) {
    let column = this.columnsManager.getColumnByPosition(x, disableExpand);
    if (column !== undefined) {
      let magnetValue;
      let magnetUnit;
      if (magnet) {
        let magnetValueAndUnit = this.getMagnetValueAndUnit();
        magnetValue = magnetValueAndUnit[0];
        magnetUnit = magnetValueAndUnit[1];
      }
      return column.getDateByPosition(x - column.left, magnetValue, magnetUnit, this.options.value('timeFramesMagnet'));
    } else {
      return undefined;
    }
  };

  Gantt.prototype.getBodyAvailableWidth = function () {
    let scrollWidth = this.getWidth() - this.side.getWidth();
    let borderWidth = this.scroll.getBordersWidth();
    let availableWidth = scrollWidth - (borderWidth !== undefined ? this.scroll.getBordersWidth() : 0);
    // Remove 1 pixel because of rounding issue in some cases.
    availableWidth = availableWidth - 1;
    return availableWidth;
  };

  // Returns the position inside the Gantt calculated by the given date
  Gantt.prototype.getPositionByDate = function (date, disableExpand) {
    if (date === undefined) {
      return undefined;
    }

    if (!moment.isMoment(moment)) {
      date = moment(date);
    }

    let column = this.columnsManager.getColumnByDate(date, disableExpand);
    if (column !== undefined) {
      return column.getPositionByDate(date);
    } else {
      return undefined;
    }
  };

  // DEPRECATED - Use $data instead.
  Gantt.prototype.loadData = function (data) {
    if (!angular.isArray(data)) {
      data = data !== undefined ? [data] : [];
    }

    if (this.$scope.data === undefined) {
      this.$scope.data = data;
    } else {
      for (let i = 0, l = data.length; i < l; i++) {
        let row = data[i];

        let j = ganttArrays.indexOfId(this.$scope.data, row.id);
        if (j > -1) {
          this.$scope.data[j] = row;
        } else {
          this.$scope.data.push(row);
        }
      }
    }

    let w = this.side.getWidth();
    if (w > 0) {
      this.options.set('sideWidth', w);
    }
  };

  Gantt.prototype.getData = function () {
    return this.$scope.data;
  };

  // DEPRECATED - Use $data instead.
  Gantt.prototype.removeData = function (data) {
    if (!angular.isArray(data)) {
      data = data !== undefined ? [data] : [];
    }

    if (this.$scope.data !== undefined) {
      for (let i = 0, l = data.length; i < l; i++) {
        let rowToRemove = data[i];

        let j = ganttArrays.indexOfId(this.$scope.data, rowToRemove.id);
        if (j > -1) {
          if (rowToRemove.tasks === undefined || rowToRemove.tasks.length === 0) {
            // Remove complete row
            this.$scope.data.splice(j, 1);
          } else {
            // Remove single tasks
            let row = this.$scope.data[j];
            for (let ti = 0, tl = rowToRemove.tasks.length; ti < tl; ti++) {
              let taskToRemove = rowToRemove.tasks[ti];

              let tj = ganttArrays.indexOfId(row.tasks, taskToRemove.id);
              if (tj > -1) {
                row.tasks.splice(tj, 1);
              }
            }
          }
        }
      }
    }
  };

  // DEPRECATED - Use $data instead.
  Gantt.prototype.clearData = function () {
    this.$scope.data = undefined;
  };

  Gantt.prototype.getWidth = function () {
    return this.$scope.ganttElementWidth;
  };

  Gantt.prototype.getHeight = function () {
    return this.$scope.ganttElementHeight;
  };

  Gantt.prototype.getContainerWidth = function () {
    return this.$scope.ganttContainerWidth;
  };

  Gantt.prototype.getContainerHeight = function () {
    return this.$scope.ganttContainerHeight;
  };

  Gantt.prototype.initialized = function () {
    // Gantt is initialized. Signal that the Gantt is ready.
    this.api.core.raise.ready(this.api);

    this.rendered = true;
    this.columnsManager.generateColumns();

    let gantt = this;
    let renderedFunction = function () {
      let w = gantt.side.getWidth();
      if (w > 0) {
        gantt.options.set('sideWidth', w);
      }
      gantt.api.core.raise.rendered(gantt.api);
    };
    $timeout(renderedFunction);
  };

  return Gantt;
}
