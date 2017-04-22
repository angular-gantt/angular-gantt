import angular, {IRootScopeService} from 'angular';
import 'angular-mocks';

import { expect } from 'chai';

import moment from 'moment';

describe('Calendar', function () {
  // Load the module with MainController
  beforeEach(angular.mock.module('gantt'));

  let Calendar;

  let expectTimeFrameToEqual = function (actual, expected) {
    expect(expected.start).to.eq(actual.start);
    expect(expected.end).to.eq(actual.end);
    expect(expected.working).to.eq(actual.working);
    expect(expected.color).to.eq(actual.color);
    expect(expected.classes).to.eq(actual.classes);
  };

  beforeEach(inject(['GanttCalendar', function (tCalendar) {
    Calendar = tCalendar;
  }]));

  it('should register and use default timeFrames',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('9:00', 'HH:mm'),
          end: moment('18:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          color: 'red',
          classes: 'noon-css',
          working: false,
          default: true
        },
        'dummy': {
          start: moment('20:00', 'HH:mm'),
          end: moment('22:30', 'HH:mm'),
          working: false,
          default: false
        }
      };
      cal.registerTimeFrames(inputTimeFrames);
      let timeFrames = cal.getTimeFrames(moment());

      expect(timeFrames.length).to.eq(2);

      expectTimeFrameToEqual(timeFrames[0], cal.timeFrames.day);
      expectTimeFrameToEqual(timeFrames[1], cal.timeFrames.noon);
    });

  it('should use right timeFrames with given dateFrame',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('9:00', 'HH:mm'),
          end: moment('18:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          color: 'red',
          classes: 'noon-css',
          working: false,
          default: true
        },
        'closed': {
          working: false
        }
      };
      cal.registerTimeFrames(inputTimeFrames);

      // I won't work on my birthday !
      cal.registerDateFrames({
        'my-birthday': {
          evaluator: function (date) {
            return date.month() === 7 && date.date() === 1;
          },
          targets: ['closed']
        },
        'halloween': {
          date: moment('2014-10-31', 'YYYY-MM-DD'),
          targets: ['day']
        },
        'holidays': {
          start: moment('2014-08-15', 'YYYY-MM-DD'),
          end: moment('2014-08-30', 'YYYY-MM-DD'),
          targets: ['closed']
        }
      });

      let birthdayTimeFrames = cal.getTimeFrames(moment('2014-08-01', 'YYYY-MM-DD'));
      expect(birthdayTimeFrames.length).to.eq(1);
      expectTimeFrameToEqual(birthdayTimeFrames[0], cal.timeFrames.closed);

      let halloweenTimeFrames = cal.getTimeFrames(moment('2014-10-31', 'YYYY-MM-DD'));
      expect(halloweenTimeFrames.length).to.eq(1);
      expectTimeFrameToEqual(halloweenTimeFrames[0], cal.timeFrames.day);

      let holidaysTimeFrames = cal.getTimeFrames(moment('2014-08-20', 'YYYY-MM-DD'));
      expect(holidaysTimeFrames.length).to.eq(1);
      expectTimeFrameToEqual(holidaysTimeFrames[0], cal.timeFrames.closed);

      let defaultTimeFrames = cal.getTimeFrames(moment('2014-11-01', 'YYYY-MM-DD'));
      expectTimeFrameToEqual(defaultTimeFrames[0], cal.timeFrames.day);
      expectTimeFrameToEqual(defaultTimeFrames[1], cal.timeFrames.noon);
    });

  it('should solve timeFrames conflict',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('9:00', 'HH:mm'),
          end: moment('18:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          color: 'red',
          classes: 'noon-css',
          working: false,
          default: true
        },
        'dummy': {
          start: moment('20:00', 'HH:mm'),
          end: moment('22:30', 'HH:mm'),
          working: false,
          default: false
        }
      };
      cal.registerTimeFrames(inputTimeFrames);
      let timeFrames = cal.getTimeFrames(moment());

      let startDate = moment('0:00', 'HH:mm');
      let endDate = moment(startDate).add(1, 'day');

      timeFrames = cal.solve(timeFrames, startDate, endDate);
      expect(timeFrames.length).to.be.eq(3);

      expect(timeFrames[0].start.valueOf()).to.be.eq(cal.timeFrames.day.start.valueOf());
      expect(timeFrames[0].end.valueOf()).to.be.eq(cal.timeFrames.noon.start.valueOf());
      expect(timeFrames[0].working).to.be.ok;

      expect(timeFrames[1].start.valueOf()).to.be.eq(cal.timeFrames.noon.start.valueOf());
      expect(timeFrames[1].end.valueOf()).to.be.eq(cal.timeFrames.noon.end.valueOf());
      expect(timeFrames[1].classes.valueOf()).to.be.eq(cal.timeFrames.noon.classes.valueOf());
      expect(timeFrames[1].color.valueOf()).to.be.eq(cal.timeFrames.noon.color.valueOf());
      expect(timeFrames[1].working).to.be.not.ok;

      expect(timeFrames[2].start.valueOf()).to.be.eq(cal.timeFrames.noon.end.valueOf());
      expect(timeFrames[2].end.valueOf()).to.be.eq(cal.timeFrames.day.end.valueOf());
      expect(timeFrames[2].working).to.be.ok;
    });

  it('should solve single open non-working timeFrame ',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'closed': {
          working: false,
          default: true
        }
      };
      cal.registerTimeFrames(inputTimeFrames);
      let timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).to.be.eq(1);

      expect(timeFrames[0].working).to.be.not.ok;
    });

  it('should solve timeFrame for small timePeriod',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('9:00', 'HH:mm'),
          end: moment('18:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          color: 'red',
          classes: 'noon-css',
          working: false,
          default: true
        },
        'dummy': {
          start: moment('20:00', 'HH:mm'),
          end: moment('22:30', 'HH:mm'),
          working: false,
          default: false
        }
      };
      cal.registerTimeFrames(inputTimeFrames);
      let timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames, moment('12:00', 'HH:mm'), moment('13:00', 'HH:mm'));
      expect(timeFrames.length).to.be.eq(1);

      expect(timeFrames[0].working).to.be.not.ok;
      expect(timeFrames[0].color).to.be.eq('red');
      expect(timeFrames[0].classes).to.be.eq('noon-css');
    });

  it('should solve nothing when nothing is registered',
    function () {
      let cal = new Calendar();
      let timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).to.be.eq(0);
    });

  it('should solve timeFrames using dateFrames',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('8:00', 'HH:mm'),
          end: moment('20:00', 'HH:mm'),
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          working: false,
          default: true
        },
        'weekend': {
          working: false
        },
        'holiday': {
          working: false,
          color: 'red',
          classes: ['gantt-timeframe-holiday']
        }
      };

      let inputDateFrames = {
        'weekend': {
          evaluator: function (date) {
            return date.isoWeekday() === 6 || date.isoWeekday() === 7;
          },
          targets: ['weekend']
        },
        '11-november': {
          evaluator: function (date) {
            return date.month() === 10 && date.date() === 11;
          },
          targets: ['holiday']
        }
      };

      cal.registerTimeFrames(inputTimeFrames);
      cal.registerDateFrames(inputDateFrames);

      let timeFrames = cal.getTimeFrames(moment().year(2016).month(10).date(11));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).to.be.eq(1);

      expect(timeFrames[0].working).to.be.not.ok;
      expect(timeFrames[0].color).to.be.eq('red');
      expect(timeFrames[0].classes.length).to.be.eq(1);
      expect(timeFrames[0].classes[0]).to.be.eq('gantt-timeframe-holiday');

      timeFrames = cal.getTimeFrames(moment().month(0).day(6));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).to.be.eq(1);

      expect(timeFrames[0].working).to.be.not.ok;
      expect(timeFrames[0].color).to.be.undefined;
      expect(timeFrames[0].classes).to.be.undefined;

      timeFrames = cal.getTimeFrames(moment().month(3).date(5).day(3));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).to.be.eq(3);
    });

  it('should solve whole day working timeFrame with night as default',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'night': {
          color: 'black',
          working: false,
          default: true
        },
        'day': {
          start: moment('8:00', 'HH:mm'),
          end: moment('20:00', 'HH:mm'),
          color: 'blue',
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          color: 'red',
          working: false,
          default: true
        },
        'weekend': {
          working: false
        },
        'holiday': {
          working: false,
          color: 'red',
          classes: ['gantt-timeframe-holiday']
        }
      };

      cal.registerTimeFrames(inputTimeFrames);

      let cDate = moment();
      let cDateStartOfDay = moment(cDate).startOf('day');
      let cDateNextDay = moment(cDateStartOfDay).add(1, 'day');

      let timeFrames = cal.getTimeFrames(cDate);
      timeFrames = cal.solve(timeFrames, cDateStartOfDay, cDateNextDay);
      expect(timeFrames.length).to.be.eq(5);

      expect(timeFrames[0].working).to.be.not.ok;
      expect(timeFrames[0].color).to.be.eq('black');

      expect(timeFrames[1].working).to.be.ok;
      expect(timeFrames[1].color).to.be.eq('blue');

      expect(timeFrames[2].working).to.be.not.ok;
      expect(timeFrames[2].color).to.be.eq('red');

      expect(timeFrames[3].working).to.be.ok;
      expect(timeFrames[3].color).to.be.eq('blue');

      expect(timeFrames[4].working).to.be.not.ok;
      expect(timeFrames[4].color).to.be.eq('black');

    });

  it('should solve calendar from demo',
    function () {
      let cal = new Calendar();

      let inputTimeFrames = {
        'day': {
          start: moment('8:00', 'HH:mm'),
          end: moment('20:00', 'HH:mm'),
          color: '#ACFFA3',
          working: true,
          default: true
        },
        'noon': {
          start: moment('12:00', 'HH:mm'),
          end: moment('13:30', 'HH:mm'),
          working: false,
          default: true
        },
        'closed': {
          working: false,
          default: true
        },
        'weekend': {
          working: false
        },
        'holiday': {
          working: false,
          color: 'red',
          classes: ['gantt-timeframe-holiday']
        }
      };

      cal.registerTimeFrames(inputTimeFrames);

      let cDate = moment();
      let cDateStartOfDay = moment(cDate).startOf('day');
      let cDateNextDay = moment(cDateStartOfDay).add(1, 'day');

      let timeFrames = cal.getTimeFrames(cDate);
      timeFrames = cal.solve(timeFrames, cDateStartOfDay, cDateNextDay);
      expect(timeFrames.length).to.be.eq(5);

      expect(timeFrames[0].working).to.be.not.ok;
      expect(timeFrames[0].color).to.be.not.ok;

      expect(timeFrames[1].working).to.be.ok;
      expect(timeFrames[1].color).to.be.eq('#ACFFA3');

      expect(timeFrames[2].working).to.be.not.ok;
      expect(timeFrames[2].color).to.be.not.ok;

      expect(timeFrames[3].working).to.be.ok;
      expect(timeFrames[3].color).to.be.eq('#ACFFA3');

      expect(timeFrames[4].working).to.be.not.ok;
      expect(timeFrames[4].color).to.be.not.ok;

    });

});
