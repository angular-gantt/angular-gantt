(function() {
    'use strict';
    angular.module('gantt').factory('GanttTask', ['moment', function(moment) {
        var Task = function(row, model) {
            this.rowsManager = row.rowsManager;
            this.row = row;
            this.model = model;
            this.truncatedLeft = false;
            this.truncatedRight = false;
        };

        Task.prototype.isMilestone = function() {
            return !this.model.to || this.model.from - this.model.to === 0;
        };

        Task.prototype.isOutOfRange = function() {
            var firstColumn = this.rowsManager.gantt.columnsManager.getFirstColumn();
            var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();

            return (firstColumn === undefined || this.model.to < firstColumn.date ||
                    lastColumn === undefined || this.model.from > lastColumn.endDate);
        };

        // Updates the pos and size of the task according to the from - to date
        Task.prototype.updatePosAndSize = function() {
            var oldViewLeft = this.left;
            var oldViewWidth = this.width;
            var oldTruncatedRight = this.truncatedRight;
            var oldTruncatedLeft = this.truncatedLeft;

            if (!this.isMoving && this.isOutOfRange()) {
                this.modelLeft = undefined;
                this.modelWidth = undefined;
            } else {
                this.modelLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
                this.modelWidth = this.rowsManager.gantt.getPositionByDate(this.model.to) - this.modelLeft;
            }

            var lastColumn = this.rowsManager.gantt.columnsManager.getLastColumn();
            var maxModelLeft = lastColumn ? lastColumn.left + lastColumn.width : 0;

            var modelLeft = this.modelLeft;
            var modelWidth = this.modelWidth;

            if (this.rowsManager.gantt.options.value('daily')) {
                modelLeft = this.rowsManager.gantt.getPositionByDate(moment(this.model.from).startOf('day'));
                modelWidth = this.rowsManager.gantt.getPositionByDate(moment(this.model.to).endOf('day')) - modelLeft;
            }

            if (modelLeft === undefined || modelWidth === undefined ||
                modelLeft + modelWidth < 0 || modelLeft > maxModelLeft) {
                this.left = undefined;
                this.width = undefined;
            } else {
                this.left = Math.min(Math.max(modelLeft, 0), this.rowsManager.gantt.width);
                if (modelLeft < 0) {
                    this.truncatedLeft = true;
                    if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
                        this.truncatedRight = true;
                        this.width = this.rowsManager.gantt.width;
                    } else {
                        this.truncatedRight = false;
                        this.width = modelWidth + modelLeft;
                    }
                } else if (modelWidth + modelLeft > this.rowsManager.gantt.width) {
                    this.truncatedRight = true;
                    this.truncatedLeft = false;
                    this.width = this.rowsManager.gantt.width - modelLeft;
                } else {
                    this.truncatedLeft = false;
                    this.truncatedRight = false;
                    this.width = modelWidth;
                }

                if (this.width < 0) {
                    this.left = this.left + this.width;
                    this.width = -this.width;
                }
            }

            this.updateView();
            if (!this.rowsManager.gantt.isRefreshingColumns &&
                (oldViewLeft !== this.left ||
                oldViewWidth !== this.width ||
                oldTruncatedRight !== this.truncatedRight ||
                oldTruncatedLeft !== this.truncatedLeft)) {
                this.rowsManager.gantt.api.tasks.raise.viewChange(this);
            }
        };

        Task.prototype.updateView = function() {
            if (this.$element) {
                if (this.left === undefined || this.width === undefined) {
                    this.$element.css('display', 'none');
                } else {
                    this.$element.css({'left': this.left + 'px', 'width': this.width + 'px', 'display': ''});

                    if (this.model.priority > 0) {
                        var priority = this.model.priority;
                        angular.forEach(this.$element.children(), function(element) {
                            angular.element(element).css('z-index', priority);
                        });
                    }

                    this.$element.toggleClass('gantt-task-milestone', this.isMilestone());
                }
            }
        };

        Task.prototype.getBackgroundElement = function() {
            if (this.$element !== undefined) {
                var backgroundElement = this.$element[0].querySelector('.gantt-task-background');
                if (backgroundElement !== undefined) {
                    backgroundElement = angular.element(backgroundElement);
                }
                return backgroundElement;
            }
        };

        Task.prototype.getContentElement = function() {
            if (this.$element !== undefined) {
                var contentElement = this.$element[0].querySelector('.gantt-task-content');
                if (contentElement !== undefined) {
                    contentElement = angular.element(contentElement);
                }
                return contentElement;
            }
        };

        Task.prototype.getForegroundElement = function() {
            if (this.$element !== undefined) {
                var foregroundElement = this.$element[0].querySelector('.gantt-task-foreground');
                if (foregroundElement !== undefined) {
                    foregroundElement = angular.element(foregroundElement);
                }
                return foregroundElement;
            }
        };

        // Expands the start of the task to the specified position (in em)
        Task.prototype.setFrom = function(x, magnetEnabled) {
            this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
            this.row.setFromTo();
            this.updatePosAndSize();
        };

        // Expands the end of the task to the specified position (in em)
        Task.prototype.setTo = function(x, magnetEnabled) {
            this.model.to = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
            this.row.setFromTo();
            this.updatePosAndSize();
        };

        // Moves the task to the specified position (in em)
        Task.prototype.moveTo = function(x, magnetEnabled) {
            var newTaskRight;
            var newTaskLeft;
            if (x > this.modelLeft) {
                // Driven by right/to side.
                this.model.to = this.rowsManager.gantt.getDateByPosition(x + this.modelWidth, magnetEnabled);
                newTaskRight = this.rowsManager.gantt.getPositionByDate(this.model.to);
                newTaskLeft = newTaskRight - this.modelWidth;
                this.model.from = this.rowsManager.gantt.getDateByPosition(newTaskLeft, false);
            } else {
                // Drive by left/from side.
                this.model.from = this.rowsManager.gantt.getDateByPosition(x, magnetEnabled);
                newTaskLeft = this.rowsManager.gantt.getPositionByDate(this.model.from);
                newTaskRight = newTaskLeft + this.modelWidth;
                this.model.to = this.rowsManager.gantt.getDateByPosition(newTaskRight, false);
            }

            this.row.setFromTo();
            this.updatePosAndSize();
        };

        Task.prototype.clone = function() {
            return new Task(this.row, angular.copy(this.model));
        };

        return Task;
    }]);
}());

