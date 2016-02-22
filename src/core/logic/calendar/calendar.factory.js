(function(){
    'use strict';
    /**
     * Calendar factory is used to define working periods, non working periods, and other specific period of time,
     * and retrieve effective timeFrames for each day of the gantt.
     */
    angular.module('gantt').factory('GanttCalendar', ['$filter', 'moment', function($filter, moment) {
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
        var TimeFrame = function(options) {
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
        };

        TimeFrame.prototype.updateView = function() {
            if (this.$element) {
                var cssStyles = {};

                if (this.left !== undefined) {
                    cssStyles.left = this.left + 'px';
                } else {
                    cssStyles.left = '';
                }
                if (this.width !== undefined) {
                    cssStyles.width = this.width + 'px';
                } else {
                    cssStyles.width = '';
                }

                if (this.color !== undefined) {
                    cssStyles['background-color'] = this.color;
                } else {
                    cssStyles['background-color'] = '';
                }

                this.$element.css(cssStyles);

                var classes = ['gantt-timeframe' + (this.working ? '' : '-non') + '-working'];
                if (this.classes) {
                    classes = classes.concat(this.classes);
                }
                for (var i = 0, l = classes.length; i < l; i++) {
                    this.$element.toggleClass(classes[i], true);
                }
            }
        };

        TimeFrame.prototype.getDuration = function() {
            if (this.end !== undefined && this.start !== undefined) {
                return this.end.diff(this.start, 'milliseconds');
            }
        };

        TimeFrame.prototype.clone = function() {
            return new TimeFrame(this);
        };

        /**
         * TimeFrameMapping defines how timeFrames will be placed for each days. parameters are given using options object.
         *
         * @param {function} func a function with date parameter, that will be evaluated for each distinct day of the gantt.
         *                        this function must return an array of timeFrame names to apply.
         * @constructor
         */
        var TimeFrameMapping = function(func) {
            this.func = func;
        };

        TimeFrameMapping.prototype.getTimeFrames = function(date) {
            var ret = this.func(date);
            if (!(ret instanceof Array)) {
                ret = [ret];
            }
            return ret;
        };

        TimeFrameMapping.prototype.clone = function() {
            return new TimeFrameMapping(this.func);
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

        DateFrame.prototype.dateMatch = function(date) {
            if (this.evaluator) {
                return this.evaluator(date);
            } else if (this.start && this.end) {
                return date >= this.start && date <= this.end;
            } else {
                return false;
            }
        };

        DateFrame.prototype.clone = function() {
            return new DateFrame(this);
        };



        /**
         * Register TimeFrame, TimeFrameMapping and DateMapping objects into Calendar object,
         * and use Calendar#getTimeFrames(date) function to retrieve effective timeFrames for a specific day.
         *
         * @constructor
         */
        var Calendar = function() {
            this.timeFrames = {};
            this.timeFrameMappings = {};
            this.dateFrames = {};
        };

        /**
         * Remove all objects.
         */
        Calendar.prototype.clear = function() {
            this.timeFrames = {};
            this.timeFrameMappings = {};
            this.dateFrames = {};
        };

        /**
         * Register TimeFrame objects.
         *
         * @param {object} timeFrames with names of timeFrames for keys and TimeFrame objects for values.
         */
        Calendar.prototype.registerTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(timeFrame, name) {
                this.timeFrames[name] = new TimeFrame(timeFrame);
            }, this);
        };

        /**
         * Removes TimeFrame objects.
         *
         * @param {array} timeFrames names of timeFrames to remove.
         */
        Calendar.prototype.removeTimeFrames = function(timeFrames) {
            angular.forEach(timeFrames, function(name) {
                delete this.timeFrames[name];
            }, this);
        };

        /**
         * Remove all TimeFrame objects.
         */
        Calendar.prototype.clearTimeFrames = function() {
            this.timeFrames = {};
        };

        /**
         * Register TimeFrameMapping objects.
         *
         * @param {object} mappings object with names of timeFrames mappings for keys and TimeFrameMapping objects for values.
         */
        Calendar.prototype.registerTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(timeFrameMapping, name) {
                this.timeFrameMappings[name] = new TimeFrameMapping(timeFrameMapping);
            }, this);
        };

        /**
         * Removes TimeFrameMapping objects.
         *
         * @param {array} mappings names of timeFrame mappings to remove.
         */
        Calendar.prototype.removeTimeFrameMappings = function(mappings) {
            angular.forEach(mappings, function(name) {
                delete this.timeFrameMappings[name];
            }, this);
        };

        /**
         * Removes all TimeFrameMapping objects.
         */
        Calendar.prototype.clearTimeFrameMappings = function() {
            this.timeFrameMappings = {};
        };

        /**
         * Register DateFrame objects.
         *
         * @param {object} dateFrames object with names of dateFrames for keys and DateFrame objects for values.
         */
        Calendar.prototype.registerDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(dateFrame, name) {
                this.dateFrames[name] = new DateFrame(dateFrame);
            }, this);
        };

        /**
         * Remove DateFrame objects.
         *
         * @param {array} mappings names of date frames to remove.
         */
        Calendar.prototype.removeDateFrames = function(dateFrames) {
            angular.forEach(dateFrames, function(name) {
                delete this.dateFrames[name];
            }, this);
        };

        /**
         * Removes all DateFrame objects.
         */
        Calendar.prototype.clearDateFrames = function() {
            this.dateFrames = {};
        };

        var filterDateFrames = function(inputDateFrames, date) {
            var dateFrames = [];
            angular.forEach(inputDateFrames, function(dateFrame) {
                if (dateFrame.dateMatch(date)) {
                    dateFrames.push(dateFrame);
                }
            });
            if (dateFrames.length === 0) {
                angular.forEach(inputDateFrames, function(dateFrame) {
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
        Calendar.prototype.getTimeFrames = function(date) {
            var timeFrames = [];
            var dateFrames = filterDateFrames(this.dateFrames, date);

            for (var i=0; i < dateFrames.length; i++) {
                if (dateFrames[i] !== undefined) {
                    var targets = dateFrames[i].targets;

                    for (var j=0; j < targets.length; j++) {
                        var timeFrameMapping = this.timeFrameMappings[targets[j]];
                        if (timeFrameMapping !== undefined) {
                            // If a timeFrame mapping is found
                            timeFrames.push(timeFrameMapping.getTimeFrames());
                        } else {
                            // If no timeFrame mapping is found, try using direct timeFrame
                            var timeFrame = this.timeFrames[targets[j]];
                            if (timeFrame !== undefined) {
                                timeFrames.push(timeFrame);
                            }
                        }
                    }
                }
            }

            var dateYear = date.year();
            var dateMonth = date.month();
            var dateDate = date.date();

            var validatedTimeFrames = [];
            if (timeFrames.length === 0) {
                angular.forEach(this.timeFrames, function(timeFrame) {
                    if (timeFrame.default) {
                        timeFrames.push(timeFrame);
                    }
                });
            }

            for (i=0; i < timeFrames.length; i++) {
                var cTimeFrame = timeFrames[i].clone();

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
        Calendar.prototype.solve = function(timeFrames, startDate, endDate) {
            var color;
            var classes;
            var minDate;
            var maxDate;

            for (var i=0; i<timeFrames.length; i++) {
                var timeFrame = timeFrames[i];
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

            var solvedTimeFrames = [new TimeFrame({start: startDate, end: endDate, internal: true})];

            timeFrames = $filter('filter')(timeFrames, function(timeFrame) {
                return (timeFrame.start === undefined || timeFrame.start < endDate) && (timeFrame.end === undefined || timeFrame.end > startDate);
            });

            for (i=0; i<timeFrames.length; i++) {
                var cTimeFrame = timeFrames[i];
                if (!cTimeFrame.start) {
                    cTimeFrame.start = startDate;
                }
                if (!cTimeFrame.end) {
                    cTimeFrame.end = endDate;
                }
            }

            var orderedTimeFrames = $filter('orderBy')(timeFrames, function(timeFrame) {
                return -timeFrame.getDuration();
            });

            var k;
            for (i=0; i<orderedTimeFrames.length; i++) {
                var oTimeFrame = orderedTimeFrames[i];

                var tmpSolvedTimeFrames = solvedTimeFrames.slice();

                k=0;
                var dispatched = false;
                var treated = false;

                for (var j=0; j<solvedTimeFrames.length; j++) {
                    var sTimeFrame = solvedTimeFrames[j];

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

                            var newSolvedTimeFrame = sTimeFrame.clone();

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

            solvedTimeFrames = $filter('filter')(solvedTimeFrames, function(timeFrame) {
                return !timeFrame.internal &&
                    (timeFrame.start === undefined || timeFrame.start < endDate) &&
                    (timeFrame.end === undefined || timeFrame.end > startDate);
            });

            return solvedTimeFrames;

        };

        return Calendar;
    }]);
}());
