import {Timespan, TimespanModel} from './timespan.factory';
import {Gantt} from '../gantt.factory';

export class GanttTimespansManager {
  static GanttTimespan: { new(gantt: Gantt, model: TimespanModel): Timespan };

  private gantt: Gantt;
  private timespansMap: {} = {};
  private timespans: Timespan[] = [];

  constructor(gantt) {
    this.gantt = gantt;

    this.gantt.$scope.$watchCollection('timespans', (newValue: TimespanModel[]) => {
      this.clearTimespans();
      this.loadTimespans(newValue);
    });

    this.gantt.api.registerMethod('timespans', 'load', this.loadTimespans, this);
    this.gantt.api.registerMethod('timespans', 'remove', this.removeTimespans, this);
    this.gantt.api.registerMethod('timespans', 'clear', this.clearTimespans, this);

    this.gantt.api.registerEvent('timespans', 'add');
    this.gantt.api.registerEvent('timespans', 'remove');
    this.gantt.api.registerEvent('timespans', 'change');
  };

  /**
   * Adds or updates timespans
   * @param timespans
   */
  loadTimespans(timespans: TimespanModel | TimespanModel[]) {
    if (!Array.isArray(timespans)) {
      timespans = timespans !== undefined ? [timespans] : [];
    }

    this.gantt.$scope.timespans = timespans;
    // tslint:disable:one-variable-per-declaration
    for (let i = 0, l = timespans.length; i < l; i++) {
      let timespanModel = timespans[i];
      this.gantt.objectModel.cleanTimespan(timespanModel);
      this.loadTimespan(timespanModel);
    }
  };

  /**
   * Adds a timespan or merges the timespan if there is already one with the same id
   * @param timespanModel
   * @returns {boolean}
   */
  loadTimespan(timespanModel: TimespanModel) {
    // Copy to new timespan (add) or merge with existing (update)
    let timespan: Timespan;
    let isUpdate = false;

    if (timespanModel.id in this.timespansMap) {
      timespan = this.timespansMap[timespanModel.id];
      timespan.model = timespanModel;
      isUpdate = true;
      (this.gantt.api as any).timespans.raise.change(timespan);
    } else {
      timespan = new GanttTimespansManager.GanttTimespan(this.gantt, timespanModel);
      this.timespansMap[timespanModel.id] = timespan;
      this.timespans.push(timespan);
      (this.gantt.api as any).timespans.raise.add(timespan);
    }

    timespan.updatePosAndSize();
    return isUpdate;
  };

  removeTimespans(timespans: TimespanModel | TimespanModel[]) {
    if (!Array.isArray(timespans)) {
      timespans = [timespans];
    }

    for (let i = 0, l = timespans.length; i < l; i++) {
      let timespanData = timespans[i];
      this.removeTimespan(timespanData.id);
    }
  };

  removeTimespan(timespanId: string) {
    if (timespanId in this.timespansMap) {
      delete this.timespansMap[timespanId]; // Remove from map

      let removedTimespan;
      let timespan;
      for (let i = this.timespans.length - 1; i >= 0; i--) {
        timespan = this.timespans[i];
        if (timespan.model.id === timespanId) {
          removedTimespan = timespan;
          this.timespans.splice(i, 1); // Remove from array
          break;
        }
      }

      (this.gantt.api as any).timespans.raise.remove(removedTimespan);
      return removedTimespan;
    }

    return undefined;
  };

  /**
   * Removes all timespans
   */
  clearTimespans() {
    this.timespansMap = {};
    this.timespans = [];
  };

  updateTimespansPosAndSize() {
    for (let i = 0, l = this.timespans.length; i < l; i++) {
      this.timespans[i].updatePosAndSize();
    }
  };
}

export default function (GanttTimespan: { new(gantt: Gantt, model: TimespanModel): Timespan }) {
  'ngInject';

  GanttTimespansManager.GanttTimespan = GanttTimespan;
  return GanttTimespansManager;
}
