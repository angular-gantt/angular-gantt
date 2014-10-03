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

    beforeEach(inject(['GanttCalendar', 'moment', function(_Calendar_, _moment_) {
        Calendar = _Calendar_;
        moment = _moment_;
    }]));

    it('register and use default timeFrames',
        function() {
            var cal = new Calendar.Calendar();

            var inputTimeFrames = {
                'day': new Calendar.TimeFrame({
                    start: moment('9:00', 'HH:mm'),
                    end: moment('18:00', 'HH:mm'),
                    working: true,
                    default: true
                }),
                'noon': new Calendar.TimeFrame({
                    start: moment('12:00', 'HH:mm'),
                    end: moment('13:30', 'HH:mm'),
                    working: false,
                    default: true
                }),
                'dummy': new Calendar.TimeFrame({
                    start: moment('20:00', 'HH:mm'),
                    end: moment('22:30', 'HH:mm'),
                    working: false,
                    default: false
                })
            };
            cal.registerTimeFrames(inputTimeFrames);
            var timeFrames = cal.getTimeFrames(moment());

            expect(timeFrames.length).toBe(2);
            expect(timeFrames).toEqual([inputTimeFrames.day, inputTimeFrames.noon]);
        });

    it('use right timeFrames using dateFrame',
        function() {
            var cal = new Calendar.Calendar();

            var inputTimeFrames = {
                'day': new Calendar.TimeFrame({
                    start: moment('9:00', 'HH:mm'),
                    end: moment('18:00', 'HH:mm'),
                    working: true,
                    default: true
                }),
                'noon': new Calendar.TimeFrame({
                    start: moment('12:00', 'HH:mm'),
                    end: moment('13:30', 'HH:mm'),
                    working: false,
                    default: true
                }),
                'closed': new Calendar.TimeFrame({
                    working: false
                })
            };
            cal.registerTimeFrames(inputTimeFrames);

            // I won't work on my birthday !
            cal.registerDateFrames({
                'my-birthday': new Calendar.DateFrame({
                    evaluator: function(date) {
                        return date.month() === 7 && date.date() === 1;
                    },
                    targets: ['closed']
                }),
                'halloween': new Calendar.DateFrame({
                    date: moment('2014-10-31', 'YYYY-MM-DD'),
                    targets: ['day']
                }),
                'holidays': new Calendar.DateFrame({
                    start: moment('2014-08-15', 'YYYY-MM-DD'),
                    end: moment('2014-08-30', 'YYYY-MM-DD'),
                    targets: ['closed']
                })
            });

            var birthdayTimeFrames = cal.getTimeFrames(moment('2014-08-01', 'YYYY-MM-DD'));
            expect(birthdayTimeFrames.length).toBe(1);
            expect(birthdayTimeFrames[0]).toEqual(inputTimeFrames.closed);

            var halloweenTimeFrames = cal.getTimeFrames(moment('2014-10-31', 'YYYY-MM-DD'));
            expect(halloweenTimeFrames.length).toBe(1);
            expect(halloweenTimeFrames[0]).toEqual(inputTimeFrames.day);

            var holidaysTimeFrames = cal.getTimeFrames(moment('2014-08-20', 'YYYY-MM-DD'));
            expect(holidaysTimeFrames.length).toBe(1);
            expect(holidaysTimeFrames[0]).toEqual(inputTimeFrames.closed);

            var defaultTimeFrames = cal.getTimeFrames(moment('2014-11-01', 'YYYY-MM-DD'));
            expect(defaultTimeFrames).toEqual([inputTimeFrames.day, inputTimeFrames.noon]);
        });

});
