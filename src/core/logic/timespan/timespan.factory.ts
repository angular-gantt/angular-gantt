import angular from 'angular';

export default function () {
  'ngInject';
  let Timespan = function (gantt, model) {
    this.gantt = gantt;
    this.model = model;
  };

  // Updates the pos and size of the timespan according to the from - to date
  Timespan.prototype.updatePosAndSize = function () {
    this.modelLeft = this.gantt.getPositionByDate(this.model.from);
    this.modelWidth = this.gantt.getPositionByDate(this.model.to) - this.modelLeft;

    let lastColumn = this.gantt.columnsManager.getLastColumn();
    let maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;

    let modelLeft = this.modelLeft;
    let modelWidth = this.modelWidth;

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
      } else if (modelWidth + modelLeft > this.gantt.width) {
        this.truncatedRight = true;
        this.truncatedRightOffset = modelWidth + modelLeft - this.gantt.width;
        this.truncatedLeft = false;
        this.truncatedLeftOffset = undefined;
      } else {
        this.truncatedLeft = false;
        this.truncatedLeftOffset = undefined;
        this.truncatedRight = false;
        this.truncatedRightOffset = modelWidth + modelLeft - this.gantt.width;
      }

      if (this.width < 0) {
        this.left = this.left + this.width;
        this.width = -this.width;
      }
    }

    this.updateView();
  };

  Timespan.prototype.updateView = function () {
    if (this.$element) {
      if (this.left === undefined || this.width === undefined) {
        this.$element.css('display', 'none');
      } else {
        this.$element.css('display', '');
        this.$element.css('left', this.left + 'px');
        this.$element.css('width', this.width + 'px');
      }
    }
  };

  // Expands the start of the timespan to the specified position (in em)
  Timespan.prototype.setFrom = function (x) {
    this.from = this.gantt.getDateByPosition(x);
    this.updatePosAndSize();
  };

  // Expands the end of the timespan to the specified position (in em)
  Timespan.prototype.setTo = function (x) {
    this.to = this.gantt.getDateByPosition(x);
    this.updatePosAndSize();
  };

  // Moves the timespan to the specified position (in em)
  Timespan.prototype.moveTo = function (x) {
    this.from = this.gantt.getDateByPosition(x);
    this.to = this.gantt.getDateByPosition(x + this.width);
    this.updatePosAndSize();
  };

  Timespan.prototype.clone = function () {
    return new Timespan(this.gantt, angular.copy(this.model));
  };

  return Timespan;
}
