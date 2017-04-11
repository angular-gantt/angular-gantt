require('angular-mocks');

describe('Calendar', function () {
  // Load the module with MainController
  beforeEach(module('gantt'));

  var Calendar;
  var moment;

  var expectTimeFrameToEqual = function (actual, expected) {
    expect(expected.start).toEqual(actual.start);
    expect(expected.end).toEqual(actual.end);
    expect(expected.working).toEqual(actual.working);
    expect(expected.color).toEqual(actual.color);
    expect(expected.classes).toEqual(actual.classes);
  };

  beforeEach(inject(['GanttCalendar', 'moment', function (_Calendar_, _moment_) {
    Calendar = _Calendar_;
    moment = _moment_;
  }]));

  it('should register and use default timeFrames',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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
      var timeFrames = cal.getTimeFrames(moment());

      expect(timeFrames.length).toBe(2);

      expectTimeFrameToEqual(timeFrames[0], cal.timeFrames.day);
      expectTimeFrameToEqual(timeFrames[1], cal.timeFrames.noon);
    });

  it('should use right timeFrames with given dateFrame',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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

      var birthdayTimeFrames = cal.getTimeFrames(moment('2014-08-01', 'YYYY-MM-DD'));
      expect(birthdayTimeFrames.length).toBe(1);
      expectTimeFrameToEqual(birthdayTimeFrames[0], cal.timeFrames.closed);

      var halloweenTimeFrames = cal.getTimeFrames(moment('2014-10-31', 'YYYY-MM-DD'));
      expect(halloweenTimeFrames.length).toBe(1);
      expectTimeFrameToEqual(halloweenTimeFrames[0], cal.timeFrames.day);

      var holidaysTimeFrames = cal.getTimeFrames(moment('2014-08-20', 'YYYY-MM-DD'));
      expect(holidaysTimeFrames.length).toBe(1);
      expectTimeFrameToEqual(holidaysTimeFrames[0], cal.timeFrames.closed);

      var defaultTimeFrames = cal.getTimeFrames(moment('2014-11-01', 'YYYY-MM-DD'));
      expectTimeFrameToEqual(defaultTimeFrames[0], cal.timeFrames.day);
      expectTimeFrameToEqual(defaultTimeFrames[1], cal.timeFrames.noon);
    });

  it('should solve timeFrames conflict',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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
      var timeFrames = cal.getTimeFrames(moment());

      var startDate = moment('0:00', 'HH:mm');
      var endDate = moment(startDate).add(1, 'day');

      timeFrames = cal.solve(timeFrames, startDate, endDate);
      expect(timeFrames.length).toBe(3);

      expect(timeFrames[0].start.valueOf()).toEqual(cal.timeFrames.day.start.valueOf());
      expect(timeFrames[0].end.valueOf()).toEqual(cal.timeFrames.noon.start.valueOf());
      expect(timeFrames[0].working).toBeTruthy();

      expect(timeFrames[1].start.valueOf()).toEqual(cal.timeFrames.noon.start.valueOf());
      expect(timeFrames[1].end.valueOf()).toEqual(cal.timeFrames.noon.end.valueOf());
      expect(timeFrames[1].classes.valueOf()).toEqual(cal.timeFrames.noon.classes.valueOf());
      expect(timeFrames[1].color.valueOf()).toEqual(cal.timeFrames.noon.color.valueOf());
      expect(timeFrames[1].working).toBeFalsy();

      expect(timeFrames[2].start.valueOf()).toEqual(cal.timeFrames.noon.end.valueOf());
      expect(timeFrames[2].end.valueOf()).toEqual(cal.timeFrames.day.end.valueOf());
      expect(timeFrames[2].working).toBeTruthy();
    });

  it('should solve single open non-working timeFrame ',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
        'closed': {
          working: false,
          default: true
        }
      };
      cal.registerTimeFrames(inputTimeFrames);
      var timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).toBe(1);

      expect(timeFrames[0].working).toBeFalsy();
    });

  it('should solve timeFrame for small timePeriod',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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
      var timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames, moment('12:00', 'HH:mm'), moment('13:00', 'HH:mm'));
      expect(timeFrames.length).toBe(1);

      expect(timeFrames[0].working).toBeFalsy();
      expect(timeFrames[0].color).toBe('red');
      expect(timeFrames[0].classes).toBe('noon-css');
    });

  it('should solve nothing when nothing is registered',
    function () {
      var cal = new Calendar();
      var timeFrames = cal.getTimeFrames(moment());

      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).toBe(0);
    });

  it('should solve timeFrames using dateFrames',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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

      var inputDateFrames = {
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

      var timeFrames = cal.getTimeFrames(moment().year(2016).month(10).date(11));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).toBe(1);

      expect(timeFrames[0].working).toBeFalsy();
      expect(timeFrames[0].color).toBe('red');
      expect(timeFrames[0].classes.length).toBe(1);
      expect(timeFrames[0].classes[0]).toBe('gantt-timeframe-holiday');

      timeFrames = cal.getTimeFrames(moment().month(0).day(6));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).toBe(1);

      expect(timeFrames[0].working).toBeFalsy();
      expect(timeFrames[0].color).toBeUndefined();
      expect(timeFrames[0].classes).toBeUndefined();

      timeFrames = cal.getTimeFrames(moment().month(3).date(5).day(3));
      timeFrames = cal.solve(timeFrames);
      expect(timeFrames.length).toBe(3);
    });

  it('should solve whole day working timeFrame with night as default',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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

      var cDate = moment();
      var cDateStartOfDay = moment(cDate).startOf('day');
      var cDateNextDay = moment(cDateStartOfDay).add(1, 'day');

      var timeFrames = cal.getTimeFrames(cDate);
      timeFrames = cal.solve(timeFrames, cDateStartOfDay, cDateNextDay);
      expect(timeFrames.length).toBe(5);

      expect(timeFrames[0].working).toBeFalsy();
      expect(timeFrames[0].color).toBe('black');

      expect(timeFrames[1].working).toBeTruthy();
      expect(timeFrames[1].color).toBe('blue');

      expect(timeFrames[2].working).toBeFalsy();
      expect(timeFrames[2].color).toBe('red');

      expect(timeFrames[3].working).toBeTruthy();
      expect(timeFrames[3].color).toBe('blue');

      expect(timeFrames[4].working).toBeFalsy();
      expect(timeFrames[4].color).toBe('black');

    });

  it('should solve calendar from demo',
    function () {
      var cal = new Calendar();

      var inputTimeFrames = {
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

      var cDate = moment();
      var cDateStartOfDay = moment(cDate).startOf('day');
      var cDateNextDay = moment(cDateStartOfDay).add(1, 'day');

      var timeFrames = cal.getTimeFrames(cDate);
      timeFrames = cal.solve(timeFrames, cDateStartOfDay, cDateNextDay);
      expect(timeFrames.length).toBe(5);

      expect(timeFrames[0].working).toBeFalsy();
      expect(timeFrames[0].color).toBeFalsy();

      expect(timeFrames[1].working).toBeTruthy();
      expect(timeFrames[1].color).toBe('#ACFFA3');

      expect(timeFrames[2].working).toBeFalsy();
      expect(timeFrames[2].color).toBeFalsy();

      expect(timeFrames[3].working).toBeTruthy();
      expect(timeFrames[3].color).toBe('#ACFFA3');

      expect(timeFrames[4].working).toBeFalsy();
      expect(timeFrames[4].color).toBeFalsy();

    });

});
