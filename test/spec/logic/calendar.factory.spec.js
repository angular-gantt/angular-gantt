'use strict';

describe('Unit: Calendar', function() {
    // Load the module with MainController
    beforeEach(module('gantt'));

    var Calendar;
    var moment;

    var objectToArray = function(map) {
        var array = [];
        for (var i in map) {
            if (map.hasOwnProperty(i)) {
                array.push(map[i]);
            }
        }
        return array;
    };

    var expectTimeFrameToEqual = function(actual, expected) {
        expect(expected.start).toEqual(actual.start);
        expect(expected.end).toEqual(actual.end);
        expect(expected.working).toEqual(actual.working);
    };

    beforeEach(inject(['GanttCalendar', 'moment', function(_Calendar_, _moment_) {
        Calendar = _Calendar_;
        moment = _moment_;
    }]));

    it('register and use default timeFrames',
        function() {
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
                    working: false,
                    default: true
                },
                'dummy':{
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

    it('use right timeFrames using dateFrame',
        function() {
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
                    working: false,
                    default: true
                },
                'closed':{
                    working: false
                }
            };
            cal.registerTimeFrames(inputTimeFrames);

            // I won't work on my birthday !
            cal.registerDateFrames({
                'my-birthday': {
                    evaluator: function(date) {
                        return date.month() === 7 && date.date() === 1;
                    },
                    targets: ['closed']
                },
                'halloween':{
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

    it('solves timeFrames conflict',
        function() {
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
                    working: false,
                    default: true
                },
                'dummy':{
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
            expect(timeFrames.length).toBe(5);

            expect(timeFrames[0].start).toEqual(startDate);
            expect(timeFrames[0].end).toEqual(cal.timeFrames.day.start);
            expect(timeFrames[0].working).toBeFalsy();

            expect(timeFrames[1].start).toEqual(cal.timeFrames.day.start);
            expect(timeFrames[1].end).toEqual(cal.timeFrames.noon.start);
            expect(timeFrames[1].working).toBeTruthy();

            expect(timeFrames[2].start).toEqual(cal.timeFrames.noon.start);
            expect(timeFrames[2].end).toEqual(cal.timeFrames.noon.end);
            expect(timeFrames[2].working).toBeFalsy();

            expect(timeFrames[3].start).toEqual(cal.timeFrames.noon.end);
            expect(timeFrames[3].end).toEqual(cal.timeFrames.day.end);
            expect(timeFrames[3].working).toBeTruthy();

            expect(timeFrames[4].start).toEqual(cal.timeFrames.day.end);
            expect(timeFrames[4].end).toEqual(endDate);
            expect(timeFrames[4].working).toBeFalsy();
        });

    it('solves single open non-working timeFrame ',
        function() {
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

});
