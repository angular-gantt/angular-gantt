import angular, {IAugmentedJQuery, IFilterService} from 'angular';

import moment, {MomentInput} from 'moment';

export type TimeFramesDisplayMode = 'visible' | 'cropped' | 'hidden';

export interface TimeFrameOptions {
  start?: moment.Moment;
  end?: moment.Moment;
  working?: boolean;
  magnet?: boolean;
  default?: boolean;
  color?: string;
  classes?: string[];
  internal?: boolean;
}

/**
 * TimeFrame represents time frame in any day. parameters are given using options object.
 *
 * @param {moment|string} start start of timeFrame. If a string is given, it will be parsed as a moment.
 * @param {moment|string} end end of timeFrame. If a string is given, it will be parsed as a moment.
 * @param {boolean} working is this timeFrame flagged as working.
 * @param {boolean} magnet is this timeFrame will magnet.
 * @param {boolean} default is this timeFrame will be used as default.
 * @param {color} css color attached to this timeFrame.
 * @param {string} classes css classes attached to this timeFrame.
 *
 * @constructor
 */
export class TimeFrame implements TimeFrameOptions {
  start?: moment.Moment;
  end?: moment.Moment;
  working?: boolean;
  magnet?: boolean;
  default?: boolean;
  color?: string;
  classes?: string[];
  internal?: boolean;

  left: number;
  width: number;
  hidden: boolean;
  originalSize: { left: number; width: number };
  cropped: boolean;

  $element: IAugmentedJQuery;

  constructor(options: TimeFrameOptions) {
    if (options === undefined) {
      options = {};
    }

    this.start = options.start;
    this.end = options.end;
    this.working = options.working;
    this.magnet = options.magnet !== undefined ? options.magnet : true;
    this.default = options.default;
    this.color = options.color;
    this.classes = options.classes;
    this.internal = options.internal;
  }

  updateView() {
    if (this.$element) {
      let cssStyles = {};

      if (this.left !== undefined) {
        cssStyles['left'] = this.left + 'px';
      } else {
        cssStyles['left'] = '';
      }
      if (this.width !== undefined) {
        cssStyles['width'] = this.width + 'px';
      } else {
        cssStyles['width'] = '';
      }

      if (this.color !== undefined) {
        cssStyles['background-color'] = this.color;
      } else {
        cssStyles['background-color'] = '';
      }

      this.$element.css(cssStyles);

      let classes = ['gantt-timeframe' + (this.working ? '' : '-non') + '-working'];
      if (this.classes) {
        classes = classes.concat(this.classes);
      }
      // tslint:disable:one-variable-per-declaration
      for (let i = 0, l = classes.length; i < l; i++) {
        this.$element.toggleClass(classes[i], true);
      }
    }
  };

  getDuration() {
    if (this.end !== undefined && this.start !== undefined) {
      return this.end.diff(this.start, 'milliseconds');
    }
  };

  clone() {
    return new TimeFrame(this);
  };
}

export interface TimeFrameMappingFunction {(date: moment.Moment): string[];}

/**
 * TimeFrameMapping defines how timeFrames will be placed for each days. parameters are given using options object.
 *
 * @param {function} func a function with date parameter, that will be evaluated for each distinct day of the gantt.
 *                        this function must return an array of timeFrame names to apply.
 * @constructor
 */
export class TimeFrameMapping {
  private func: TimeFrameMappingFunction;

  constructor(func: TimeFrameMappingFunction) {
    this.func = func;
  };

  getTimeFrames(date: moment.Moment): string[] {
    let ret: string[] = this.func(date);
    if (!(ret instanceof Array)) {
      ret = [ret];
    }
    return ret;
  };

  clone() {
    return new TimeFrameMapping(this.func);
  };
}

interface DateFrameOptions {
  evaluator: { (date: moment.Moment): boolean };
  date?: MomentInput;
  start?: moment.Moment;
  end?: moment.Moment;
  default?: boolean;
  targets: any;
}

/**
 * A DateFrame is date range that will use a specific TimeFrameMapping, configured using a function (evaluator),
 * a date (date) or a date range (start, end). parameters are given using options object.
 *
 * @param {function} evaluator a function with date parameter, that will be evaluated for each distinct day of the gantt.
 *                   this function must return a boolean representing matching of this dateFrame or not.
 * @param {moment} date date of dateFrame.
 * @param {moment} start start of date frame.
 * @param {moment} end end of date frame.
 * @param {array} targets array of TimeFrameMappings/TimeFrames names to use for this date frame.
 * @param {boolean} default is this dateFrame will be used as default.
 * @constructor
 */
export class DateFrame {
  evaluator: { (date: moment.Moment): boolean };
  start: moment.Moment;
  end: moment.Moment;
  default: boolean;
  targets: string[];

  constructor (options: DateFrameOptions) {
    this.evaluator = options.evaluator;
    if (options.date) {
      this.start = moment(options.date).startOf('day');
      this.end = moment(options.date).endOf('day');
    } else {
      this.start = options.start;
      this.end = options.end;
    }
    if (options.targets instanceof Array) {
      this.targets = options.targets;
    } else {
      this.targets = [options.targets];
    }
    this.default = options.default;
  };

  dateMatch(date: moment.Moment) {
    if (this.evaluator) {
      return this.evaluator(date);
    } else if (this.start && this.end) {
      return date >= this.start && date <= this.end;
    } else {
      return false;
    }
  };

  clone() {
    return new DateFrame(this);
  };
}

/**
 * Register TimeFrame, TimeFrameMapping and DateMapping objects into Calendar object,
 * and use Calendar#getTimeFrames(date) function to retrieve effective timeFrames for a specific day.
 *
 * @constructor
 */
export class GanttCalendar {
  static $filter: IFilterService;

  timeFrames: {[name: string]: TimeFrame} = {};
  timeFrameMappings: {[name: string]: TimeFrameMapping} = {};
  dateFrames: {[name: string]: DateFrame} = {};

  /**
   * Remove all objects.
   */
  clear () {
    this.timeFrames = {};
    this.timeFrameMappings = {};
    this.dateFrames = {};
  };

  /**
   * Register TimeFrame objects.
   *
   * @param {object} timeFrames with names of timeFrames for keys and TimeFrame objects for values.
   */
  registerTimeFrames (timeFrames: {[name: string]: TimeFrameOptions}) {
    for (let name in timeFrames) {
      let timeFrame = timeFrames[name];
      this.timeFrames[name] = new TimeFrame(timeFrame);
    }
  };

  /**
   * Removes TimeFrame objects.
   *
   * @param {array} timeFrames names of timeFrames to remove.
   */
  removeTimeFrames(timeFrames: string[]) {
    for (let name in timeFrames) {
      delete this.timeFrames[name];
    }
  };

  /**
   * Remove all TimeFrame objects.
   */
  clearTimeFrames () {
    this.timeFrames = {};
  };

  /**
   * Register TimeFrameMapping objects.
   *
   * @param {object} mappings object with names of timeFrames mappings for keys and TimeFrameMapping objects for values.
   */
  registerTimeFrameMappings(mappings: {(date: moment.Moment): TimeFrameMappingFunction}) {
    for (let name in mappings) {
      let timeFrameMapping = mappings[name];
      this.timeFrameMappings[name] = new TimeFrameMapping(timeFrameMapping);
    }
  };

  /**
   * Removes TimeFrameMapping objects.
   *
   * @param {array} mappings names of timeFrame mappings to remove.
   */
  removeTimeFrameMappings (mappings: string[]) {
    for (let name in mappings) {
      delete this.timeFrameMappings[name];
    }
  };

  /**
   * Removes all TimeFrameMapping objects.
   */
  clearTimeFrameMappings () {
    this.timeFrameMappings = {};
  };

  /**
   * Register DateFrame objects.
   *
   * @param {object} dateFrames object with names of dateFrames for keys and DateFrame objects for values.
   */
  registerDateFrames (dateFrames: {[name: string]: DateFrameOptions}) {
    for (let name in dateFrames) {
      let dateFrame = dateFrames[name];
      this.dateFrames[name] = new DateFrame(dateFrame);
    }
  };

  /**
   * Remove DateFrame objects.
   *
   * @param {array} mappings names of date frames to remove.
   */
  removeDateFrames(dateFrames: string[]) {
    for (let name in dateFrames) {
      delete this.dateFrames[name];
    }
  };

  /**
   * Removes all DateFrame objects.
   */
  clearDateFrames () {
    this.dateFrames = {};
  };

  filterDateFrames(inputDateFrames: {[name: string]: DateFrame}, date: moment.Moment): DateFrame[] {
    let dateFrames = [];
    for (let name in inputDateFrames) {
      let dateFrame = inputDateFrames[name];
      if (dateFrame.dateMatch(date)) {
        dateFrames.push(dateFrame);
      }
    }
    if (dateFrames.length === 0) {
      for (let name in inputDateFrames) {
        let dateFrame = inputDateFrames[name];
        if (dateFrame.default) {
          dateFrames.push(dateFrame);
        }
      }
    }
    return dateFrames;
  };

  /**
   * Retrieves TimeFrame objects for a given date, using whole configuration for this Calendar object.
   *
   * @param {moment} date
   *
   * @return {array} an array of TimeFrame objects.
   */
  getTimeFrames (date: moment.Moment): TimeFrame[] {
    let timeFrames: TimeFrame[] = [];
    let dateFrames = this.filterDateFrames(this.dateFrames, date);

    for (let dateFrame of dateFrames) {
      if (dateFrame !== undefined) {
        let targets = dateFrame.targets;

        for (let target of targets) {
          let timeFrameMapping = this.timeFrameMappings[target];
          if (timeFrameMapping !== undefined) {
            // If a timeFrame mapping is found
            let names = timeFrameMapping.getTimeFrames(date);
            for (let name of names) {
              let timeFrame = this.timeFrames[name];
              timeFrames.push(timeFrame);
            }
          } else {
            // If no timeFrame mapping is found, try using direct timeFrame
            let timeFrame = this.timeFrames[target];
            if (timeFrame !== undefined) {
              timeFrames.push(timeFrame);
            }
          }
        }
      }
    }

    let dateYear = date.year();
    let dateMonth = date.month();
    let dateDate = date.date();

    let validatedTimeFrames = [];
    if (timeFrames.length === 0) {
      for (let name in this.timeFrames) {
        let timeFrame = this.timeFrames[name];
        if (timeFrame.default) {
          timeFrames.push(timeFrame);
        }
      }
    }

    for (let name in timeFrames) {
      let timeFrame = timeFrames[name];
      let cTimeFrame = timeFrame.clone();

      if (cTimeFrame.start !== undefined) {
        cTimeFrame.start.year(dateYear);
        cTimeFrame.start.month(dateMonth);
        cTimeFrame.start.date(dateDate);
      }

      if (cTimeFrame.end !== undefined) {
        cTimeFrame.end.year(dateYear);
        cTimeFrame.end.month(dateMonth);
        cTimeFrame.end.date(dateDate);

        if (moment(cTimeFrame.end).startOf('day') === cTimeFrame.end) {
          cTimeFrame.end.add(1, 'day');
        }
      }

      validatedTimeFrames.push(cTimeFrame);
    }

    return validatedTimeFrames;
  };

  /**
   * Solve timeFrames.
   *
   * Smaller timeFrames have priority over larger one.
   *
   * @param {array} timeFrames Array of timeFrames to solve
   * @param {moment} startDate
   * @param {moment} endDate
   */
  solve (timeFrames: TimeFrame[], startDate, endDate) {
    let color: string;
    let classes: string[];
    let minDate: moment.Moment;
    let maxDate: moment.Moment;

    for (let i = 0; i < timeFrames.length; i++) {
      let timeFrame = timeFrames[i];
      if (minDate === undefined || minDate > timeFrame.start) {
        minDate = timeFrame.start;
      }
      if (maxDate === undefined || maxDate < timeFrame.end) {
        maxDate = timeFrame.end;
      }
      if (color === undefined && timeFrame.color) {
        color = timeFrame.color;
      }
      if (timeFrame.classes !== undefined) {
        if (classes === undefined) {
          classes = [];
        }
        classes = classes.concat(timeFrame.classes);
      }
    }

    if (startDate === undefined) {
      startDate = minDate;
    }

    if (endDate === undefined) {
      endDate = maxDate;
    }

    let solvedTimeFrames: TimeFrame[] = [new TimeFrame({start: startDate, end: endDate, internal: true})];

    timeFrames = GanttCalendar.$filter('filter')(timeFrames, (timeFrame) => {
      return (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
    });

    for (let timeFrame of timeFrames) {
      if (!timeFrame.start) {
        timeFrame.start = startDate;
      }
      if (!timeFrame.end) {
        timeFrame.end = endDate;
      }
    }

    let orderedTimeFrames = GanttCalendar.$filter('orderBy')(timeFrames, (timeFrame) => {
      return -timeFrame.getDuration();
    });

    let k;
    for (let oTimeFrame of orderedTimeFrames) {
      let tmpSolvedTimeFrames = solvedTimeFrames.slice();

      k = 0;
      let dispatched = false;
      let treated = false;

      for (let sTimeFrame of solvedTimeFrames) {
        if (!treated) {
          if (!oTimeFrame.end && !oTimeFrame.start) {
            // timeFrame is infinite.
            tmpSolvedTimeFrames.splice(k, 0, oTimeFrame);
            treated = true;
            dispatched = false;
          } else if (oTimeFrame.end > sTimeFrame.start && oTimeFrame.start < sTimeFrame.end) {
            // timeFrame is included in this solvedTimeFrame.
            // solvedTimeFrame:|ssssssssssssssssssssssssssssssssss|
            //       timeFrame:          |tttttt|
            //          result:|sssssssss|tttttt|sssssssssssssssss|

            let newSolvedTimeFrame = sTimeFrame.clone();

            sTimeFrame.end = moment(oTimeFrame.start);
            newSolvedTimeFrame.start = moment(oTimeFrame.end);

            tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone(), newSolvedTimeFrame);
            treated = true;
            dispatched = false;
          } else if (!dispatched && oTimeFrame.start < sTimeFrame.end) {
            // timeFrame is dispatched on two solvedTimeFrame.
            // First part
            // solvedTimeFrame:|sssssssssssssssssssssssssssssssssss|s+1;s+1;s+1;s+1;s+1;s+1|
            //       timeFrame:                                |tttttt|
            //          result:|sssssssssssssssssssssssssssssss|tttttt|;s+1;s+1;s+1;s+1;s+1|

            sTimeFrame.end = moment(oTimeFrame.start);
            tmpSolvedTimeFrames.splice(k + 1, 0, oTimeFrame.clone());

            dispatched = true;
          } else if (dispatched && oTimeFrame.end > sTimeFrame.start) {
            // timeFrame is dispatched on two solvedTimeFrame.
            // Second part

            sTimeFrame.start = moment(oTimeFrame.end);
            dispatched = false;
            treated = true;
          }
          k++;
        }
      }

      solvedTimeFrames = tmpSolvedTimeFrames;
    }

    solvedTimeFrames = GanttCalendar.$filter('filter')(solvedTimeFrames, (timeFrame) => {
      return !timeFrame.internal &&
        (timeFrame.start === undefined || timeFrame.start < endDate) &&
        (timeFrame.end === undefined || timeFrame.end > startDate);
    });

    return solvedTimeFrames;

  };
}

export default function ($filter: IFilterService) {
  'ngInject';

  GanttCalendar.$filter = $filter;
  return GanttCalendar;
}
