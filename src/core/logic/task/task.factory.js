(function() {
    'use strict';
    angular.module('gantt').factory('GanttTask', [function() {
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
            var oldModelLeft = this.modelLeft;
            var oldModelWidth = this.modelWidth;
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

            if (this.modelLeft === undefined || this.modelWidth === undefined ||
                this.modelLeft + this.modelWidth < 0 || this.modelLeft > maxModelLeft) {
                this.left = undefined;
                this.width = undefined;
            } else {
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

                if (this.width < 0) {
                    this.left = this.left + this.width;
                    this.width = -this.width;
                }
            }

            this.updateView();
            if (!this.rowsManager.gantt.isRefreshingColumns &&
                (oldModelLeft !== this.modelLeft ||
                oldModelWidth !== this.modelWidth ||
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
                    this.$element.css('display', '');

                    this.$element.css('left', this.left + 'px');
                    this.$element.css('width', this.width + 'px');

                    if (this.model.priority > 0) {
                        this.$element.css('z-index', this.model.priority);
                    }

                    this.$element.toggleClass('gantt-task-milestone', this.isMilestone());
                    this.$element.toggleClass('gantt-task', !this.isMilestone());
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

