import angular, {IAugmentedJQuery} from 'angular';

import moment from 'moment';
import {GanttRow} from '../row/row.factory';
import {GanttRowsManager} from '../row/rowsManager.factory';

export class GanttTaskModel {
  id: string;
  priority: number;

  from: moment.Moment;
  to: moment.Moment;
}

export class GanttTask {
  rowsManager: GanttRowsManager;

  row: GanttRow;
  model: GanttTaskModel;

  truncatedLeft: boolean;
  truncatedRight: boolean;

  left: number;
  width: number;
  isMoving: boolean;
  modelLeft: number;
  modelWidth: number;
  truncatedLeftOffset: number;
  truncatedRightOffset: number;
  $element: IAugmentedJQuery;

  active: boolean;

  constructor (row: GanttRow, model: GanttTaskModel) {
    this.rowsManager = row.rowsManager;
    this.row = row;
    this.model = model;
    this.truncatedLeft = false;
    this.truncatedRight = false;
  };

  isMilestone() {
    return !this.model.to || this.model.to.isSame(this.model.from);
  };

  isOutOfRange() {
    let firstColumn = this.rowsManager.gantt.columnsManager.getFirstColumn();
    let lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();

    return (firstColumn === undefined || this.model.to < firstColumn.date ||
    lastColumn === undefined || this.model.from > lastColumn.endDate);
  };

  // Updates the pos and size of the task according to the from - to date
  updatePosAndSize() {
    let oldViewLeft = this.left;
    let oldViewWidth = this.width;
    let oldTruncatedRight = this.truncatedRight;
    let oldTruncatedLeft = this.truncatedLeft;

    if (!this.isMoving && this.isOutOfRange()) {
      this.modelLeft = undefined;
      this.modelWidth = undefined;
    } else {
      this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
      this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.model.to) - this.modelLeft;
    }

    let lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();
    let maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;

    let modelLeft = this.modelLeft;
    let modelWidth = this.modelWidth;

    if (this.rowsManager.gantt.options.value('daily')) {
      modelLeft = this.rowsManager.gantt.getPositionByDate(moment(this.model.from).startOf('day'));
      modelWidth = this.rowsManager.gantt.getPositionByDate(moment(this.model.to).endOf('day')) - modelLeft;
    }

    let minModelLeft = -modelWidth;
    if (modelLeft < minModelLeft) {
      modelLeft = minModelLeft;
    }

    if (modelLeft > maxModelLeft) {
      modelLeft = maxModelLeft;
    }

    if (modelLeft === undefined || modelWidth === undefined) {
      this.left = undefined;
      this.width = undefined;
    } else {
      this.left = modelLeft;
      this.width = modelWidth;
      if (modelLeft < 0) {
        this.truncatedLeft = true;
        this.truncatedLeftOffset = -modelLeft;
        this.truncatedRight = false;
        this.truncatedRightOffset = undefined;
      } else if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
        this.truncatedRight = true;
        this.truncatedRightOffset = modelWidth + modelLeft - this.rowsManager.gantt.width;
        this.truncatedLeft = false;
        this.truncatedLeftOffset = undefined;
      } else {
        this.truncatedLeft = false;
        this.truncatedLeftOffset = undefined;
        this.truncatedRight = false;
        this.truncatedRightOffset = modelWidth + modelLeft - this.rowsManager.gantt.width;
      }

      if (this.width < 0) {
        this.left = this.left + this.width;
        this.width = -this.width;
      }
    }

    this.updateView();
    if (!this.rowsManager.gantt.isRefreshingColumns &&
      (oldViewLeft !== this.left ||
      oldViewWidth !== this.width ||
      oldTruncatedRight !== this.truncatedRight ||
      oldTruncatedLeft !== this.truncatedLeft)) {
      (this.rowsManager.gantt.api as any).tasks.raise.viewChange(this);
    }
  };

  updateView() {
    if (this.$element) {
      if (this.left === undefined || this.width === undefined) {
        this.$element.css('display', 'none');
      } else {
        this.$element.css({'left': this.left + 'px', 'width': this.width + 'px', 'display': ''});

        if (this.model.priority > 0) {
          let priority = this.model.priority;
          let children = this.$element.children();
          // tslint:disable:prefer-for-of
          for (let i = 0; i < children.length; i++) {
            angular.element(children[i]).css('z-index', priority);
          }
        }

        this.$element.toggleClass('gantt-task-milestone', this.isMilestone());
      }
    }
  };

  getBackgroundElement() {
    if (this.$element !== undefined) {
      let backgroundElement = this.$element[0].querySelector('.gantt-task-background');
      if (backgroundElement !== undefined) {
        return angular.element(backgroundElement);
      }
      return undefined;
    }
  };

  getContentElement() {
    if (this.$element !== undefined) {
      let contentElement = this.$element[0].querySelector('.gantt-task-content');
      if (contentElement !== undefined) {
        return angular.element(contentElement);
      }
      return undefined;
    }
  };

  getForegroundElement() {
    if (this.$element !== undefined) {
      let foregroundElement = this.$element[0].querySelector('.gantt-task-foreground');
      if (foregroundElement !== undefined) {
        return angular.element(foregroundElement);
      }
      return foregroundElement;
    }
  };

  // Expands the start of the task to the specified position (in em)
  setFrom(x: number, magnetEnabled: boolean) {
    this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
    this.row.setFromTo();
    this.updatePosAndSize();
  };

  // Expands the end of the task to the specified position (in em)
  setTo(x: number, magnetEnabled: boolean) {
    this.model.to = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
    this.row.setFromTo();
    this.updatePosAndSize();
  };

  // Moves the task to the specified position (in em)
  moveTo(x: number, magnetEnabled: boolean) {
    let newTaskRight;
    let newTaskLeft;
    if (x > this.modelLeft) {
      // Driven by right/to side.
      this.model.to = this.rowsManager.gantt.getDateByPosition(x + this.modelWidth, magnetEnabled);
      newTaskRight = this.rowsManager.gantt.getPositionByDate(this.model.to);
      newTaskLeft = newTaskRight - this.modelWidth;
      this.model.from = this.rowsManager.gantt.getDateByPosition(newTaskLeft, false);
    } else {
      // Drive by left/from side.
      this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
      newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
      newTaskRight = newTaskLeft + this.modelWidth;
      this.model.to = this.rowsManager.gantt.getDateByPosition(newTaskRight, false);
    }

    this.row.setFromTo();
    this.updatePosAndSize();
  };

  clone() {
    return new GanttTask(this.row, angular.copy(this.model));
  };
}

export default function () {
  'ngInject';

  return GanttTask;
}
