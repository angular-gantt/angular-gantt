'use strict';
/**
 * Calendar factory is used to define working periods, non working periods, and other specific period of time,
 * and retrieve effective timeFrames for each day of the gantt.
 */
gantt.factory('GanttCalendar', ['$filter', function($filter) {
    /**
     * TimeFrame represents time frame in any day. parameters are given using options object.
     *
     * @param {moment|string} start start of timeFrame. If a string is given, it will be parsed as a moment.
     * @param {moment|string} end end of timeFrame. If a string is given, it will be parsed as a moment.
     * @param {boolean} working is this timeFrame flagged as working.
     * @param {boolean} default is this timeFrame will be used as default.
     * @param {color} css color attached to this timeFrame.
     * @param {string} classes css classes attached to this timeFrame.
     *
     * @constructor
     */
    var TimeFrame = function(options) {
        var self = this;

        if (options === undefined) {
            options = {};
        }

        self.start = options.start;
        self.end = options.end;
        self.working = options.working;
        self.default = options.default;
        self.color = options.color;
        self.classes = options.classes;

        self.getDuration = function() {
            return self.end.diff(self.start, 'milliseconds');
        };

        self.clone = function() {
            return new TimeFrame(self);
        };
    };
    /**
     * TimeFrameMapping defines how timeFrames will be placed for each days. parameters are given using options object.
     *
     * @param {function} func a function with date parameter, that will be evaluated for each distinct day of the gantt.
     *                        this function must return an array of timeFrame names to apply.
     * @constructor
     */
    var TimeFrameMapping = function(func) {
        var self = this;
        self.func = func;

        self.getTimeFrames = function(date) {
            var ret = self.func(date);
            if (!(ret instanceof Array)) {
                ret = [ret];
            }
            return ret;
        };

        self.clone = function() {
            return new TimeFrameMapping(self.func);
        };
    };
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
    var DateFrame = function(options) {
        var self = this;

        self.evaluator = options.evaluator;
        if (options.date) {
            self.start = moment(options.date).startOf('day');
            self.end = moment(options.date).endOf('day');
        } else {
            self.start = options.start;
            self.end = options.end;
        }
        if (options.targets instanceof Array) {
            self.targets = options.targets;
        } else {
            self.targets = [options.targets];
        }
        self.default = options.default;

        self.dateMatch = function(date) {
            if (self.evaluator) {
                return self.evaluator(date);
            } else if (self.start && self.end) {
                return date >= self.start && date <= self.end;
            } else {
                return false;
            }
        };


        self.clone = function() {
            return new DateFrame(self);
        };
    };


    /**
     * Register TimeFrame, TimeFrameMapping and DateMapping objects into Calendar object,
     * and use Calendar#getTimeFrames(date) function to retrieve effective timeFrames for a specific day.
     *
     * @constructor
     */
    var Calendar = function() {
        var self = this;

        self.timeFrames = {};
        self.timeFrameMappings = {};
        self.dateFrames = {};

        /**
         * Remove all objects.
         */
        self.clear = function() {
            self.timeFrames = {};
            self.timeFrameMappings = {};
            self.dateFrames = {};
        };

        /**
         * Register TimeFrame objects.
         *
         * @param {object} timeFrames with names of timeFrames for keys and TimeFrame objects for values.
         */
        self.registerTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(timeFrame, name) {
                self.timeFrames[name] = new TimeFrame(timeFrame);
            });
        };

        /**
         * Removes TimeFrame objects.
         *
         * @param {array} timeFrames names of timeFrames to remove.
         */
        self.removeTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(name) {
                delete self.timeFrames[name];
            });
        };

        /**
         * Remove all TimeFrame objects.
         */
        self.clearTimeFrames = function() {
            self.timeFrames = {};
        };

        /**
         * Register TimeFrameMapping objects.
         *
         * @param {object} mappings object with names of timeFrames mappings for keys and TimeFrameMapping objects for values.
         */
        self.registerTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(timeFrameMapping, name) {
                self.timeFrameMappings[name] = new TimeFrameMapping(timeFrameMapping);
            });
        };

        /**
         * Removes TimeFrameMapping objects.
         *
         * @param {array} mappings names of timeFrame mappings to remove.
         */
        self.removeTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(name) {
                delete self.timeFrameMappings[name];
            });
        };

        /**
         * Removes all TimeFrameMapping objects.
         */
        self.clearTimeFrameMappings = function() {
            self.timeFrameMappings = {};
        };

        /**
         * Register DateFrame objects.
         *
         * @param {object} dateFrames object with names of dateFrames for keys and DateFrame objects for values.
         */
        self.registerDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(dateFrame, name) {
                self.dateFrames[name] = new DateFrame(dateFrame);
            });
        };

        /**
         * Remove DateFrame objects.
         *
         * @param {array} mappings names of date frames to remove.
         */
        self.removeDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(name) {
                delete self.dateFrames[name];
            });
        };

        /**
         * Removes all DateFrame objects.
         */
        self.clearDateFrames = function() {
            self.dateFrames = {};
        };

        var getDateFrames = function(date) {
            var dateFrames = [];
            angular.forEach(self.dateFrames, function(dateFrame) {
                if (dateFrame.dateMatch(date)) {
                    dateFrames.push(dateFrame);
                }
            });
            if (dateFrames.length === 0) {
                angular.forEach(self.dateFrames, function(dateFrame) {
                    if (dateFrame.default) {
                        dateFrames.push(dateFrame);
                    }
                });
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
        self.getTimeFrames = function(date) {
            var timeFrames = [];
            var dateFrames = getDateFrames(date);

            angular.forEach(dateFrames, function(dateFrame) {
                if (dateFrame !== undefined) {
                    angular.forEach(dateFrame.targets, function(timeFrameMappingName) {
                        var timeFrameMapping = self.timeFrameMappings[timeFrameMappingName];
                        if (timeFrameMapping !== undefined) {
                            // If a timeFrame mapping is found
                            timeFrames.push(timeFrameMapping.getTimeFrames());
                        } else {
                            // If no timeFrame mapping is found, try using direct timeFrame
                            var timeFrame = self.timeFrames[timeFrameMappingName];
                            if (timeFrame !== undefined) {
                                timeFrames.push(timeFrame);
                            }
                        }
                    });
                }
            });

            var dateYear = date.year();
            var dateMonth = date.month();
            var dateDate = date.date();

            var validatedTimeFrames = [];
            if (timeFrames.length === 0) {
                angular.forEach(self.timeFrames, function(timeFrame) {
                    if (timeFrame.default) {
                        timeFrames.push(timeFrame);
                    }
                });
            }

            angular.forEach(timeFrames, function(timeFrame) {
                timeFrame = timeFrame.clone();

                if (timeFrame.start !== undefined) {
                    timeFrame.start.year(dateYear);
                    timeFrame.start.month(dateMonth);
                    timeFrame.start.date(dateDate);
                }

                if (timeFrame.end !== undefined) {
                    timeFrame.end.year(dateYear);
                    timeFrame.end.month(dateMonth);
                    timeFrame.end.date(dateDate);

                    if (moment(timeFrame.end).startOf('day') === timeFrame.end) {
                        timeFrame.end.add(1, 'day');
                    }
                }

                validatedTimeFrames.push(timeFrame);
            });

            return validatedTimeFrames;
        };

        /**
         * Solve timeFrames using two rules.
         *
         * 1) If at least one working timeFrame is defined, everything outside
         * defined timeFrames is considered as non-working. Else it's considered
         * as working.
         *
         * 2) Smaller timeFrames have priority over larger one.
         *
         * @param {array} timeFrames Array of timeFrames to solve
         * @param {moment} startDate
         * @param {moment} endDate
         */
        self.solve = function(timeFrames, startDate, endDate) {
            var defaultWorking = timeFrames.length === 0;
            var color;
            var classes;
            var minDate;
            var maxDate;

            angular.forEach(timeFrames, function(timeFrame) {
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
            });

            if (startDate === undefined) {
                startDate = minDate;
            }

            if (endDate === undefined) {
                endDate = maxDate;
            }

            var solvedTimeFrames = [new TimeFrame({start: startDate, end: endDate, working: defaultWorking, color: color, classes: classes})];

            var orderedTimeFrames = $filter('orderBy')(timeFrames, function(timeFrame) {
                return -timeFrame.getDuration();
            });

            angular.forEach(orderedTimeFrames, function(timeFrame) {
                var tmpSolvedTimeFrames = solvedTimeFrames.slice();

                var i=0;
                var dispatched = false;
                var treated = false;
                angular.forEach(solvedTimeFrames, function(solvedTimeFrame) {
                    if (!treated) {
                        if (timeFrame.end > solvedTimeFrame.start && timeFrame.start < solvedTimeFrame.end) {
                            // timeFrame is included in this solvedTimeFrame.
                            // solvedTimeFrame:|ssssssssssssssssssssssssssssssssss|
                            //       timeFrame:          |tttttt|
                            //          result:|sssssssss|tttttt|sssssssssssssssss|

                            timeFrame = timeFrame.clone();
                            var newSolvedTimeFrame = solvedTimeFrame.clone();

                            solvedTimeFrame.end = moment(timeFrame.start);
                            newSolvedTimeFrame.start = moment(timeFrame.end);

                            tmpSolvedTimeFrames.splice(i + 1, 0, timeFrame.clone(), newSolvedTimeFrame);
                            treated = true;
                        } else if (!dispatched && timeFrame.start < solvedTimeFrame.end) {
                            // timeFrame is dispatched on two solvedTimeFrame.
                            // First part
                            // solvedTimeFrame:|sssssssssssssssssssssssssssssssssss|s+1;s+1;s+1;s+1;s+1;s+1|
                            //       timeFrame:                                |tttttt|
                            //          result:|sssssssssssssssssssssssssssssss|tttttt|;s+1;s+1;s+1;s+1;s+1|

                            timeFrame = timeFrame.clone();

                            solvedTimeFrame.end = moment(timeFrame.start);
                            tmpSolvedTimeFrames.splice(i + 1, 0, timeFrame);

                            dispatched = true;
                        } else if (dispatched && timeFrame.end > solvedTimeFrame.start) {
                            // timeFrame is dispatched on two solvedTimeFrame.
                            // Second part

                            solvedTimeFrame.start = moment(timeFrame.end);
                            dispatched = false;
                            treated = true;
                        }
                        i++;
                    }
                });

                solvedTimeFrames = tmpSolvedTimeFrames;
            });

            solvedTimeFrames = $filter('filter')(solvedTimeFrames, function(timeFrame) {
                return (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
            });

            return solvedTimeFrames;

        };
    };
    return Calendar;
}]);
