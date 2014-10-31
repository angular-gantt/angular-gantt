/*
Project: angular-gantt for AngularJS
Author: Marco Schweighauser
Contributors: Rémi Alvergnat
License: MIT.
Github: https://github.com/angular-gantt/angular-gantt
*/
'use strict';


var gantt = angular.module('gantt', ['ganttTemplates', 'angularMoment']);
gantt.constant('GANTT_EVENTS',
    {
        'READY': 'event:gantt-ready',
        'SCROLL': 'event:gantt-scroll',

        'TASK_ADDED': 'event:gantt-task-added',
        'TASK_CHANGED': 'event:gantt-task-changed',
        'TASK_REMOVED': 'event:gantt-task-removed',
        'TASK_MOVED': 'event:gantt-task-moved',
        'TASK_MOVE_BEGIN': 'event:gantt-task-move-begin',
        'TASK_MOVE': 'event:gantt-task-move',
        'TASK_MOVE_END': 'event:gantt-task-move-end',
        'TASK_RESIZE_BEGIN': 'event:gantt-task-resize-begin',
        'TASK_RESIZE': 'event:gantt-task-resize',
        'TASK_RESIZE_END': 'event:gantt-task-resize-end',
        'TASK_CLICKED': 'event:gantt-task-clicked',
        'TASK_DBL_CLICKED': 'event:gantt-task-dblclicked',
        'TASK_CONTEXTMENU': 'event:gantt-task-contextmenu',

        'COLUMN_CLICKED': 'event:gantt-column-clicked',
        'COLUMN_DBL_CLICKED': 'event:gantt-column-dblclicked',
        'COLUMN_CONTEXTMENU': 'event:gantt-column-contextmenu',

        'ROW_MOUSEDOWN': 'event:gantt-row-mousedown',
        'ROW_MOUSEUP': 'event:gantt-row-mouseup',
        'ROW_CLICKED': 'event:gantt-row-clicked',
        'ROW_DBL_CLICKED': 'event:gantt-row-dblclicked',
        'ROW_CONTEXTMENU': 'event:gantt-row-contextmenu',
        'ROW_CHANGED': 'event:gantt-row-changed',
        'ROW_ADDED': 'event:gantt-row-added',
        'ROW_REMOVED': 'event:gantt-row-removed',
        'ROW_ORDER_CHANGED': 'event:gantt-row-order-changed',

        'ROW_LABEL_MOUSEDOWN': 'event:gantt-row-label-mousedown',
        'ROW_LABEL_MOUSEUP': 'event:gantt-row-label-mouseup',
        'ROW_LABEL_CLICKED': 'event:gantt-row-label-clicked',
        'ROW_LABEL_DBL_CLICKED': 'event:gantt-row-label-dblclicked',
        'ROW_LABEL_CONTEXTMENU': 'event:gantt-row-label-contextmenu',

        'ROW_HEADER_MOUSEDOWN': 'event:gantt-row-header-mousedown',
        'ROW_HEADER_MOUSEUP': 'event:gantt-row-header-mouseup',
        'ROW_HEADER_CLICKED': 'event:gantt-row-header-clicked',
        'ROW_HEADER_DBL_CLICKED': 'event:gantt-row-header-dblclicked',
        'ROW_HEADER_CONTEXTMENU': 'event:gantt-row-header-contextmenu',

        'ROW_LABELS_RESIZED': 'event:gantt-row-labels-resized',

        'TIMESPAN_ADDED': 'event:gantt-timespan-added',
        'TIMESPAN_CHANGED': 'event:gantt-timespan-changed',

        'TASKS_FILTERED': 'event:gantt-tasks-filtered',
        'ROWS_FILTERED': 'event:gantt-rows-filtered'
    });

gantt.directive('gantt', ['Gantt', 'GanttCalendar', 'moment', 'ganttMouseOffset', 'ganttDebounce', 'GanttEvents', 'ganttEnableNgAnimate', 'GANTT_EVENTS', function(Gantt, Calendar, moment, mouseOffset, debounce, Events, enableNgAnimate, GANTT_EVENTS) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.gantt.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        scope: {
            sortMode: '=?', // Possible modes: 'name', 'date', 'custom'
            filterTask: '=?', // Task filter as a angularJS expression
            filterTaskComparator: '=?', // Comparator to use for the task filter
            filterRow: '=?', // Row filter as a angularJS expression
            filterRowComparator: '=?', // Comparator to use for the row filter
            viewScale: '=?', // Possible scales: 'hour', 'day', 'week', 'month'
            columnWidth: '=?', // Defines the size of a column, 1 being 1em per unit (hour or day, .. depending on scale),
            allowTaskMoving: '=?', // Set to true if tasks should be moveable by the user.
            allowTaskResizing: '=?', // Set to true if tasks should be resizable by the user.
            allowTaskRowSwitching: '=?', // If false then tasks can be moved inside their current row only. The user can not move it to another row.
            allowRowSorting: '=?', // Set to true if the user should be able to re-order rows.
            allowLabelsResizing: '=?', // Set to true if the user should be able to resize the label section.
            fromDate: '=?', // If not specified will use the earliest task date (note: as of now this can only expand not shrink)
            toDate: '=?', // If not specified will use the latest task date (note: as of now this can only expand not shrink)
            currentDateValue: '=?', // If specified, the current date will be displayed
            currentDate: '=?', // The display of currentDate ('none', 'line' or 'column').
            autoExpand: '=?', // Set this both, left or right if the date range shall expand if the user scroll to the left or right end. Otherwise set to false or none.
            taskOutOfRange: '=?', // Set this to expand or truncate to define the behavior of tasks going out of visible range.
            maxHeight: '=?', // Define the maximum height of the Gantt in PX. > 0 to activate max height behaviour.
            labelsWidth: '=?', // Define the width of the labels section. Changes when the user is resizing the labels width
            showLabelsColumn: '=?', // Whether to show column with labels or not. Default (true)
            showTooltips: '=?', // True when tooltips shall be enabled. Default (true)
            headers: '=?', // An array of units for headers.
            headersFormats: '=?', // An array of corresponding formats for headers.
            timeFrames: '=?',
            dateFrames: '=?',
            timeFramesWorkingMode: '=?',
            timeFramesNonWorkingMode: '=?',
            tooltipDateFormat: '=?',
            timespans: '=?',
            columnMagnet: '=?',
            data: '=?',
            loadTimespans: '&',
            clearTimespans: '&',
            loadData: '&',
            removeData: '&',
            clearData: '&',
            centerDate: '&'
        },
        controller: ['$scope', '$element', function($scope, $element) {
            // Initialize defaults
            if ($scope.sortMode === undefined) {
                $scope.sortMode = 'name';
            }
            if ($scope.viewScale === undefined) {
                $scope.viewScale = 'day';
            }
            if ($scope.columnMagnet === undefined) {
                $scope.columnMagnet = '15 minutes';
            }
            if ($scope.allowTaskMoving === undefined) {
                $scope.allowTaskMoving = true;
            }
            if ($scope.allowTaskResizing === undefined) {
                $scope.allowTaskResizing = true;
            }
            if ($scope.allowTaskRowSwitching === undefined) {
                $scope.allowTaskRowSwitching = true;
            }
            if ($scope.allowRowSorting === undefined) {
                $scope.allowRowSorting = true;
            }
            if ($scope.allowLabelsResizing === undefined) {
                $scope.allowLabelsResizing = true;
            }
            if ($scope.currentDateValue === undefined) {
                $scope.currentDateValue = moment();
            }
            if ($scope.currentDate === undefined) {
                $scope.currentDate = 'line';
            }
            if ($scope.maxHeight === undefined) {
                $scope.maxHeight = 0;
            }
            if ($scope.autoExpand === undefined) {
                $scope.autoExpand = 'none';
            }
            if ($scope.taskOutOfRange === undefined) {
                $scope.taskOutOfRange = 'truncate';
            }
            if ($scope.labelsWidth === undefined) {
                $scope.labelsWidth = 0;
            }
            if ($scope.showLabelsColumn === undefined) {
                $scope.showLabelsColumn = true;
            }
            if ($scope.showTooltips === undefined) {
                $scope.showTooltips = true;
            }
            if ($scope.timeFramesWorkingMode === undefined) {
                $scope.timeFramesWorkingMode = 'hidden';
            }
            if ($scope.timeFramesNonWorkingMode === undefined) {
                $scope.timeFramesNonWorkingMode = 'visible';
            }
            if ($scope.columnMagnet === undefined) {
                $scope.columnMagnet = '15 minutes';
            }
            if ($scope.tooltipDateFormat === undefined) {
                $scope.tooltipDateFormat = 'MMM DD, HH:mm';
            }

            // Disable animation if ngAnimate is present, as it drops down performance.
            enableNgAnimate(false, $element);

            $scope.calendar = new Calendar();
            $scope.calendar.registerTimeFrames($scope.timeFrames);
            $scope.calendar.registerDateFrames($scope.dateFrames);

            $scope.$watch('timeFrames', function() {
                $scope.calendar.clearTimeFrames();
                $scope.calendar.registerTimeFrames($scope.timeFrames);
            });

            $scope.$watch('dateFrames', function() {
                $scope.calendar.clearDateFrames();
                $scope.calendar.registerDateFrames($scope.dateFrames);
            });

            // Gantt logic
            $scope.template = {};
            $scope.gantt = new Gantt($scope, $element);

            // Remove specified rows and tasks.
            $scope.removeData({ fn: function(data) {$scope.gantt.removeData(data);}});

            // Load data handler.
            // The Gantt chart will keep the current view position if this function is called during scrolling.
            $scope.loadData({ fn: function(data) {$scope.gantt.loadData(data);}});
            $scope.loadTimespans({ fn: function(timespans) {$scope.gantt.loadTimespans(timespans);}});

            // Clear data handler.
            $scope.clearData({ fn: function() {$scope.gantt.clearData();}});
            $scope.clearTimespans({ fn: function() {$scope.gantt.clearTimespans();}});

            // Scroll to specified date handler.
            $scope.centerDate({ fn: function(date) {$scope.gantt.scroll.scrollToDate(date);}});

            // Gantt is initialized. Signal that the Gantt is ready.
            $scope.$emit(GANTT_EVENTS.READY);
        }
        ]};
}]);


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
        if (options === undefined) {
            options = {};
        }

        this.start = options.start;
        this.end = options.end;
        this.working = options.working;
        this.default = options.default;
        this.color = options.color;
        this.classes = options.classes;
    };


    TimeFrame.prototype.getDuration = function() {
        return this.end.diff(this.start, 'milliseconds');
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

        angular.forEach(dateFrames, function(dateFrame) {
            if (dateFrame !== undefined) {
                angular.forEach(dateFrame.targets, function(timeFrameMappingName) {
                    var timeFrameMapping = this.timeFrameMappings[timeFrameMappingName];
                    if (timeFrameMapping !== undefined) {
                        // If a timeFrame mapping is found
                        timeFrames.push(timeFrameMapping.getTimeFrames());
                    } else {
                        // If no timeFrame mapping is found, try using direct timeFrame
                        var timeFrame = this.timeFrames[timeFrameMappingName];
                        if (timeFrame !== undefined) {
                            timeFrames.push(timeFrame);
                        }
                    }
                }, this);
            }
        }, this);

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
    Calendar.prototype.solve = function(timeFrames, startDate, endDate) {
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

    return Calendar;
}]);


gantt.factory('GanttCurrentDateManager', [function() {
    var GanttCurrentDateManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.date = undefined;
        this.position = undefined;
        this.currentDateColumn = undefined;

        this.gantt.$scope.$watch('currentDate+currentDateValue', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.setCurrentDate(self.gantt.$scope.currentDateValue);
            }
        });
    };

    GanttCurrentDateManager.prototype.setCurrentDate = function(currentDate) {
        this.date = currentDate;
        if (this.currentDateColumn !== undefined) {
            this.currentDateColumn.currentDate = undefined;
            delete this.currentDateColumn;
        }

        if (this.date !== undefined) {
            var column = this.gantt.columnsManager.getColumnByDate(this.date);
            if (column !== undefined) {
                column.currentDate = this.date;
                this.currentDateColumn = column;
            }
        }

        this.position = this.gantt.getPositionByDate(this.date);
    };
    return GanttCurrentDateManager;
}]);


gantt.factory('GanttColumn', [ 'moment', function(moment) {
    // Used to display the Gantt grid and header.
    // The columns are generated by the column generator.
    var Column = function(date, endDate, left, width, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode, columnMagnetValue, columnMagnetUnit) {
        this.date = date;
        this.endDate = endDate;
        this.left = left;
        this.width = width;
        this.calendar = calendar;
        this.duration = this.endDate.diff(this.date, 'milliseconds');
        this.timeFramesWorkingMode = timeFramesWorkingMode;
        this.timeFramesNonWorkingMode = timeFramesNonWorkingMode;
        this.timeFrames = [];
        this.visibleTimeFrames = [];
        this.daysTimeFrames = {};
        this.cropped = false;
        this.columnMagnetValue = columnMagnetValue;
        this.columnMagnetUnit = columnMagnetUnit;
        this.originalSize = {left: this.left, width: this.width};
        this.updateTimeFrames();
    };

    var getDateKey = function(date) {
        return date.year() + '-' + date.month() + '-' + date.date();
    };

    Column.prototype.updateTimeFrames = function() {
        var self = this;

        if (self.calendar !== undefined && (self.timeFramesNonWorkingMode !== 'hidden' || self.timeFramesWorkingMode !== 'hidden')) {
            var buildPushTimeFrames = function(timeFrames, startDate, endDate) {
                return function(timeFrame) {
                    var start = timeFrame.start;
                    if (start === undefined) {
                        start = startDate;
                    }

                    var end = timeFrame.end;
                    if (end === undefined) {
                        end = endDate;
                    }

                    if (start < self.date) {
                        start = self.date;
                    }

                    if (end > self.endDate) {
                        end = self.endDate;
                    }

                    timeFrame = timeFrame.clone();

                    timeFrame.start = moment(start);
                    timeFrame.end = moment(end);

                    timeFrames.push(timeFrame);
                };
            };

            var cDate = self.date;
            var cDateStartOfDay = moment(cDate).startOf('day');
            var cDateNextDay = cDateStartOfDay.add(1, 'day');
            while (cDate < self.endDate) {
                var timeFrames = self.calendar.getTimeFrames(cDate);
                var nextCDate = moment.min(cDateNextDay, self.endDate);
                timeFrames = self.calendar.solve(timeFrames, cDate, nextCDate);
                var cTimeFrames = [];
                angular.forEach(timeFrames, buildPushTimeFrames(cTimeFrames, cDate, nextCDate));
                self.timeFrames = self.timeFrames.concat(cTimeFrames);

                var cDateKey = getDateKey(cDate);
                self.daysTimeFrames[cDateKey] = cTimeFrames;

                cDate = nextCDate;
                cDateStartOfDay = moment(cDate).startOf('day');
                cDateNextDay = cDateStartOfDay.add(1, 'day');
            }

            angular.forEach(self.timeFrames, function(timeFrame) {
                var positionDuration = timeFrame.start.diff(self.date, 'milliseconds');
                var position = positionDuration / self.duration * self.width;

                var timeFrameDuration = timeFrame.end.diff(timeFrame.start, 'milliseconds');
                var timeFramePosition = timeFrameDuration / self.duration * self.width;

                var hidden = false;
                if (timeFrame.working && self.timeFramesWorkingMode !== 'visible') {
                    hidden = true;
                } else if (!timeFrame.working && self.timeFramesNonWorkingMode !== 'visible') {
                    hidden = true;
                }

                if (!hidden) {
                    self.visibleTimeFrames.push(timeFrame);
                }

                timeFrame.hidden = hidden;
                timeFrame.left = position;
                timeFrame.width = timeFramePosition;
                timeFrame.originalSize = {left: timeFrame.left, width: timeFrame.width};
            });

            if (self.timeFramesNonWorkingMode === 'cropped' || self.timeFramesWorkingMode === 'cropped') {
                var timeFramesWidth = 0;
                angular.forEach(self.timeFrames, function(timeFrame) {
                    if (!timeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' ||
                        timeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                        timeFramesWidth += timeFrame.width;
                    }
                });

                if (timeFramesWidth !== self.width) {
                    var croppedRatio = self.width / timeFramesWidth;
                    var croppedWidth = 0;
                    var originalCroppedWidth = 0;

                    var allCropped = true;

                    angular.forEach(self.timeFrames, function(timeFrame) {
                        if (!timeFrame.working && self.timeFramesNonWorkingMode !== 'cropped' ||
                            timeFrame.working && self.timeFramesWorkingMode !== 'cropped') {
                            timeFrame.left = (timeFrame.left - croppedWidth) * croppedRatio;
                            timeFrame.width = timeFrame.width * croppedRatio;
                            timeFrame.originalSize.left = (timeFrame.originalSize.left - originalCroppedWidth) * croppedRatio;
                            timeFrame.originalSize.width = timeFrame.originalSize.width * croppedRatio;
                            timeFrame.cropped = false;
                            allCropped = false;
                        } else {
                            croppedWidth += timeFrame.width;
                            originalCroppedWidth += timeFrame.originalSize.width;
                            timeFrame.left = undefined;
                            timeFrame.width = 0;
                            timeFrame.originalSize = {left: undefined, width: 0};
                            timeFrame.cropped = true;
                        }
                    });

                    self.cropped = allCropped;
                } else {
                    self.cropped = false;
                }
            }
        }
    };

    Column.prototype.clone = function() {
        return new Column(moment(this.date), moment(this.endDate), this.left, this.width, this.calendar);
    };

    Column.prototype.containsDate = function(date) {
        return date > this.date && date <= this.endDate;
    };

    Column.prototype.equals = function(other) {
        return this.date === other.date;
    };

    Column.prototype.getMagnetDate = function(date) {
        if (this.columnMagnetValue > 0 && this.columnMagnetUnit !== undefined) {
            date = moment(date);
            var value = date.get(this.columnMagnetUnit);
            var magnetValue = Math.round(value/this.columnMagnetValue) * this.columnMagnetValue;
            date.startOf(this.columnMagnetUnit);
            date.set(this.columnMagnetUnit, magnetValue);
            return date;
        }
        return date;
    };

    var getDateByPositionUsingTimeFrames = function(timeFrames, position) {
        for (var i=0; i < timeFrames.length; i++) {
            // TODO: performance optimization could be done.
            var timeFrame = timeFrames[i];
            if (!timeFrame.cropped && position >= timeFrame.left && position <= timeFrame.left + timeFrame.width) {
                var positionDuration = timeFrame.getDuration() / timeFrame.width * (position - timeFrame.left);
                var date = moment(timeFrame.start).add(positionDuration, 'milliseconds');
                return date;
            }
        }
    };

    Column.prototype.getDateByPosition = function(position, magnet) {
        var positionDuration;
        var date;

        if (position < 0) {
            position = 0;
        }
        if (position > this.width) {
            position = this.width;
        }

        if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
            date = getDateByPositionUsingTimeFrames(this.timeFrames, position);
        }

        if (date === undefined) {
            positionDuration = this.duration / this.width * position;
            date = moment(this.date).add(positionDuration, 'milliseconds');
        }

        if (magnet) {
            return this.getMagnetDate(date);
        }

        return date;
    };

    Column.prototype.getDayTimeFrame = function(date) {
        var dtf = this.daysTimeFrames[getDateKey(date)];
        if (dtf === undefined) {
            return [];
        }
        return dtf;
    };

    Column.prototype.getPositionByDate = function(date) {
        var positionDuration;
        var position;

        if (this.timeFramesNonWorkingMode === 'cropped' || this.timeFramesWorkingMode === 'cropped') {
            var croppedDate = date;
            var timeFrames = this.getDayTimeFrame(croppedDate);
            for (var i=0; i < timeFrames.length; i++) {
                var timeFrame = timeFrames[i];
                if (croppedDate >= timeFrame.start && croppedDate <= timeFrame.end) {
                    if (timeFrame.cropped) {
                        if (timeFrames.length > i+1) {
                            croppedDate = timeFrames[i+1].start;
                        } else {
                            croppedDate = timeFrame.end;
                        }
                    } else {
                        positionDuration = croppedDate.diff(timeFrame.start, 'milliseconds');
                        position = positionDuration / timeFrame.getDuration() * timeFrame.width;
                        return this.left + timeFrame.left + position;
                    }
                }
            }
        }

        positionDuration = date.diff(this.date, 'milliseconds');
        position = positionDuration / this.duration * this.width;

        if (position < 0) {
            position = 0;
        }

        if (position > this.width) {
            position = this.width;
        }

        return this.left + position;
    };

    return Column;
}]);


gantt.factory('GanttColumnGenerator', [ 'GanttColumn', 'moment', function(Column, moment) {
    var ColumnGenerator = function(columnsManager) {
        var self = this;

        var columnWidth = columnsManager.gantt.$scope.columnWidth;
        if (columnWidth === undefined) {
            columnWidth = 20;
        }
        var unit = columnsManager.gantt.$scope.viewScale;
        var calendar = columnsManager.gantt.$scope.calendar;
        var timeFramesWorkingMode = columnsManager.gantt.$scope.timeFramesWorkingMode;
        var timeFramesNonWorkingMode = columnsManager.gantt.$scope.timeFramesNonWorkingMode;

        var columnMagnetValue;
        var columnMagnetUnit;

        if (columnsManager.gantt.$scope.columnMagnet) {
            var splittedColumnMagnet = columnsManager.gantt.$scope.columnMagnet.trim().split(' ');
            if (splittedColumnMagnet.length > 1) {
                columnMagnetValue = parseInt(splittedColumnMagnet[0]);
                columnMagnetUnit = splittedColumnMagnet[splittedColumnMagnet.length-1];
            }
        }

        // Generates one column for each time unit between the given from and to date.
        self.generate = function(from, to, maximumWidth, leftOffset, reverse) {
            if (!to && !maximumWidth) {
                throw 'to or maximumWidth must be defined';
            }

            var excludeTo = false;
            from = moment(from).startOf(unit);
            if (to) {
                excludeTo = isToDateToExclude(to);
                to = moment(to).startOf(unit);
            }

            var date = moment(from).startOf(unit);
            var generatedCols = [];
            var left = 0;

            while (true) {
                if (maximumWidth && Math.abs(left) > maximumWidth + columnWidth) {
                    break;
                }

                var startDate = moment(date);
                var endDate = moment(startDate).add(1, unit);

                var column = new Column(startDate, endDate, leftOffset ? left + leftOffset : left, columnWidth, calendar, timeFramesWorkingMode, timeFramesNonWorkingMode, columnMagnetValue, columnMagnetUnit);
                if (!column.cropped) {
                    generatedCols.push(column);
                    if (reverse) {
                        left -= columnWidth;
                    } else {
                        left += columnWidth;
                    }

                    if (to) {
                        if (reverse) {
                            if (excludeTo && date < to || !excludeTo && date <= to) {
                                break;
                            }
                        } else {
                            if (excludeTo && date > to || !excludeTo && date >= to) {
                                break;
                            }
                        }
                    }
                }
                date.add(reverse ? -1 : 1, unit);
            }

            if (reverse) {
                if (isToDateToExclude(from)) {
                    generatedCols.shift();
                }
                generatedCols.reverse();
            }

            return generatedCols;
        };

        // Columns are generated including or excluding the to date.
        // If the To date is the first day of month and the time is 00:00 then no new column is generated for this month.

        var isToDateToExclude = function(to) {
            return moment(to).add(1, unit).startOf(unit) === to;
        };
    };
    return ColumnGenerator;
}]);


gantt.factory('GanttColumnHeader', [ 'moment', 'GanttColumn', function(moment, Column) {
    // Used to display the Gantt grid and header.
    // The columns are generated by the column generator.

    var ColumnHeader = function(date, unit, left, width, label) {
        var startDate = moment(date);
        var endDate = moment(startDate).add(1, unit);

        var column = new Column(startDate, endDate, left, width);
        column.unit = unit;
        column.label = label;

        return column;
    };
    return ColumnHeader;
}]);


gantt.factory('GanttColumnsManager', ['GanttColumnGenerator', 'GanttHeaderGenerator', '$filter', 'ganttLayout', 'ganttBinarySearch', function(ColumnGenerator, HeaderGenerator, $filter, layout, bs) {
    var ColumnsManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.headerGenerator = undefined;
        this.columnGenerator = undefined;

        this.from = undefined;
        this.to = undefined;

        this.columns = [];
        this.visibleColumns = [];
        this.previousColumns = [];
        this.nextColumns = [];

        this.headers = {};
        this.visibleHeaders = {};

        // Add a watcher if a view related setting changed from outside of the Gantt. Update the gantt accordingly if so.
        // All those changes need a recalculation of the header columns
        this.gantt.$scope.$watch('viewScale+width+labelsWidth+columnWidth+timeFramesWorkingMode+timeFramesNonWorkingMode+columnMagnet', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.buildGenerator();
                self.clearColumns();
                self.updateColumns();
            }
        });

        this.gantt.$scope.$watch('fromDate+toDate+autoExpand+taskOutOfRange', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateColumns();
            }
        });

        this.gantt.$scope.$watch('ganttElementWidth+labelsWidth+showLabelsColumn+maxHeight', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateColumnsMeta();
            }
        });

        this.gantt.$scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleColumns();
            }
        });

        this.scrollAnchor = undefined;

        this.buildGenerator();
        this.clearColumns();
        this.updateColumns();
        this.updateVisibleColumns();
    };

    ColumnsManager.prototype.setScrollAnchor = function() {
        if (this.gantt.scroll.$element && this.columns.length > 0) {
            var el = this.gantt.scroll.$element[0];
            var center = el.scrollLeft + el.offsetWidth / 2;

            this.scrollAnchor = this.gantt.getDateByPosition(center);
        }
    };

    ColumnsManager.prototype.buildGenerator = function() {
        this.columnGenerator = new ColumnGenerator(this);
        this.headerGenerator = new HeaderGenerator(this);
    };

    ColumnsManager.prototype.clearColumns = function() {
        this.setScrollAnchor();

        this.from = undefined;
        this.to = undefined;

        this.columns = [];
        this.visibleColumns = [];
        this.previousColumns = [];
        this.nextColumns = [];

        this.headers = [];
        this.visibleHeaders = {};
    };

    ColumnsManager.prototype.updateColumns = function() {
        var from = this.gantt.$scope.fromDate;
        var to = this.gantt.$scope.toDate;
        if (this.gantt.$scope.taskOutOfRange === 'expand') {
            from = this.gantt.rowsManager.getExpandedFrom(from);
            to = this.gantt.rowsManager.getExpandedTo(to);
        }
        this.generateColumns(from, to);
    };

    ColumnsManager.prototype.generateColumns = function(from, to) {
        if (!from) {
            from = this.gantt.rowsManager.getDefaultFrom();
            if (!from) {
                return false;
            }
        }

        if (!to) {
            to = this.gantt.rowsManager.getDefaultTo();
            if (!to) {
                return false;
            }
        }

        if (this.from === from && this.to === to) {
            return false;
        }

        this.setScrollAnchor();

        this.from = from;
        this.to = to;

        this.columns = this.columnGenerator.generate(from, to);
        this.headers = this.headerGenerator.generate(this.columns);
        this.previousColumns = [];
        this.nextColumns = [];

        this.updateColumnsMeta();

        return true;
    };

    ColumnsManager.prototype.updateColumnsMeta = function() {
        var lastColumn = this.getLastColumn();
        this.gantt.originalWidth = lastColumn !== undefined ? lastColumn.originalSize.left + lastColumn.originalSize.width : 0;

        if (this.gantt.$scope.columnWidth === undefined) {
            var newWidth = this.gantt.$scope.ganttElementWidth - (this.gantt.$scope.showLabelsColumn ? this.gantt.$scope.labelsWidth : 0);

            if (this.gantt.$scope.maxHeight > 0) {
                newWidth = newWidth - layout.getScrollBarWidth();
            }

            layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.previousColumns);
            layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.columns);
            layout.setColumnsWidth(newWidth, this.gantt.originalWidth, this.nextColumns);

            angular.forEach(this.headers, function(header) {
                layout.setColumnsWidth(newWidth, this.gantt.originalWidth, header);
            }, this);
        }

        this.gantt.width = lastColumn !== undefined ? lastColumn.left + lastColumn.width : 0;

        this.gantt.rowsManager.updateTasksPosAndSize();
        this.gantt.timespansManager.updateTimespansPosAndSize();

        this.updateVisibleColumns();
        this.gantt.rowsManager.updateVisibleObjects();

        this.gantt.currentDateManager.setCurrentDate(this.gantt.$scope.currentDateValue);
    };

    // Returns the last Gantt column or undefined
    ColumnsManager.prototype.getLastColumn = function(extended) {
        var columns = this.columns;
        if (extended) {
            columns = this.nextColumns;
        }
        if (columns && columns.length > 0) {
            return columns[columns.length - 1];
        } else {
            return undefined;
        }
    };

    // Returns the first Gantt column or undefined
    ColumnsManager.prototype.getFirstColumn = function(extended) {
        var columns = this.columns;
        if (extended) {
            columns = this.previousColumns;
        }

        if (columns && columns.length > 0) {
            return columns[0];
        } else {
            return undefined;
        }
    };

    // Returns the column at the given or next possible date
    ColumnsManager.prototype.getColumnByDate = function(date) {
        this.expandExtendedColumnsForDate(date);
        var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
        var columns = bs.get(extendedColumns, date, function(c) {
            return c.date;
        });
        return columns[0] !== undefined ? columns[0] : columns[1];
    };

    // Returns the column at the given position x (in em)
    ColumnsManager.prototype.getColumnByPosition = function(x) {
        this.expandExtendedColumnsForPosition(x);
        var extendedColumns = this.previousColumns.concat(this.columns, this.nextColumns);
        return bs.get(extendedColumns, x, function(c) {
            return c.left;
        })[0];
    };

    ColumnsManager.prototype.expandExtendedColumnsForPosition = function(x) {
        if (x < 0) {
            var firstColumn = this.getFirstColumn();
            var from = firstColumn.date;
            var firstExtendedColumn = this.getFirstColumn(true);
            if (!firstExtendedColumn || firstExtendedColumn.left > x) {
                this.previousColumns = this.columnGenerator.generate(from, undefined, -x, 0, true);
            }
            return true;
        } else if (x > this.width) {
            var lastColumn = this.getLastColumn();
            var endDate = lastColumn.getDateByPosition(lastColumn.width);
            var lastExtendedColumn = this.getLastColumn(true);
            if (!lastExtendedColumn || lastExtendedColumn.left + lastExtendedColumn.width < x) {
                this.nextColumns = this.columnGenerator.generate(endDate, undefined, x - this.width, this.width, false);
            }
            return true;
        }
        return false;
    };

    ColumnsManager.prototype.expandExtendedColumnsForDate = function(date) {
        var firstColumn = this.getFirstColumn();
        var from;
        if (firstColumn) {
            from = firstColumn.date;
        }

        var lastColumn = this.getLastColumn();
        var endDate;
        if (lastColumn) {
            endDate = lastColumn.getDateByPosition(lastColumn.width);
        }

        if (from && date < from) {
            var firstExtendedColumn = this.getFirstColumn(true);
            if (!firstExtendedColumn || firstExtendedColumn.date > date) {
                this.previousColumns = this.columnGenerator.generate(from, date, undefined, 0, true);
            }
            return true;
        } else if (endDate && date > endDate) {
            var lastExtendedColumn = this.getLastColumn(true);
            if (!lastExtendedColumn || endDate < lastExtendedColumn) {
                this.nextColumns = this.columnGenerator.generate(endDate, date, undefined, this.width, false);
            }
            return true;
        }
        return false;
    };

    // Returns the number of active headers
    ColumnsManager.prototype.getActiveHeadersCount = function() {
        var size = 0, key;
        for (key in this.headers) {
            if (this.headers.hasOwnProperty(key)) {
                size++;
            }
        }
        return size;
    };

    ColumnsManager.prototype.updateVisibleColumns = function() {
        this.visibleColumns = $filter('ganttColumnLimit')(this.columns, this.gantt.$scope.scrollLeft, this.gantt.$scope.scrollWidth);

        angular.forEach(this.headers, function(headers, key) {
            if (this.headers.hasOwnProperty(key)) {
                this.visibleHeaders[key] = $filter('ganttColumnLimit')(headers, this.gantt.$scope.scrollLeft, this.gantt.$scope.scrollWidth);
            }
        }, this);
    };

    var defaultHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q YYYY', month: 'MMMM YYYY', week: 'w', day: 'D', hour: 'H', minute:'HH:mm'};
    var defaultDayHeadersFormats = {day: 'LL', hour: 'H', minute:'HH:mm'};
    var defaultYearHeadersFormats = {'year': 'YYYY', 'quarter': '[Q]Q', month: 'MMMM'};

    ColumnsManager.prototype.getHeaderFormat = function(unit) {
        var format;
        if (this.gantt.$scope.headersFormats !== undefined) {
            format = this.gantt.$scope.headersFormats[unit];
        }
        if (format === undefined) {
            if (['millisecond', 'second', 'minute', 'hour'].indexOf(this.gantt.$scope.viewScale) > -1) {
                format = defaultDayHeadersFormats[unit];
            } else if (['month', 'quarter', 'year'].indexOf(this.gantt.$scope.viewScale) > -1) {
                format = defaultYearHeadersFormats[unit];
            }
            if (format === undefined) {
                format = defaultHeadersFormats[unit];
            }
        }
        return format;
    };

    return ColumnsManager;
}]);


gantt.factory('GanttHeaderGenerator', ['GanttColumnHeader', function(ColumnHeader) {
    var generateHeader = function(columnsManager, columns, unit) {
        var generatedHeaders = [];
        var header;
        for (var i = 0, l = columns.length; i < l; i++) {
            var col = columns[i];
            if (i === 0 || columns[i - 1].date.get(unit) !== col.date.get(unit)) {
                var label = col.date.format(columnsManager.getHeaderFormat(unit));
                header = new ColumnHeader(col.date, unit, col.originalSize.left, col.originalSize.width, label);
                header.left = col.left;
                header.width = col.width;
                generatedHeaders.push(header);
            } else {
                header.originalSize.width += col.originalSize.width;
                header.width += col.width;
            }
        }
        return generatedHeaders;
    };

    return function(columnsManager) {
        this.generate = function(columns) {
            var units = [];
            if (columnsManager.gantt.$scope.headers === undefined) {
                units = [];
                if (['year', 'quarter', 'month'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('year');
                }
                if (['quarter'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('quarter');
                }
                if (['day', 'week', 'month'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('month');
                }
                if (['day', 'week'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('week');
                }
                if (['hour', 'day'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('day');
                }
                if (['hour', 'minute', 'second'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('hour');
                }
                if (['minute', 'second'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('minute');
                }
                if (['second'].indexOf(columnsManager.gantt.$scope.viewScale) > -1) {
                    units.push('second');
                }
                if (units.length === 0) {
                    units.push(columnsManager.gantt.$scope.viewScale);
                }
            } else {
                units = columnsManager.gantt.$scope.headers;
            }

            var headers = [];
            angular.forEach(units, function(unit) {
                headers.push(generateHeader(columnsManager, columns, unit));
            });

            return headers;
        };
    };
}]);


gantt.service('GanttEvents', ['ganttMouseOffset', function(mouseOffset) {
    return {
        buildTaskEventData: function(evt, element, task, gantt) {
            var data = {evt:evt, element:element, task:task};
            if (gantt !== undefined && evt !== undefined) {
                var x = mouseOffset.getOffset(evt).x;
                data.column = gantt.columnsManager.getColumnByPosition(x + task.left);
                data.date = gantt.getDateByPosition(x + task.left);
            }
            return data;
        },

        buildRowEventData: function(evt, element, row, gantt) {
            var data = {evt:evt, element:element, row:row};
            if (gantt !== undefined && evt !== undefined) {
                var x = mouseOffset.getOffset(evt).x;
                data.column = gantt.columnsManager.getColumnByPosition(x);
                data.date = gantt.getDateByPosition(x);
            }
            return data;
        },

        buildColumnEventData: function(evt, element, column) {
            var data = {evt:evt, element:element, column:column};
            return data;
        }
    };


}]);


gantt.factory('Gantt', [
    'GanttScroll', 'GanttBody', 'GanttHeader', 'GanttLabels', 'GanttRowsManager', 'GanttColumnsManager', 'GanttTimespansManager', 'GanttCurrentDateManager', 'GANTT_EVENTS',
    function(Scroll, Body, Header, Labels, RowsManager, ColumnsManager, TimespansManager, CurrentDateManager, GANTT_EVENTS) {
        // Gantt logic. Manages the columns, rows and sorting functionality.
        var Gantt = function($scope, $element) {
            var self = this;

            this.$scope = $scope;
            this.$element = $element;

            this.scroll = new Scroll(this);
            this.body = new Body(this);
            this.header = new Header(this);
            this.labels = new Labels(this);

            this.rowsManager = new RowsManager(this);
            this.columnsManager = new ColumnsManager(this);
            this.timespansManager = new TimespansManager(this);
            this.currentDateManager = new CurrentDateManager(this);

            this.originalWidth = 0;
            this.width = 0;

            this.$scope.$watch('data', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    self.clearData();
                    self.loadData(newValue);
                }
            });
        };

        // Returns the exact column date at the given position x (in em)
        Gantt.prototype.getDateByPosition = function(x, magnet) {
            var column = this.columnsManager.getColumnByPosition(x);
            if (column !== undefined) {
                return column.getDateByPosition(x - column.left, magnet);
            } else {
                return undefined;
            }
        };

        // Returns the position inside the Gantt calculated by the given date
        Gantt.prototype.getPositionByDate = function(date) {
            if (date === undefined) {
                return undefined;
            }

            if (!moment.isMoment(moment)) {
                date = moment(date);
            }

            var column = this.columnsManager.getColumnByDate(date);
            if (column !== undefined) {
                return column.getPositionByDate(date);
            } else {
                return undefined;
            }
        };

        // Adds or update rows and tasks.
        Gantt.prototype.loadData = function(data) {
            for (var i = 0, l = data.length; i < l; i++) {
                var rowData = data[i];
                this.rowsManager.addRow(rowData);
            }

            this.columnsManager.updateColumns();
            this.rowsManager.updateTasksPosAndSize();
            this.rowsManager.updateVisibleObjects();
            this.rowsManager.sortRows();
        };

        // Removes specified rows or tasks.
        // If a row has no tasks inside the complete row will be deleted.
        Gantt.prototype.removeData = function(data) {
            this.rowsManager.removeData(data);
            this.columnsManager.updateColumns();
            this.rowsManager.sortRows();
        };

        // Removes all rows and tasks
        Gantt.prototype.clearData = function() {
            this.rowsManager.removeAll();
            this.columnsManager.clearColumns();
        };

        // Removes all timespans
        Gantt.prototype.clearTimespans = function() {
            this.timespansManager.removeAllTimespans();
        };

        // Swaps two rows and changes the sort order to custom to display the swapped rows
        Gantt.prototype.swapRows = function(a, b) {
            // Swap the two rows
            var order = a.order;
            a.order = b.order;
            b.order = order;

            // Raise change events
            this.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': a});
            this.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': a});
            this.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': b});
            this.$scope.$emit(GANTT_EVENTS.ROW_ORDER_CHANGED, {'row': b});

            // Switch to custom sort mode and trigger sort
            if (this.$scope.sortMode !== 'custom') {
                this.$scope.sortMode = 'custom'; // Sort will be triggered by the watcher
            } else {
                this.rowsManager.sortRows();
            }
        };

        // Sort rows by the specified sort mode (name, order, custom)
        // and by Ascending or Descending
        Gantt.prototype.sortRows = function() {
            this.rowsManager.sortRows();
        };

        // Adds or updates timespans
        Gantt.prototype.loadTimespans = function(timespans) {
            this.timespansManager.loadTimespans(timespans);
        };

        return Gantt;
    }]);


gantt.factory('GanttRow', ['GanttTask', 'moment', '$filter', 'GANTT_EVENTS', function(Task, moment, $filter, GANTT_EVENTS) {
    var Row = function(id, rowsManager, name, order, height, color, classes, data) {
        this.id = id;
        this.rowsManager = rowsManager;
        this.name = name;
        this.order = order;
        this.height = height;
        this.color = color;
        this.classes = classes;
        this.from = undefined;
        this.to = undefined;
        this.tasksMap = {};
        this.tasks = [];
        this.filteredTasks = [];
        this.visibleTasks = [];
        this.data = data;
    };

    // Adds a task to a specific row. Merges the task if there is already one with the same id
    Row.prototype.addTask = function(taskData) {
        // Copy to new task (add) or merge with existing (update)
        var task;

        if (taskData.id in this.tasksMap) {
            task = this.tasksMap[taskData.id];
            task.copy(taskData);
        } else {
            task = new Task(taskData.id, this, taskData.name, taskData.color, taskData.classes, taskData.priority, taskData.from, taskData.to, taskData.data, taskData.est, taskData.lct, taskData.progress);
            this.tasksMap[taskData.id] = task;
            this.tasks.push(task);
            this.filteredTasks.push(task);
            this.visibleTasks.push(task);
        }

        this.sortTasks();
        this.setFromToByTask(task);
        this.rowsManager.gantt.$scope.$emit(GANTT_EVENTS.TASK_ADDED, {'task': task});
        return task;
    };

    // Removes the task from the existing row and adds it to he current one
    Row.prototype.moveTaskToRow = function(task) {
        var oldRow = task.row;
        oldRow.removeTask(task.id, true);
        oldRow.updateVisibleTasks();

        this.tasksMap[task.id] = task;
        this.tasks.push(task);
        this.filteredTasks.push(task);
        this.visibleTasks.push(task);
        task.row = this;

        this.sortTasks();
        this.setFromToByTask(task);

        task.updatePosAndSize();
        this.updateVisibleTasks();

        this.rowsManager.gantt.$scope.$emit(GANTT_EVENTS.TASK_MOVED, {'oldRow': oldRow, 'task': task});

    };

    Row.prototype.updateVisibleTasks = function() {
        if (this.rowsManager.gantt.$scope.filterTask) {
            this.filteredTasks = $filter('filter')(this.tasks, this.rowsManager.gantt.$scope.filterTask, this.rowsManager.gantt.$scope.filterTaskComparator);
        } else {
            this.filteredTasks = this.tasks.slice(0);
        }
        this.visibleTasks = $filter('ganttTaskLimit')(this.filteredTasks, this.rowsManager.gantt);
    };

    Row.prototype.updateTasksPosAndSize = function() {
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.tasks[j].updatePosAndSize();
        }
    };

    // Remove the specified task from the row
    Row.prototype.removeTask = function(taskId, disableEmit) {
        if (taskId in this.tasksMap) {
            delete this.tasksMap[taskId]; // Remove from map

            var task;
            var removedTask;
            for (var i = this.tasks.length - 1; i >= 0; i--) {
                task = this.tasks[i];
                if (task.id === taskId) {
                    removedTask = task;
                    this.tasks.splice(i, 1); // Remove from array

                    // Update earliest or latest date info as this may change
                    if (this.from - task.from === 0 || this.to - task.to === 0) {
                        this.setFromTo();
                    }
                }
            }

            for (i = this.filteredTasks.length - 1; i >= 0; i--) {
                task = this.filteredTasks[i];
                if (task.id === taskId) {
                    this.filteredTasks.splice(i, 1); // Remove from filtered array
                }
            }

            for (i = this.visibleTasks.length - 1; i >= 0; i--) {
                task = this.visibleTasks[i];
                if (task.id === taskId) {
                    this.visibleTasks.splice(i, 1); // Remove from visible array
                }
            }

            if (!disableEmit) {
                this.rowsManager.gantt.$scope.$emit(GANTT_EVENTS.TASK_REMOVED, {'task': removedTask});
            }

            return removedTask;
        }
    };

    // Calculate the earliest from and latest to date of all tasks in a row
    Row.prototype.setFromTo = function() {
        this.from = undefined;
        this.to = undefined;
        for (var j = 0, k = this.tasks.length; j < k; j++) {
            this.setFromToByTask(this.tasks[j]);
        }
    };

    Row.prototype.setFromToByTask = function(task) {
        if (this.from === undefined) {
            this.from = moment(task.from);
        } else if (task.from < this.from) {
            this.from = moment(task.from);
        }

        if (this.to === undefined) {
            this.to = moment(task.to);
        } else if (task.to > this.to) {
            this.to = moment(task.to);
        }
    };

    Row.prototype.sortTasks = function() {
        this.tasks.sort(function(t1, t2) {
            return t1.left - t2.left;
        });
    };

    Row.prototype.copy = function(row) {
        this.name = row.name;
        this.height = row.height;
        this.color = row.color;
        this.classes = row.classes;
        this.data = row.data;

        if (row.order !== undefined) {
            this.order = row.order;
        }
    };

    Row.prototype.clone = function() {
        var clone = new Row(this.id, this.rowsManager, this.name, this.order, this.height, this.color, this.classes, this.data);
        for (var i = 0, l = this.tasks.length; i < l; i++) {
            clone.addTask(this.tasks[i].clone());
        }
        return clone;
    };

    return Row;
}]);


gantt.factory('GanttRowsManager', ['GanttRow', '$filter', 'moment', 'GANTT_EVENTS', function(Row, $filter, moment, GANTT_EVENTS) {
    var RowsManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.rowsMap = {};
        this.rows = [];
        this.filteredRows = [];
        this.visibleRows = [];

        this.gantt.$scope.$watch('scrollLeft+scrollWidth', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

        this.gantt.$scope.$watch('filterTask+filterTaskComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleTasks();
            }
        });

       this.gantt.$scope.$watch('filterRow+filterRowComparator', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.updateVisibleRows();
            }
        });

        this.gantt.$scope.$watch('sortMode', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.sortRows();
            }
        });

        this.updateVisibleObjects();
    };

    RowsManager.prototype.addRow = function(rowData) {
        // Copy to new row (add) or merge with existing (update)
        var row, isUpdate = false;

        if (rowData.id in this.rowsMap) {
            row = this.rowsMap[rowData.id];
            row.copy(rowData);
            isUpdate = true;
            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
        } else {
            var order = rowData.order;

            // Check if the row has a order predefined. If not assign one
            if (order === undefined) {
                order = this.highestRowOrder;
            }

            if (order >= this.highestRowOrder) {
                this.highestRowOrder = order + 1;
            }

            row = new Row(rowData.id, this, rowData.name, order, rowData.height, rowData.color, rowData.classes, rowData.data);
            this.rowsMap[rowData.id] = row;
            this.rows.push(row);
            this.filteredRows.push(row);
            this.visibleRows.push(row);
            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_ADDED, {'row': row});
        }

        if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
            for (var i = 0, l = rowData.tasks.length; i < l; i++) {
                row.addTask(rowData.tasks[i]);
            }
        }
        return isUpdate;
    };

    RowsManager.prototype.removeRow = function(rowId) {
        if (rowId in this.rowsMap) {
            delete this.rowsMap[rowId]; // Remove from map

            var removedRow;
            var row;
            for (var i = this.rows.length - 1; i >= 0; i--) {
                row = this.rows[i];
                if (row.id === rowId) {
                    removedRow = row;
                    this.rows.splice(i, 1); // Remove from array
                }
            }

            for (i = this.filteredRows.length - 1; i >= 0; i--) {
                row = this.filteredRows[i];
                if (row.id === rowId) {
                    this.filteredRows.splice(i, 1); // Remove from filtered array
                }
            }

            for (i = this.visibleRows.length - 1; i >= 0; i--) {
                row = this.visibleRows[i];
                if (row.id === rowId) {
                    this.visibleRows.splice(i, 1); // Remove from visible array
                }
            }

            this.gantt.$scope.$emit(GANTT_EVENTS.ROW_REMOVED, {'row': removedRow});
            return row;
        }

        return undefined;
    };

    RowsManager.prototype.removeData = function(data) {
        for (var i = 0, l = data.length; i < l; i++) {
            var rowData = data[i];
            var row;

            if (rowData.tasks !== undefined && rowData.tasks.length > 0) {
                // Only delete the specified tasks but not the row and the other tasks

                if (rowData.id in this.rowsMap) {
                    row = this.rowsMap[rowData.id];

                    for (var j = 0, k = rowData.tasks.length; j < k; j++) {
                        row.removeTask(rowData.tasks[j].id);
                    }

                    this.gantt.$scope.$emit(GANTT_EVENTS.ROW_CHANGED, {'row': row});
                }
            } else {
                // Delete the complete row
                row = this.removeRow(rowData.id);
            }
        }
        this.updateVisibleObjects();
    };

    RowsManager.prototype.removeAll = function() {
        this.rowsMap = {};
        this.rows = [];
        this.filteredRows = [];
        this.visibleRows = [];
    };

    RowsManager.prototype.sortRows = function() {
        var expression = this.gantt.$scope.sortMode;

        var reverse = false;
        if (expression.charAt(0) === '-') {
            reverse = true;
            expression = expression.substr(1);
        }

        var angularOrderBy = $filter('orderBy');
        if (expression === 'custom') {
            this.rows = angularOrderBy(this.rows, 'order', reverse);
        } else {
            this.rows = angularOrderBy(this.rows, expression, reverse);
        }

        this.updateVisibleRows();
    };

    RowsManager.prototype.updateVisibleObjects = function() {
        this.updateVisibleRows();
        this.updateVisibleTasks();
    };

    RowsManager.prototype.updateVisibleRows = function() {
        var oldFilteredRows = this.filteredRows;
        if (this.gantt.$scope.filterRow) {
            this.filteredRows = $filter('filter')(this.rows, this.gantt.$scope.filterRow, this.gantt.$scope.filterRowComparator);
        } else {
            this.filteredRows = this.rows.slice(0);
        }

        var filterEventData;
        if (!angular.equals(oldFilteredRows, this.filteredRows)) {
            filterEventData = {rows: this.rows, filteredRows: this.filteredRows};
        }

        // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
        this.visibleRows = this.filteredRows;
        if (filterEventData !== undefined) {
            this.gantt.$scope.$emit(GANTT_EVENTS.ROWS_FILTERED, filterEventData);
        }
    };

    RowsManager.prototype.updateVisibleTasks = function() {
        var oldFilteredTasks = [];
        var filteredTasks = [];
        var tasks = [];

        angular.forEach(this.filteredRows, function(row) {
            oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks);
            row.updateVisibleTasks();
            filteredTasks = filteredTasks.concat(row.filteredTasks);
            tasks = tasks.concat(row.tasks);
        });

        var filterEventData;
        if (!angular.equals(oldFilteredTasks, filteredTasks)) {
            filterEventData = {tasks: tasks, filteredTasks: filteredTasks};
        }

        if (filterEventData !== undefined) {
            this.gantt.$scope.$emit(GANTT_EVENTS.TASKS_FILTERED, filterEventData);
        }
    };

    // Update the position/size of all tasks in the Gantt
    RowsManager.prototype.updateTasksPosAndSize = function() {
        for (var i = 0, l = this.rows.length; i < l; i++) {
            this.rows[i].updateTasksPosAndSize();
        }
    };

    RowsManager.prototype.getExpandedFrom = function(from) {
        from = from ? moment(from) : from;

        var minRowFrom = from;
        angular.forEach(this.rows, function(row) {
            if (minRowFrom === undefined || minRowFrom > row.from) {
                minRowFrom = row.from;
            }
        });
        if (minRowFrom && (!from || minRowFrom < from)) {
            return minRowFrom;
        }
        return from;
    };

    RowsManager.prototype.getExpandedTo = function(to) {
        to = to ? moment(to) : to;

        var maxRowTo = to;
        angular.forEach(this.rows, function(row) {
            if (maxRowTo === undefined || maxRowTo < row.to) {
                maxRowTo = row.to;
            }
        });
        if (maxRowTo && (!this.gantt.$scope.toDate || maxRowTo > this.gantt.$scope.toDate)) {
            return maxRowTo;
        }
        return to;
    };

    RowsManager.prototype.getDefaultFrom = function() {
        var defaultFrom;
        angular.forEach(this.rows, function(row) {
            if (defaultFrom === undefined || row.from < defaultFrom) {
                defaultFrom = row.from;
            }
        });
        return defaultFrom;
    };

    RowsManager.prototype.getDefaultTo = function() {
        var defaultTo;
        angular.forEach(this.rows, function(row) {
            if (defaultTo === undefined || row.to > defaultTo) {
                defaultTo = row.to;
            }
        });
        return defaultTo;
    };

    return RowsManager;
}]);


gantt.factory('GanttTask', ['moment', 'GanttTaskProgress', function(moment, TaskProgress) {
    var Task = function(id, row, name, color, classes, priority, from, to, data, est, lct, progress) {
        this.id = id;
        this.rowsManager = row.rowsManager;
        this.row = row;
        this.name = name;
        this.color = color;
        this.classes = classes;
        this.priority = priority;
        this.from = moment(from);
        this.to = moment(to);
        this.truncatedLeft = false;
        this.truncatedRight = false;
        this.data = data;

        if (progress !== undefined) {
            if (typeof progress === 'object') {
                this.progress = new TaskProgress(this, progress.percent, progress.color, progress.classes);
            } else {
                this.progress = new TaskProgress(this, progress);
            }
        }

        if (est !== undefined && lct !== undefined) {
            this.est = moment(est);  //Earliest Start Time
            this.lct = moment(lct);  //Latest Completion Time
        }

        this._fromLabel = undefined;
        this._toLabel = undefined;
    };


    Task.prototype.getFromLabel = function() {
        if (this._fromLabel === undefined) {
            this._fromLabel = this.from.format(this.rowsManager.gantt.$scope.tooltipDateFormat);
        }
        return this._fromLabel;
    };

    Task.prototype.getToLabel = function() {
        if (this._toLabel === undefined) {
            this._toLabel = this.to.format(this.rowsManager.gantt.$scope.tooltipDateFormat);
        }
        return this._toLabel;
    };

    Task.prototype.checkIfMilestone = function() {
        this.isMilestone = this.from - this.to === 0;
    };

    Task.prototype.checkIfMilestone();

    Task.prototype.hasBounds = function() {
        return this.bounds !== undefined;
    };

    // Updates the pos and size of the task according to the from - to date
    Task.prototype.updatePosAndSize = function() {
        this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.from);
        this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.to) - this.modelLeft;

        this.outOfRange = this.modelLeft + this.modelWidth < 0 || this.modelLeft > this.rowsManager.gantt.width;

        this.left = Math.min(Math.max(this.modelLeft, 0), this.rowsManager.gantt.width);
        if (this.modelLeft < 0) {
            this.truncatedLeft = true;
            if (this.modelWidth + this.modelLeft > this.rowsManager.gantt.width) {
                this.truncatedRight = true;
                this.width = this.rowsManager.gantt.width;
            } else {
                this.truncatedRight = false;
                this.width = this.modelWidth + this.modelLeft;
            }
        } else if (this.modelWidth + this.modelLeft > this.rowsManager.gantt.width) {
            this.truncatedRight = true;
            this.truncatedLeft = false;
            this.width = this.rowsManager.gantt.width - this.modelLeft;
        } else {
            this.truncatedLeft = false;
            this.truncatedRight = false;
            this.width = this.modelWidth;
        }

        if (this.est !== undefined && this.lct !== undefined) {
            this.bounds = {};
            this.bounds.left = this.rowsManager.gantt.getPositionByDate(this.est);
            this.bounds.width = this.rowsManager.gantt.getPositionByDate(this.lct) - this.bounds.left;
        }
    };

    // Expands the start of the task to the specified position (in em)
    Task.prototype.setFrom = function(x) {
        this.from = this.rowsManager.gantt.getDateByPosition(x, true);
        this._fromLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
        this.checkIfMilestone();
    };

    // Expands the end of the task to the specified position (in em)
    Task.prototype.setTo = function(x) {
        this.to = this.rowsManager.gantt.getDateByPosition(x, true);
        this._toLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
        this.checkIfMilestone();
    };

    // Moves the task to the specified position (in em)
    Task.prototype.moveTo = function(x) {
        this.from = this.rowsManager.gantt.getDateByPosition(x, true);
        this._fromLabel = undefined;
        var newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.from);
        this.to = this.rowsManager.gantt.getDateByPosition(newTaskLeft + this.modelWidth, true);
        this._toLabel = undefined;
        this.row.setFromToByTask(this);
        this.updatePosAndSize();
    };

    Task.prototype.copy = function(task) {
        this.name = task.name;
        this.color = task.color;
        this.classes = task.classes;
        this.priority = task.priority;
        this.from = moment(task.from);
        this.to = moment(task.to);
        this.est = task.est !== undefined ? moment(task.est) : undefined;
        this.lct = task.lct !== undefined ? moment(task.lct) : undefined;
        this.data = task.data;
        this.isMilestone = task.isMilestone;
    };

    Task.prototype.clone = function() {
        return new Task(this.id, this.row, this.name, this.color, this.classes, this.priority, this.from, this.to, this.data, this.est, this.lct, this.progress);
    };

    return Task;
}]);


gantt.factory('GanttTaskProgress', [function() {
    var TaskProgress = function(task, percent, color, classes) {
        this.task = task;
        this.percent = percent;
        this.color = color;
        this.classes = classes;
    };

    TaskProgress.prototype.clone = function() {
        return new TaskProgress(this.task, this.percent, this.color, this.classes);
    };

    return TaskProgress;
}]);


gantt.factory('GanttBody', ['GanttBodyColumns', 'GanttBodyRows', function(BodyColumns, BodyRows) {
    var Body= function(gantt) {
        this.gantt = gantt;

        this.columns = new BodyColumns(this);
        this.rows = new BodyRows(this);
    };
    return Body;
}]);


gantt.factory('GanttBodyColumns', [function() {
    var BodyColumns = function($element) {
        this.$element = $element;
    };
    return BodyColumns;
}]);


gantt.factory('GanttBodyRows', [function() {
    var BodyRows = function($element) {
        this.$element = $element;
    };
    return BodyRows;
}]);


gantt.factory('GanttHeader', ['GanttHeaderColumns', function(HeaderColumns) {
    var Header = function(gantt) {
        this.gantt = gantt;
        this.columns = new HeaderColumns(this);
    };
    return Header;
}]);


gantt.factory('GanttHeaderColumns', [function() {
    var HeaderColumns = function($element) {
        this.$element = $element;
    };
    return HeaderColumns;
}]);


gantt.factory('GanttLabels', [function() {
    var Labels= function(gantt) {
        this.gantt = gantt;
    };
    return Labels;
}]);


gantt.factory('GanttScroll', [function() {
    var Scroll = function(gantt) {
        this.gantt = gantt;
    };

    /**
     * Scroll to a position
     *
     * @param {number} position Position to scroll to.
     */
    Scroll.prototype.scrollTo = function(position) {
        this.$element[0].scrollLeft = position;
        this.$element.triggerHandler('scroll');
    };

    /**
     * Scroll to the left side
     *
     * @param {number} offset Offset to scroll.
     */
    Scroll.prototype.scrollToLeft = function(offset) {
        this.$element[0].scrollLeft -= offset;
        this.$element.triggerHandler('scroll');
    };

    /**
     * Scroll to the right side
     *
     * @param {number} offset Offset to scroll.
     */
    Scroll.prototype.scrollToRight = function(offset) {
        this.$element[0].scrollLeft += offset;
        this.$element.triggerHandler('scroll');
    };

    // Tries to center the specified date
    /**
     * Scroll to a date
     *
     * @param {moment} date moment to scroll to.
     */
    Scroll.prototype.scrollToDate = function(date) {
        var position = this.gantt.getPositionByDate(date);

        if (position !== undefined) {
            this.$element[0].scrollLeft = position - this.$element[0].offsetWidth / 2;
        }
    };

    return Scroll;
}]);


gantt.factory('GanttTimespan', ['moment', function(moment) {
    var Timespan = function(id, gantt, name, color, classes, priority, from, to, data, est, lct) {
        this.id = id;
        this.gantt = gantt;
        this.name = name;
        this.color = color;
        this.classes = classes;
        this.priority = priority;
        this.from = moment(from);
        this.to = moment(to);
        this.data = data;

        if (est !== undefined && lct !== undefined) {
            this.est = moment(est);  //Earliest Start Time
            this.lct = moment(lct);  //Latest Completion Time
        }
    };

    Timespan.prototype.hasBounds = function() {
        return this.bounds !== undefined;
    };

    // Updates the pos and size of the timespan according to the from - to date
    Timespan.prototype.updatePosAndSize = function() {
        this.left = this.gantt.getPositionByDate(this.from);
        this.width = this.gantt.getPositionByDate(this.to) - this.left;

        if (this.est !== undefined && this.lct !== undefined) {
            this.bounds = {};
            this.bounds.left = this.gantt.getPositionByDate(this.est);
            this.bounds.width = this.gantt.getPositionByDate(this.lct) - this.bounds.left;
        }
    };

    // Expands the start of the timespan to the specified position (in em)
    Timespan.prototype.setFrom = function(x) {
        this.from = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    // Expands the end of the timespan to the specified position (in em)
    Timespan.prototype.setTo = function(x) {
        this.to = this.gantt.getDateByPosition(x);
        this.updatePosAndSize();
    };

    // Moves the timespan to the specified position (in em)
    Timespan.prototype.moveTo = function(x) {
        this.from = this.gantt.getDateByPosition(x);
        this.to = this.gantt.getDateByPosition(x + this.width);
        this.updatePosAndSize();
    };

    Timespan.prototype.copy = function(timespan) {
        this.name = timespan.name;
        this.color = timespan.color;
        this.classes = timespan.classes;
        this.priority = timespan.priority;
        this.from = moment(timespan.from);
        this.to = moment(timespan.to);
        this.est = timespan.est !== undefined ? moment(timespan.est) : undefined;
        this.lct = timespan.lct !== undefined ? moment(timespan.lct) : undefined;
        this.data = timespan.data;
    };

    Timespan.prototype.clone = function() {
        return new Timespan(this.id, this.gantt, this.name, this.color, this.classes, this.priority, this.from, this.to, this.data, this.est, this.lct);
    };

    return Timespan;
}]);


gantt.factory('GanttTimespansManager', ['GanttTimespan', 'GANTT_EVENTS', function(Timespan, GANTT_EVENTS) {
    var GanttTimespansManager = function(gantt) {
        var self = this;

        this.gantt = gantt;

        this.timespansMap = {};
        this.timespans = [];

        this.gantt.$scope.$watch('timespans', function(newValue, oldValue) {
            if (!angular.equals(newValue, oldValue)) {
                self.clearTimespans();
                self.loadTimespans(newValue);
            }
        });
    };

    // Adds or updates timespans
    GanttTimespansManager.prototype.loadTimespans = function(timespans) {
        for (var i = 0, l = timespans.length; i < l; i++) {
            var timespanData = timespans[i];
            this.loadTimespan(timespanData);
        }
        this.gantt.columnsManager.updateColumns();
    };

    // Adds a timespan or merges the timespan if there is already one with the same id
    GanttTimespansManager.prototype.loadTimespan = function(timespanData) {
        // Copy to new timespan (add) or merge with existing (update)
        var timespan, isUpdate = false;

        if (timespanData.id in this.timespansMap) {
            timespan = this.timespansMap[timespanData.id];
            timespan.copy(timespanData);
            isUpdate = true;
        } else {
            timespan = new Timespan(timespanData.id, this.gantt, timespanData.name, timespanData.color,
                timespanData.classes, timespanData.priority, timespanData.from, timespanData.to, timespanData.data);
            this.timespansMap[timespanData.id] = timespan;
            this.timespans.push(timespan);
            this.gantt.$scope.$emit(GANTT_EVENTS.TIMESPAN_ADDED, {timespan: timespan});
        }

        timespan.updatePosAndSize();
        return isUpdate;
    };

    // Removes all timespans
    GanttTimespansManager.prototype.clearTimespans = function() {
        this.timespansMap = {};
        this.timespans = [];
    };

    GanttTimespansManager.prototype.updateTimespansPosAndSize = function() {
        for (var i = 0, l = this.timespans.length; i < l; i++) {
            this.timespans[i].updatePosAndSize();
        }
    };

    return GanttTimespansManager;
}]);


gantt.service('ganttBinarySearch', [ function() {
    // Returns the object on the left and right in an array using the given cmp function.
    // The compare function defined which property of the value to compare (e.g.: c => c.left)

    return {
        getIndicesOnly: function(input, value, comparer) {
            var lo = -1, hi = input.length;
            while (hi - lo > 1) {
                var mid = Math.floor((lo + hi) / 2);
                if (comparer(input[mid]) <= value) {
                    lo = mid;
                } else {
                    hi = mid;
                }
            }
            if (input[lo] !== undefined && comparer(input[lo]) === value) {
                hi = lo;
            }
            return [lo, hi];
        },
        get: function(input, value, comparer) {
            var res = this.getIndicesOnly(input, value, comparer);
            return [input[res[0]], input[res[1]]];
        }
    };
}]);

gantt.filter('ganttColumnLimit', [ 'ganttBinarySearch', function(bs) {
    // Returns only the columns which are visible on the screen

    return function(input, scrollLeft, scrollWidth) {
        var cmp = function(c) {
            return c.left;
        };
        var start = bs.getIndicesOnly(input, scrollLeft, cmp)[0];
        var end = bs.getIndicesOnly(input, scrollLeft + scrollWidth, cmp)[1];
        return input.slice(start, end);
    };
}]);


gantt.directive('ganttLimitUpdater', ['$timeout', 'ganttDebounce', function($timeout, debounce) {
    // Updates the limit filters if the user scrolls the gantt chart

    return {
        restrict: 'A',
        controller: ['$scope', '$element', function($scope, $element) {
            var el = $element[0];
            var scrollUpdate = function() {
                $scope.scrollLeft = el.scrollLeft;
                $scope.scrollWidth = el.offsetWidth;
            };

            $element.bind('scroll', debounce(function() {
                scrollUpdate();
            }, 5));

            $scope.$watch('gantt.width', debounce(function() {
                scrollUpdate();
            }, 20));
        }]
    };
}]);


gantt.filter('ganttTaskLimit', [function() {
    // Returns only the tasks which are visible on the screen
    // Use the task width and position to decide if a task is still visible

    return function(input, gantt) {
        var res = [];
        for (var i = 0, l = input.length; i < l; i++) {
            var task = input[i];

            if (task.isMoving) {
                // If the task is moving, be sure to keep it existing.
                res.push(task);
            } else {
                // If the task can be drawn with gantt columns only.
                if (task.to > gantt.columnsManager.getFirstColumn().date && task.from < gantt.columnsManager.getLastColumn().endDate) {

                    var scrollLeft = gantt.$scope.scrollLeft;
                    var scrollWidth = gantt.$scope.scrollWidth;

                    // If task has a visible part on the screen
                    if (task.left >= scrollLeft && task.left <= scrollLeft + scrollWidth ||
                        task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollWidth ||
                        task.left < scrollLeft && task.left + task.width > scrollLeft + scrollWidth) {

                        res.push(task);
                    }
                }
            }

        }

        return res;
    };
}]);


gantt.directive('ganttLabelsResize', ['$document', 'ganttDebounce', 'ganttMouseOffset', 'GANTT_EVENTS', function($document, debounce, mouseOffset, GANTT_EVENTS) {

    return {
        restrict: 'A',
        scope: { enabled: '=ganttLabelsResize',
            width: '=ganttLabelsResizeWidth',
            minWidth: '=ganttLabelsResizeMinWidth'},
        controller: ['$scope', '$element', function($scope, $element) {
            var resizeAreaWidth = 5;
            var cursor = 'ew-resize';
            var originalPos;

            $element.bind('mousedown', function(e) {
                if ($scope.enabled && isInResizeArea(e)) {
                    enableResizeMode(e);
                    e.preventDefault();
                }
            });

            $element.bind('mousemove', function(e) {
                if ($scope.enabled) {
                    if (isInResizeArea(e)) {
                        $element.css('cursor', cursor);
                    } else {
                        $element.css('cursor', '');
                    }
                }
            });

            var resize = function(x) {
                if ($scope.width === 0) {
                    $scope.width = $element[0].offsetWidth;
                }

                $scope.width += x - originalPos;
                if ($scope.width < $scope.minWidth) {
                    $scope.width = $scope.minWidth;
                }

                originalPos = x;
            };

            var isInResizeArea = function(e) {
                var x = mouseOffset.getOffset(e).x;

                return x > $element[0].offsetWidth - resizeAreaWidth;
            };

            var enableResizeMode = function(e) {
                originalPos = e.screenX;

                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': cursor
                });

                var moveHandler = debounce(function(e) {
                    resize(e.screenX);
                }, 5);

                angular.element($document[0].body).bind('mousemove', moveHandler);

                angular.element($document[0].body).one('mouseup', function() {
                    angular.element($document[0].body).unbind('mousemove', moveHandler);
                    disableResizeMode();
                });
            };

            var disableResizeMode = function() {
                $element.css('cursor', '');

                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });

                $scope.$emit(GANTT_EVENTS.ROW_LABELS_RESIZED, { width: $scope.width });
            };
        }]
    };
}]);


gantt.directive('ganttRightClick', ['$parse', function($parse) {

    return {
        restrict: 'A',
        compile: function($element, attr) {
            var fn = $parse(attr.ganttRightClick);

            return function(scope, element) {
                element.on('contextmenu', function(event) {
                    scope.$apply(function() {
                        fn(scope, {$event: event});
                    });
                });
            };
        }
    };
}]);

gantt.directive('ganttRow', ['GanttEvents', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.row.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.row.$element = $element;

            $element.bind('mousedown', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_MOUSEDOWN, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('mouseup', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_MOUSEUP, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_DBL_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_CONTEXTMENU, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });


        }]
    };
}]);


gantt.directive('ganttRowHeader', ['GanttEvents', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.rowHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_MOUSEDOWN, {evt: evt});
            });

            $element.bind('mouseup', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_MOUSEUP, {evt: evt});
            });

            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_CLICKED, {evt: evt});
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_DBL_CLICKED, {evt: evt});
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_HEADER_CONTEXTMENU, {evt: evt});
            });


        }]
    };
}]);


gantt.directive('ganttRowLabel', ['GanttEvents', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.rowLabel.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_LABEL_MOUSEDOWN, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('mouseup', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_LABEL_MOUSEUP, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_LABEL_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_LABEL_DBL_CLICKED, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.ROW_LABEL_CONTEXTMENU, Events.buildRowEventData(evt, $element, $scope.row, $scope.gantt));
            });


        }]
    };
}]);


gantt.directive('ganttHorizontalScrollReceiver', function() {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.scrollManager.horizontal.push($element[0]);
        }]
    };
});

gantt.directive('ganttScrollManager', function() {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: 'A',
        require: '^gantt',
        controller: ['$scope', function($scope) {
            $scope.scrollManager = {
                horizontal: [],
                vertical: []
            };
        }]
    };
});


gantt.directive('ganttScrollSender', ['$timeout', 'ganttDebounce', 'GANTT_EVENTS', function($timeout, debounce, GANTT_EVENTS) {
    // Updates the element which are registered for the horizontal or vertical scroll event

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        controller: ['$scope', '$element', function($scope, $element) {
            var el = $element[0];
            var updateListeners = function() {
                var i, l;

                for (i = 0, l = $scope.scrollManager.vertical.length; i < l; i++) {
                    var vElement = $scope.scrollManager.vertical[i];
                    if (vElement.style.top !== -el.scrollTop) {
                        vElement.style.top = -el.scrollTop + 'px';
                        vElement.style.height = el.scrollHeight + 'px';
                    }
                }

                for (i = 0, l = $scope.scrollManager.horizontal.length; i < l; i++) {
                    var hElement = $scope.scrollManager.horizontal[i];
                    if (hElement.style.left !== -el.scrollLeft) {
                        hElement.style.left = -el.scrollLeft + 'px';
                        hElement.style.width = el.scrollWidth + 'px';
                    }
                }
            };

            $element.bind('scroll', updateListeners);

            $scope.$on(GANTT_EVENTS.ROW_ADDED, debounce(function() {
                updateListeners();
            }, 5));

            $scope.$watch('gantt.width', function(newValue) {
                if (newValue === 0) {
                    $timeout(function() {
                        updateListeners();
                    }, 0, true);
                }
            });
        }]
    };
}]);


gantt.directive('ganttScrollable', ['ganttDebounce', 'ganttLayout', 'GANTT_EVENTS', function(debounce, layout, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.scrollable.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.scroll.$element = $element;

            var scrollBarWidth = layout.getScrollBarWidth();
            var lastScrollLeft;

            var lastAutoExpand;
            var autoExpandCoolDownPeriod = 500;
            var autoExpandColumns = function(el, date, direction) {
                if ($scope.autoExpand !== 'both' && $scope.autoExpand !== true && $scope.autoExpand !== direction) {
                    return;
                }

                if (Date.now() - lastAutoExpand < autoExpandCoolDownPeriod) {
                    return;
                }

                var from, to;
                var expandHour = 1, expandDay = 31;

                if (direction === 'left') {
                    from = $scope.viewScale === 'hour' ? moment(date).add(-expandHour, 'day') : moment(date).add(-expandDay, 'day');
                    to = date;
                } else {
                    from = date;
                    to = $scope.viewScale === 'hour' ? moment(date).add(expandHour, 'day') : moment(date).add(expandDay, 'day');
                }

                $scope.fromDate = from;
                $scope.toDate = to;
                lastAutoExpand = Date.now();
            };

            $element.bind('scroll', debounce(function() {
                var el = $element[0];
                var direction;
                var date;

                if (el.scrollLeft < lastScrollLeft && el.scrollLeft === 0) {
                    direction = 'left';
                    date = $scope.gantt.from;
                } else if (el.scrollLeft > lastScrollLeft && el.offsetWidth + el.scrollLeft >= el.scrollWidth - 1) {
                    direction = 'right';
                    date = $scope.gantt.to;
                }

                lastScrollLeft = el.scrollLeft;

                if (date !== undefined) {
                    autoExpandColumns(el, date, direction);
                    $scope.$emit(GANTT_EVENTS.SCROLL, {left: el.scrollLeft, date: date, direction: direction});
                } else {
                    $scope.$emit(GANTT_EVENTS.SCROLL, {left: el.scrollLeft});
                }
            }, 5));

            $scope.$watch('gantt.columns.length', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue > 0 && $scope.gantt.scrollAnchor !== undefined) {
                    // Ugly but prevents screen flickering (unlike $timeout)
                    $scope.$$postDigest(function() {
                        $scope.gantt.scroll.scrollToDate($scope.gantt.scrollAnchor);
                    });
                }
            });



            $scope.getScrollableCss = function() {
                var css = {};

                if ($scope.ganttElementWidth - ($scope.showLabelsColumn ? $scope.labelsWidth : 0) > $scope.gantt.width + scrollBarWidth) {
                    css.width = $scope.gantt.width + scrollBarWidth + 'px';
                }

                if ($scope.maxHeight > 0) {
                    css['max-height'] = $scope.maxHeight - $scope.gantt.header.getHeight() + 'px';
                    css['overflow-y'] = 'auto';
                } else {
                    css['overflow-y'] = 'hidden';
                }

                return css;
            };


        }]
    };
}]);


gantt.directive('ganttVerticalScrollReceiver', function() {
    // The element with this attribute will scroll at the same time as the scrollSender element

    return {
        restrict: 'A',
        require: '^ganttScrollManager',
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.scrollManager.vertical.push($element[0]);
        }]
    };
});

gantt.directive('ganttElementWidthListener', [function() {
    // Updates the limit filters if the user scrolls the gantt chart

    return {
        restrict: 'A',
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
            var scopeVariable = $attrs.ganttElementWidthListener;
            if (scopeVariable === '') {
                scopeVariable = 'ganttElementWidth';
            }

            var effectiveScope = $scope;

            while(scopeVariable.indexOf('$parent.') === 0) {
                scopeVariable = scopeVariable.substring('$parent.'.length);
                effectiveScope = $scope.$parent;
            }

            effectiveScope.$watch(function() {
                effectiveScope[scopeVariable] = $element[0].offsetWidth;
            });
        }]
    };
}]);


gantt.service('ganttSortManager', [ function() {
    // Contains the row which the user wants to sort (the one he started to drag)

    return { startRow: undefined };
}]);

gantt.directive('ganttSortable', ['$document', 'ganttSortManager', function($document, sortManager) {
    // Provides the row sort functionality to any Gantt row
    // Uses the sortableState to share the current row

    return {
        restrict: 'E',
        template: '<div ng-transclude></div>',
        replace: true,
        transclude: true,
        scope: { row: '=ngModel', swap: '&', active: '=?' },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('mousedown', function() {
                if ($scope.active !== true) {
                    return;
                }

                enableDragMode();

                var disableHandler = function() {
                    $scope.$apply(function() {
                        angular.element($document[0].body).unbind('mouseup', disableHandler);
                        disableDragMode();
                    });
                };
                angular.element($document[0].body).bind('mouseup', disableHandler);
            });

            $element.bind('mousemove', function(e) {
                if (isInDragMode()) {
                    var elementBelowMouse = angular.element($document[0].elementFromPoint(e.clientX, e.clientY));
                    var targetRow = elementBelowMouse.controller('ngModel').$modelValue;

                    if (targetRow.id !== sortManager.startRow.id) {
                        $scope.$apply(function () {
                            $scope.swap({a: targetRow, b: sortManager.startRow});
                        });
                    }
                }
            });

            var isInDragMode = function() {
                return sortManager.startRow !== undefined && !angular.equals($scope.row, sortManager.startRow);
            };

            var enableDragMode = function() {
                sortManager.startRow = $scope.row;
                $element.css('cursor', 'move');
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': 'no-drop'
                });
            };

            var disableDragMode = function() {
                sortManager.startRow = undefined;
                $element.css('cursor', 'pointer');
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': 'auto'
                });
            };
        }]
    };
}]);

gantt.directive('ganttBounds', [function() {
    // Displays a box representing the earliest allowable start time and latest completion time for a job

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bounds.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: { task: '=ngModel' },
        controller: ['$scope', function($scope) {
            var css = {};

            if (!$scope.task.hasBounds()) {
                $scope.visible = false;
            }

            $scope.getCss = function() {
                if ($scope.task.hasBounds()) {
                    css.width = $scope.task.bounds.width + 'px';

                    if ($scope.task.isMilestone === true || $scope.task.width === 0) {
                        css.left = ($scope.task.bounds.left - ($scope.task.left - 0.3)) + 'px';
                    } else {
                        css.left = ($scope.task.bounds.left - $scope.task.left) + 'px';
                    }
                }

                return css;
            };

            $scope.getClass = function() {
                if ($scope.task.est === undefined || $scope.task.lct === undefined) {
                    return 'gantt-task-bounds-in';
                } else if ($scope.task.est > $scope.task.from) {
                    return 'gantt-task-bounds-out';
                }
                else if ($scope.task.lct < $scope.task.to) {
                    return 'gantt-task-bounds-out';
                }
                else {
                    return 'gantt-task-bounds-in';
                }
            };

            $scope.$watch('task.isMouseOver', function() {
                if ($scope.task.hasBounds() && !$scope.task.isMoving) {
                    $scope.visible = !($scope.task.isMouseOver === undefined || $scope.task.isMouseOver === false);
                }
            });

            $scope.$watch('task.isMoving', function(newValue) {
                if ($scope.task.hasBounds()) {
                    $scope.visible = newValue === true;
                }
            });
        }]
    };
}]);


gantt.directive('ganttTaskProgress', [function() {
    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.taskProgress.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        scope: { progress: '=ganttTaskProgressValue' },
        controller: ['$scope', function($scope) {
            $scope.getCss = function() {
                var css = {};

                if ($scope.progress.color) {
                    css['background-color'] = $scope.progress.color;
                } else {
                    css['background-color'] = '#6BC443';
                }

                css.width = $scope.progress.percent + '%';

                return css;
            };
        }]
    };
}]);


gantt.directive('ganttTask', ['$window', '$document', '$timeout', '$filter', 'ganttSmartEvent', 'ganttDebounce', 'ganttMouseOffset', 'ganttMouseButton', 'GanttEvents', 'GANTT_EVENTS', function($window, $document, $timeout, $filter, smartEvent, debounce, mouseOffset, mouseButton, Events, GANTT_EVENTS) {

    return {
        restrict: 'E',
        require: '^ganttRow',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.task.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            var resizeAreaWidthBig = 5;
            var resizeAreaWidthSmall = 3;
            var scrollSpeed = 15;
            var scrollTriggerDistance = 5;

            var windowElement = angular.element($window);
            var ganttRowElement = $scope.row.$element;
            var ganttBodyElement = $scope.row.rowsManager.gantt.body.$element;
            var ganttScrollElement = $scope.row.rowsManager.gantt.scroll.$element;

            var taskHasBeenChanged = false;
            var mouseOffsetInEm;
            var moveStartX;
            var scrollInterval;

            $element.bind('mousedown', function(evt) {
                $scope.$apply(function() {
                    var mode = getMoveMode(evt);
                    if (mode !== '' && mouseButton.getButton(evt) === 1) {
                        var offsetX = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt).x;
                        enableMoveMode(mode, offsetX, evt);
                    }
                });
            });

            $element.bind('click', function(evt) {
                $scope.$apply(function() {
                    // Only raise click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.$emit(GANTT_EVENTS.TASK_CLICKED, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    }

                    evt.stopPropagation();
                });
            });

            $element.bind('dblclick', function(evt) {
                $scope.$apply(function() {
                    // Only raise dbl click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.$emit(GANTT_EVENTS.TASK_DBL_CLICKED, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    }

                    evt.stopPropagation();
                });
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$apply(function() {
                    // Only raise click event if there was no task update event
                    if (!taskHasBeenChanged) {
                        $scope.$emit(GANTT_EVENTS.TASK_CONTEXTMENU, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    }

                    evt.stopPropagation();
                });
            });

            $element.bind('mousemove', debounce(function(e) {
                var mode = getMoveMode(e);
                if (mode !== '' && ($scope.task.isMoving || mode !== 'M')) {
                    $element.css('cursor', getCursor(mode));
                } else {
                    $element.css('cursor', '');
                }

                $scope.task.mouseX = e.clientX;
            }, 5));

            $element.bind('mouseenter', function(e) {
                $scope.$apply(function() {
                    $scope.task.mouseX = e.clientX;
                    $scope.task.isMouseOver = true;
                });
            });

            $element.bind('mouseleave', function() {
                $scope.$apply(function() {
                    $scope.task.isMouseOver = false;
                });
            });

            var handleMove = function(mode, evt) {
                if ($scope.task.isMoving === false) {
                    return;
                }

                moveTask(mode, evt);
                scrollScreen(mode, evt);
            };

            var moveTask = function(mode, evt) {
                var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                $scope.task.mouseOffsetX = mousePos.x;
                var x = mousePos.x;
                if (mode === 'M') {
                    if ($scope.allowTaskRowSwitching) {
                        var targetRow = getRowByY(mousePos.y);
                        if (targetRow !== undefined && $scope.task.row.id !== targetRow.id) {
                            targetRow.moveTaskToRow($scope.task);
                        }
                    }

                    if ($scope.allowTaskMoving) {
                        x = x - mouseOffsetInEm;
                        if ($scope.taskOutOfRange !== 'truncate') {
                            if (x < 0) {
                                x = 0;
                            } else if (x + $scope.task.width >= $scope.gantt.width) {
                                x = $scope.gantt.width - $scope.task.width;
                            }
                        }
                        $scope.task.moveTo(x);
                        $scope.$emit(GANTT_EVENTS.TASK_MOVE, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    }
                } else if (mode === 'E') {
                    if ($scope.taskOutOfRange !== 'truncate') {
                        if (x < $scope.task.left) {
                            x = $scope.task.left;
                        } else if (x > $scope.gantt.width) {
                            x = $scope.gantt.width;
                        }
                    }
                    $scope.task.setTo(x);
                    $scope.$emit(GANTT_EVENTS.TASK_RESIZE, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                } else {
                    if ($scope.taskOutOfRange !== 'truncate') {
                        if (x > $scope.task.left + $scope.task.width) {
                            x = $scope.task.left + $scope.task.width;
                        } else if (x < 0) {
                            x = 0;
                        }
                    }
                    $scope.task.setFrom(x);
                    $scope.$emit(GANTT_EVENTS.TASK_RESIZE, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                }

                taskHasBeenChanged = true;
            };

            var scrollScreen = function(mode, evt) {
                var mousePos = mouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
                var leftScreenBorder = ganttScrollElement[0].scrollLeft;
                var keepOnScrolling = false;

                if (mousePos.x < moveStartX) {
                    // Scroll to the left
                    if (mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                        mousePos.x -= scrollSpeed;
                        keepOnScrolling = true;
                        $scope.scrollToLeft(scrollSpeed);
                    }
                } else {
                    // Scroll to the right
                    var screenWidth = ganttScrollElement[0].offsetWidth;
                    var rightScreenBorder = leftScreenBorder + screenWidth;

                    if (mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                        mousePos.x += scrollSpeed;
                        keepOnScrolling = true;
                        $scope.scrollToRight(scrollSpeed);
                    }
                }

                if (keepOnScrolling) {
                    scrollInterval = $timeout(function() {
                        handleMove(mode, evt);
                    }, 100, true);
                }
            };

            var clearScrollInterval = function() {
                if (scrollInterval !== undefined) {
                    $timeout.cancel(scrollInterval);
                    scrollInterval = undefined;
                }
            };

            var getRowByY = function(y) {
                if (y >= ganttRowElement[0].offsetTop && y <= ganttRowElement[0].offsetTop + ganttRowElement[0].offsetHeight) {
                    return $scope.task.row;
                } else {
                    var visibleRows = [];
                    angular.forEach($scope.task.row.rowsManager.rows, function(row) {
                        if (!row.hidden) {
                            visibleRows.push(row);
                        }
                    });
                    var rowHeight = ganttBodyElement[0].offsetHeight / visibleRows.length;
                    var pos = Math.floor(y / rowHeight);
                    return visibleRows[pos];
                }
            };

            var getMoveMode = function(e) {
                var x = mouseOffset.getOffset(e).x;

                var distance = 0;

                // Define resize&move area. Make sure the move area does not get too small.
                if ($scope.allowTaskResizing) {
                    distance = $element[0].offsetWidth < 10 ? resizeAreaWidthSmall : resizeAreaWidthBig;
                }

                if ($scope.allowTaskResizing && x > $element[0].offsetWidth - distance) {
                    return 'E';
                } else if ($scope.allowTaskResizing && x < distance) {
                    return 'W';
                } else if (($scope.allowTaskMoving || $scope.allowTaskRowSwitching) && x >= distance && x <= $element[0].offsetWidth - distance) {
                    return 'M';
                } else {
                    return '';
                }
            };

            var getCursor = function(mode) {
                switch (mode) {
                    case 'E':
                        return 'e-resize';
                    case 'W':
                        return 'w-resize';
                    case 'M':
                        return 'move';
                }
            };

            var enableMoveMode = function(mode, x, evt) {
                // Raise task move start event
                if (!$scope.task.isMoving) {
                    if (mode === 'M') {
                        $scope.$emit(GANTT_EVENTS.TASK_MOVE_BEGIN, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    } else {
                        $scope.$emit(GANTT_EVENTS.TASK_RESIZE_BEGIN, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                    }
                }

                // Init task move
                taskHasBeenChanged = false;
                $scope.task.moveMode = mode;
                $scope.task.isMoving = true;
                moveStartX = x;
                mouseOffsetInEm = x - $scope.task.modelLeft;

                // Add move event handlers
                var taskMoveHandler = debounce(function(evt) {
                    if ($scope.task.isMoving) {
                        // As this function is defered, disableMoveMode may have been called before.
                        // Without this check, TASK_CHANGED event is not fired for faster moves.
                        // See github issue #190
                        clearScrollInterval();
                        handleMove(mode, evt);
                    }
                }, 5);
                smartEvent($scope, windowElement, 'mousemove', taskMoveHandler).bind();

                smartEvent($scope, windowElement, 'mouseup', function(evt) {
                    $scope.$apply(function() {
                        windowElement.unbind('mousemove', taskMoveHandler);
                        disableMoveMode(evt);
                    });
                }).bindOnce();

                // Show mouse move/resize cursor
                $element.css('cursor', getCursor(mode));
                angular.element($document[0].body).css({
                    '-moz-user-select': '-moz-none',
                    '-webkit-user-select': 'none',
                    '-ms-user-select': 'none',
                    'user-select': 'none',
                    'cursor': getCursor(mode)
                });
            };

            var disableMoveMode = function(evt) {
                $scope.task.isMoving = false;

                // Stop any active auto scroll
                clearScrollInterval();

                // Set mouse cursor back to default
                $element.css('cursor', '');
                angular.element($document[0].body).css({
                    '-moz-user-select': '',
                    '-webkit-user-select': '',
                    '-ms-user-select': '',
                    'user-select': '',
                    'cursor': ''
                });

                // Raise move end event
                if ($scope.task.moveMode === 'M') {
                    $scope.$emit(GANTT_EVENTS.TASK_MOVE_END, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                } else {
                    $scope.$emit(GANTT_EVENTS.TASK_RESIZE_END, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                }

                $scope.task.moveMode = undefined;

                // Raise task changed event
                if (taskHasBeenChanged === true) {
                    taskHasBeenChanged = false;
                    $scope.task.row.sortTasks(); // Sort tasks so they have the right z-order
                    $scope.$emit(GANTT_EVENTS.TASK_CHANGED, Events.buildTaskEventData(evt, $element, $scope.task, $scope.gantt));
                }
            };

            if ($scope.task.isCreating) {
                delete $scope.task.isCreating;
                enableMoveMode('E', $scope.task.mouseOffsetX);
            } else if ($scope.task.isMoving) {
                // In case the task has been moved to another row a new controller is is created by angular.
                // Enable the move mode again if this was the case.
                enableMoveMode('M', $scope.task.mouseOffsetX);
            }
        }]
    };
}]);


gantt.directive('ganttTooltip', ['$timeout', '$document', 'ganttDebounce', 'ganttSmartEvent', function($timeout, $document, debounce, smartEvent) {
    // This tooltip displays more information about a task

    return {
        restrict: 'E',
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.tooltip.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        replace: true,
        controller: ['$scope', '$element', function($scope, $element) {
            var bodyElement = angular.element($document[0].body);
            var parentElement = $element.parent();
            $scope.visible = false;
            $scope.css = {};

            $scope.$watch('task.isMouseOver', function(newValue) {
                if (newValue === true) {
                    showTooltip($scope.task.mouseX);
                } else if (newValue === false && $scope.task.isMoving === false) {
                    hideTooltip();
                }
            });

            var mouseMoveHandler = smartEvent($scope, bodyElement, 'mousemove', debounce(function(e) {
                if ($scope.visible === true) {
                    updateTooltip(e.clientX);
                } else {
                    showTooltip(e.clientX);
                }
            }, 5, false));

            $scope.$watch('task.isMoving', function(newValue) {
                if (newValue === true) {
                    mouseMoveHandler.bind();
                } else if (newValue === false) {
                    mouseMoveHandler.unbind();
                    hideTooltip();
                }
            });

            var getViewPortWidth = function() {
                var d = $document[0];
                return d.documentElement.clientWidth || d.documentElement.getElementById('body')[0].clientWidth;
            };

            var showTooltip = function(x) {
                $scope.visible = true;

                $timeout(function() {
                    updateTooltip(x);

                    $scope.css.top = parentElement[0].getBoundingClientRect().top + 'px';
                    $scope.css.marginTop = -$element[0].offsetHeight - 8 + 'px';
                    $scope.css.opacity = 1;
                }, 0, true);
            };

            var updateTooltip = function(x) {
                $element.removeClass('gantt-task-infoArrow');
                $element.removeClass('gantt-task-infoArrowR');

                // Check if info is overlapping with view port
                if (x + $element[0].offsetWidth > getViewPortWidth()) {
                    $scope.css.left = (x + 20 - $element[0].offsetWidth) + 'px';
                    $element.addClass('gantt-task-infoArrowR'); // Right aligned info
                } else {
                    $scope.css.left = (x - 20) + 'px';
                    $element.addClass('gantt-task-infoArrow');
                }
            };

            var hideTooltip = function() {
                $scope.css.opacity = 0;
                $scope.visible = false;
            };
        }]
    };
}]);


gantt.directive('ganttBody', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.body.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.$element = $element;
        }]
    };
}]);


gantt.directive('ganttBodyColumns', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyColumns.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.columns.$element = $element;
        }]
    };
}]);


gantt.directive('ganttBodyRows', [function() {
    return {
        restrict: 'E',
        require: '^ganttBody',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.bodyRows.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.body.rows.$element = $element;
        }]
    };
}]);


gantt.directive('ganttColumn', [function() {
    return {
        restrict: 'E',
        require: '^ganttBodyColumns',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.column.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.column.$element = $element;
        }]
    };
}]);


gantt.directive('ganttColumnHeader', ['GanttEvents', 'GANTT_EVENTS', function(Events, GANTT_EVENTS) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.columnHeader.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $element.bind('click', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_CLICKED, Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('dblclick', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_DBL_CLICKED, Events.buildColumnEventData(evt, $element, $scope.column));
            });

            $element.bind('contextmenu', function(evt) {
                $scope.$emit(GANTT_EVENTS.COLUMN_CONTEXTMENU, Events.buildColumnEventData(evt, $element, $scope.column));
            });
        }]
    };
}]);


gantt.directive('ganttHeader', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.header.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.header.$element = $element;

            $scope.getHeaderCss = function() {
                var css = {};

                if ($scope.ganttElementWidth - ($scope.showLabelsColumn ? $scope.labelsWidth : 0) > $scope.gantt.width) {
                    css.width = $scope.gantt.width + 'px';
                }

                return css;
            };
        }]
    };
}]);


gantt.directive('ganttHeaderColumns', [function() {
    return {
        restrict: 'E',
        require: '^ganttHeader',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.headerColumns.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.header.columns.$element = $element;
        }]
    };
}]);


gantt.directive('ganttLabels', [function() {
    return {
        restrict: 'E',
        require: '^gantt',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.labels.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.gantt.labels.$element = $element;
        }]
    };
}]);


gantt.directive('ganttTimeFrame', [function() {
    return {
        restrict: 'E',
        require: '^ganttColumn',
        transclude: true,
        replace: true,
        templateUrl: function(tElement, tAttrs) {
            if (tAttrs.templateUrl === undefined) {
                return 'template/default.timeFrame.tmpl.html';
            } else {
                return tAttrs.templateUrl;
            }
        },
        controller: ['$scope', '$element', function($scope, $element) {
            $scope.timeFrame.$element = $element;

            $scope.getClass = function() {
                var classes = ['gantt-timeframe' + ($scope.timeFrame.working ? '' : '-non') + '-working'];

                if ($scope.timeFrame.classes) {
                    classes = classes.concat($scope.timeFrame.classes);
                }
                return classes;
            };

        }]
    };
}]);


gantt.factory('ganttDebounce', ['$timeout', function($timeout) {
    function debounce(fn, timeout, invokeApply) {
        var nthCall = 0;
        return function() {
            var self = this;
            var argz = arguments;
            nthCall++;
            var later = (function(version) {
                return function() {
                    if (version === nthCall) {
                        return fn.apply(self, argz);
                    }
                };
            })(nthCall);
            return $timeout(later, timeout, invokeApply === undefined ? true: invokeApply);
        };
    }

    return debounce;
}]);

gantt.service('ganttEnableNgAnimate', ['$injector', function($injector) {
    var ngAnimate;
    try {
        ngAnimate = $injector.get('$animate');
    } catch (e) {
    }

    if (ngAnimate !== undefined) {
        return function(enabled, element) {
            ngAnimate.enabled(false, element);
        };
    } else {
        return function() {};
    }


}]);


gantt.service('ganttLayout', ['$document', function($document) {
    return {
        /**
         * Compute the width of scrollbar.
         *
         * @returns {number} width of the scrollbar, in px.
         */
        getScrollBarWidth: function() {
            var inner = $document[0].createElement('p');
            inner.style.width = '100%';
            inner.style.height = '200px';

            var outer = $document[0].createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '0px';
            outer.style.left = '0px';
            outer.style.visibility = 'hidden';
            outer.style.width = '200px';
            outer.style.height = '150px';
            outer.style.overflow = 'hidden';
            outer.appendChild (inner);

            $document[0].body.appendChild (outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 === w2) {
                w2 = outer.clientWidth;
            }
            $document[0].body.removeChild (outer);

            return (w1 - w2);
        },

        setColumnsWidth: function(width, originalWidth, columns) {
            if (width && originalWidth && columns) {

                var widthFactor = Math.abs(width / originalWidth);

                angular.forEach(columns, function(column) {
                    column.left = widthFactor * column.originalSize.left;
                    column.width = widthFactor * column.originalSize.width;

                    angular.forEach(column.timeFrames, function(timeFrame) {
                        timeFrame.left = widthFactor * timeFrame.originalSize.left;
                        timeFrame.width = widthFactor * timeFrame.originalSize.width;
                    });
                });
            }
        }
    };
}]);


gantt.service('ganttMouseButton', [ function() {
    // Mouse button cross browser normalization

    return {
        getButton: function(e) {
            e = e || window.event;

            if (!e.which) {
                return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
            } else {
                return e.which;
            }
        }
    };
}]);

gantt.service('ganttMouseOffset', [ function() {
    // Mouse offset support for lesser browsers (read IE 8)

    return {
        getOffset: function(evt) {
            if (evt.offsetX && evt.offsetY) {
                return { x: evt.offsetX, y: evt.offsetY };
            }
            if (evt.layerX && evt.layerY) {
                return { x: evt.layerX, y: evt.layerY };
            } else {
                return this.getOffsetForElement(evt.target, evt);
            }
        },
        getOffsetForElement: function(el, evt) {
            var bb = el.getBoundingClientRect();
            return { x: evt.clientX - bb.left, y: evt.clientY - bb.top };
        }
    };
}]);

gantt.factory('ganttSmartEvent', [function() {
    // Auto released the binding when the scope is destroyed. Use if an event is registered on another element than the scope.

    function smartEvent($scope, $element, event, fn) {
        $scope.$on('$destroy', function() {
            $element.unbind(event, fn);
        });

        return {
            bindOnce: function() {
                $element.one(event, fn);
            },
            bind: function() {
                $element.bind(event, fn);
            },
            unbind: function() {
                $element.unbind(event, fn);
            }
        };
    }

    return smartEvent;
}]);
angular.module('ganttTemplates', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/default.gantt.tmpl.html',
        '<div class="gantt unselectable" gantt-scroll-manager gantt-element-width-listener>\n' +
        '    <gantt-labels>\n' +
        '        <div class="gantt-labels-header">\n' +
        '            <gantt-row-header></gantt-row-header>\n' +
        '        </div>\n' +
        '        <div class="gantt-labels-body"\n' +
        '             ng-style="(maxHeight > 0 && {\'max-height\': (maxHeight - gantt.header.getHeight())+\'px\'} || {})"\n' +
        '             ng-show="gantt.columnsManager.columns.length > 0">\n' +
        '            <div gantt-vertical-scroll-receiver style="position: relative">\n' +
        '                <gantt-row-label ng-repeat="row in gantt.rowsManager.visibleRows track by $index">\n' +
        '                    <gantt-sortable swap="row.rowsManager.gantt.swapRows(a,b)" active="allowRowSorting" ng-model="row">\n' +
        '                        <span class="gantt-labels-text">{{ row.name }}</span>\n' +
        '                    </gantt-sortable>\n' +
        '                </gantt-row-label>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </gantt-labels>\n' +
        '    <gantt-header>\n' +
        '        <gantt-header-columns>\n' +
        '            <div ng-repeat="header in gantt.columnsManager.visibleHeaders">\n' +
        '                <div class="gantt-header-row gantt-header-row-bottom">\n' +
        '                    <gantt-column-header ng-repeat="column in header track by $index">\n' +
        '                        {{ column.label }}\n' +
        '                    </gantt-column-header>\n' +
        '                </div>\n' +
        '            </div>\n' +
        '        </gantt-header-columns>\n' +
        '    </gantt-header>\n' +
        '    <gantt-scrollable>\n' +
        '        <gantt-body>\n' +
        '            <div class="gantt-body-background">\n' +
        '                <div class="gantt-row-height"\n' +
        '                     ng-class-odd="\'gantt-background-row\'"\n' +
        '                     ng-class-even="\'gantt-background-row-alt\'"\n' +
        '                     ng-class="row.classes"\n' +
        '                     ng-style="{\'background-color\': row.color, \'height\': row.height}"\n' +
        '                     ng-repeat="row in gantt.rowsManager.visibleRows track by $index">\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <div class="gantt-body-foreground">\n' +
        '                <div class="gantt-current-date-line" ng-if="currentDate === \'line\' && gantt.currentDateManager.position >= 0 && gantt.currentDateManager.position <= gantt.width" ng-style="{\'left\': gantt.currentDateManager.position + \'px\' }"></div>\n' +
        '            </div>\n' +
        '            <gantt-body-columns class="gantt-body-columns">\n' +
        '                <gantt-column ng-repeat="column in gantt.columnsManager.visibleColumns track by $index">\n' +
        '                    <gantt-time-frame ng-repeat="timeFrame in column.visibleTimeFrames"></gantt-time-frame>\n' +
        '                </gantt-column>\n' +
        '            </gantt-body-columns>\n' +
        '            <gantt-body-rows>\n' +
        '                <div class="gantt-timespan"\n' +
        '                     ng-style="{\'left\': ((timespan.left-0.3) || timespan.left)+\'px\', \'width\': timespan.width +\'px\', \'z-index\': (timespan.priority || 0)}"\n' +
        '                     ng-class="timespan.classes"\n' +
        '                     ng-repeat="timespan in gantt.timespansManager.timespans">\n' +
        '                    <gantt-tooltip ng-model="timespan" date-format="\'MMM d\'">\n' +
        '                        <div class="gantt-task-content"><span>{{ timespan.name }}</span></div>\n' +
        '                    </gantt-tooltip>\n' +
        '                </div>\n' +
        '                <gantt-row ng-repeat="row in gantt.rowsManager.visibleRows track by $index">\n' +
        '                    <gantt-task ng-repeat="task in row.visibleTasks track by task.id"></gantt-task>\n' +
        '                </gantt-row>\n' +
        '            </gantt-body-rows>\n' +
        '        </gantt-body>\n' +
        '    </gantt-scrollable>\n' +
        '\n' +
        '\n' +
        '    <!--\n' +
        '    ******* Inline templates *******\n' +
        '    You can specify your own templates by either changing the default ones below or by\n' +
        '    adding an attribute template-url="<url to your template>" on the specific element.\n' +
        '    -->\n' +
        '\n' +
        '    <!-- Body template -->\n' +
        '    <script type="text/ng-template" id="template/default.body.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body"\n' +
        '             ng-style="{\'width\': gantt.width +\'px\'}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Header template -->\n' +
        '    <script type="text/ng-template" id="template/default.header.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-header"\n' +
        '             ng-show="gantt.columnsManager.columns.length > 0 && gantt.columnsManager.getActiveHeadersCount() > 0"\n' +
        '             ng-style="getHeaderCss()"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Row label template -->\n' +
        '    <script type="text/ng-template" id="template/default.rowLabel.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-labels-row gantt-row-height"\n' +
        '             ng-class-odd="\'gantt-background-row\'"\n' +
        '             ng-class-even="\'gantt-background-row-alt\'"\n' +
        '             ng-class="row.classes" ng-style="{\'background-color\': row.color, \'height\': row.height}">\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Row header template -->\n' +
        '    <script type="text/ng-template" id="template/default.rowHeader.tmpl.html">\n' +
        '        <div class="gantt-labels-header-row"\n' +
        '             ng-show="gantt.columnsManager.columns.length > 0 && gantt.columnsManager.getActiveHeadersCount() > 0"\n' +
        '             ng-style="{\'margin-top\': ((gantt.columnsManager.getActiveHeadersCount()-1)*2)+\'em\'}">\n' +
        '            <span>Name</span>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Labels template -->\n' +
        '    <script type="text/ng-template" id="template/default.labels.tmpl.html">\n' +
        '        <div ng-transclude ng-if="showLabelsColumn" class="gantt-labels"\n' +
        '             ng-style="(labelsWidth > 0 && {\'width\': labelsWidth+\'px\'} || {})"\n' +
        '             gantt-labels-resize="$parent.allowLabelsResizing"\n' +
        '             gantt-labels-resize-width="$parent.labelsWidth"\n' +
        '             gantt-labels-resize-min-width="50"\n' +
        '             gantt-element-width-listener="$parent.labelsWidth"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Header columns template -->\n' +
        '    <script type="text/ng-template" id="template/default.headerColumns.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-header-columns"\n' +
        '              gantt-horizontal-scroll-receiver></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/default.columnHeader.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-column-header"\n' +
        '              ng-style="{\'left\': column.left+\'px\', \'width\': column.width+\'px\'}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Body columns template -->\n' +
        '    <script type="text/ng-template" id="template/default.bodyColumns.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-columns"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/default.column.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-column"\n' +
        '             ng-class="(column.currentDate && currentDate === \'column\') && \'gantt-foreground-col-current-date\' || \'gantt-foreground-col\'"\n' +
        '             ng-style="{\'left\': column.left+\'px\', \'width\': column.width+\'px\'}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <script type="text/ng-template" id="template/default.timeFrame.tmpl.html">\n' +
        '        <div class="gantt-timeframe"\n' +
        '             ng-class="getClass()"\n' +
        '             ng-style="{\'left\': timeFrame.left + \'px\', \'width\': timeFrame.width + \'px\', \'background-color\': timeFrame.color && timeFrame.color || \'\'}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Scrollable template -->\n' +
        '    <script type="text/ng-template" id="template/default.scrollable.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-scrollable" gantt-scroll-sender gantt-limit-updater\n' +
        '             ng-style="getScrollableCss()"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Rows template -->\n' +
        '    <script type="text/ng-template" id="template/default.bodyRows.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-body-rows"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Task template -->\n' +
        '    <script type="text/ng-template" id="template/default.task.tmpl.html">\n' +
        '        <div ng-class="(task.isMilestone === true && [\'gantt-task-milestone\'] || [\'gantt-task\']).concat(task.classes)"\n' +
        '             ng-style="{\'left\': ((task.isMilestone === true || task.width === 0) && (task.left-0.3) || task.left)+\'px\', \'width\': task.width +\'px\', \'z-index\': (task.isMoving === true && 1  || task.priority || \'\'), \'background-color\': task.color}">\n' +
        '            <gantt-bounds ng-if="task.bounds !== undefined" ng-model="task"></gantt-bounds>\n' +
        '            <gantt-tooltip ng-if="showTooltips && (task.isMouseOver || task.isMoving)" ng-model="task"></gantt-tooltip>\n' +
        '            <div ng-if="task.truncatedLeft" class="gantt-task-truncated-left"><span>&lt;</span></div>\n' +
        '            <div class="gantt-task-content"><span>{{ (task.isMilestone === true && \'&nbsp;\' || task.name) }}</span></div>\n' +
        '            <div ng-if="task.truncatedRight" class="gantt-task-truncated-right"><span>&gt;</span></div>\n' +
        '            <gantt-task-progress ng-if="task.progress !== undefined" gantt-task-progress-value="task.progress"></gantt-task-progress>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Tooltip template -->\n' +
        '    <script type="text/ng-template" id="template/default.tooltip.tmpl.html">\n' +
        '        <div class="gantt-task-info" ng-style="css">\n' +
        '            <div class="gantt-task-info-content">\n' +
        '                {{ task.name }}</br>\n' +
        '                <small>\n' +
        '                    {{\n' +
        '                    task.isMilestone === true && (task.getFromLabel()) || (task.getFromLabel() + \' - \' + task.getToLabel());\n' +
        '                    }}\n' +
        '                </small>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Task bounds template -->\n' +
        '    <script type="text/ng-template" id="template/default.bounds.tmpl.html">\n' +
        '        <div ng-show=\'visible\' class=\'gantt-task-bounds\'\n' +
        '             ng-style=\'getCss()\' ng-class=\'getClass()\'></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Task progress template -->\n' +
        '    <script type="text/ng-template" id="template/default.taskProgress.tmpl.html">\n' +
        '        <div class=\'gantt-task-progress\' ng-style="getCss()" ng-class="progress.classes"></div>\n' +
        '    </script>\n' +
        '\n' +
        '    <!-- Row template -->\n' +
        '    <script type="text/ng-template" id="template/default.row.tmpl.html">\n' +
        '        <div ng-transclude class="gantt-row gantt-row-height" ng-style="{\'height\': row.height}"></div>\n' +
        '    </script>\n' +
        '\n' +
        '</div>\n' +
        '');
}]);

//# sourceMappingURL=angular-gantt.js.map
