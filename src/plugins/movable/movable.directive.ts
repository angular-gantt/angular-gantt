import angular from 'angular';

export default function (ganttMouseButton, ganttMouseOffset, ganttSmartEvent, ganttMovableOptions, ganttUtils, ganttDom, $window, $document, $timeout) {
  'ngInject';
  // Provides moving and resizing of tasks
  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      allowMoving: '=?',
      allowResizing: '=?',
      allowRowSwitching: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api;

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.movable) === 'object') {
        for (let option in scope.options.movable) {
          scope[option] = scope.options.movable[option];
        }
      }

      ganttMovableOptions.initialize(scope);

      api.registerEvent('tasks', 'move');
      api.registerEvent('tasks', 'moveBegin');
      api.registerEvent('tasks', 'moveEnd');
      api.registerEvent('tasks', 'resize');
      api.registerEvent('tasks', 'resizeBegin');
      api.registerEvent('tasks', 'resizeEnd');
      api.registerEvent('tasks', 'change');

      let _hasTouch = ('ontouchstart' in $window) || $window.DocumentTouch && $document[0] instanceof $window.DocumentTouch;
      let _pressEvents = 'touchstart mousedown';
      let _moveEvents = 'touchmove mousemove';
      let _releaseEvents = 'touchend mouseup';

      let taskWithSmallWidth = 15;
      let resizeAreaWidthBig = 5;
      let resizeAreaWidthSmall = 3;
      let scrollSpeed = 15;
      let scrollTriggerDistance = 5;
      let mouseStartOffsetX;
      let moveStartX;

      // tslint:disable:no-use-before-declare
      api.directives.on.new(scope, function (directiveName, taskScope, taskElement) {
        if (directiveName === 'ganttTask') {
          let windowElement = angular.element($window);
          let ganttBodyElement = taskScope.row.rowsManager.gantt.body.$element;
          let ganttScrollElement = taskScope.row.rowsManager.gantt.scroll.$element;

          let taskHasBeenChanged = false;
          let taskHasBeenMovedFromAnotherRow = false;
          let scrollInterval;

          let foregroundElement = taskScope.task.getForegroundElement();

          // IE<11 doesn't support `pointer-events: none`
          // So task content element must be added to support moving properly.
          let contentElement = taskScope.task.getContentElement();

          let onPressEvents = function (evt) {
            evt.preventDefault();
            if (_hasTouch) {
              evt = ganttMouseOffset.getTouch(evt);
            }
            let taskMovable = taskScope.task.model.movable;
            let rowMovable = taskScope.task.row.model.movable;

            if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
              taskMovable = {enabled: taskMovable};
            }

            if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
              rowMovable = {enabled: rowMovable};
            }

            let enabledValue = ganttUtils.firstProperty([taskMovable, rowMovable], 'enabled', scope.enabled);
            let enabled = angular.isFunction(enabledValue) ? enabledValue(evt, taskScope.task) : enabledValue;
            if (enabled) {
              let taskOffsetX = ganttMouseOffset.getOffsetForElement(foregroundElement[0], evt).x;
              let mode = getMoveMode(taskOffsetX);
              if (mode !== '' && ganttMouseButton.getButton(evt) === 1) {
                let bodyOffsetX = ganttMouseOffset.getOffsetForElement(ganttBodyElement[0], evt).x;
                enableMoveMode(mode, bodyOffsetX);
              }
              taskScope.$digest();
            }
          };
          foregroundElement.on(_pressEvents, onPressEvents);
          contentElement.on(_pressEvents, onPressEvents);

          let onMousemove = function (evt) {
            let taskMovable = taskScope.task.model.movable;
            let rowMovable = taskScope.task.row.model.movable;

            if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
              taskMovable = {enabled: taskMovable};
            }

            if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
              rowMovable = {enabled: rowMovable};
            }

            let enabledValue = ganttUtils.firstProperty([taskMovable, rowMovable], 'enabled', scope.enabled);
            let enabled = angular.isFunction(enabledValue) ? enabledValue(evt, taskScope.task) : enabledValue;
            if (enabled && !taskScope.task.isMoving) {
              let taskOffsetX = ganttMouseOffset.getOffsetForElement(foregroundElement[0], evt).x;
              let mode = getMoveMode(taskOffsetX);
              if (mode !== '' && mode !== 'M') {
                foregroundElement.css('cursor', getCursor(mode));
                contentElement.css('cursor', getCursor(mode));
              } else {
                foregroundElement.css('cursor', '');
                contentElement.css('cursor', '');
              }
            }
          };
          foregroundElement.on('mousemove', onMousemove);
          contentElement.on('mousemove', onMousemove);

          let handleMove = function (evt) {
            if (taskScope.task.isMoving && !taskScope.destroyed) {
              clearScrollInterval();
              moveTask(evt);
              scrollScreen(evt);
            }
          };

          let moveTask = function (evt) {
            let oldTaskHasBeenChanged = taskHasBeenChanged;

            let mousePos = ganttMouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
            let x = mousePos.x;
            taskScope.task.mouseOffsetX = x;
            let taskOutOfRange = taskScope.task.row.rowsManager.gantt.options.value('taskOutOfRange');

            let taskMovable = taskScope.task.model.movable;
            let rowMovable = taskScope.task.row.model.movable;

            if (typeof(taskMovable) === 'boolean' || angular.isFunction(taskMovable)) {
              taskMovable = {enabled: taskMovable};
            }

            if (typeof(rowMovable) === 'boolean' || angular.isFunction(rowMovable)) {
              rowMovable = {enabled: rowMovable};
            }

            if (taskScope.task.moveMode === 'M') {
              let allowRowSwitching = ganttUtils.firstProperty([taskMovable, rowMovable], 'allowRowSwitching', scope.allowRowSwitching);
              if (allowRowSwitching) {
                let scrollRect = ganttScrollElement[0].getBoundingClientRect();
                let rowCenterLeft = scrollRect.left + scrollRect.width / 2;
                let ganttBody = angular.element($document[0].querySelectorAll('.gantt-body'));
                ganttBody.css('pointer-events', 'auto'); // pointer-events must be enabled for following to work.
                let targetRowElement = ganttDom.findElementFromPoint(rowCenterLeft, evt.clientY, function (element) {
                  return angular.element(element).hasClass('gantt-row');
                });
                ganttBody.css('pointer-events', '');

                let rows = ganttCtrl.gantt.rowsManager.rows;
                let targetRow;

                // tslint:disable:one-variable-per-declaration
                for (let i = 0, l = rows.length; i < l; i++) {
                  if (targetRowElement === rows[i].$element[0]) {
                    targetRow = rows[i];
                    break;
                  }
                }

                let sourceRow = taskScope.task.row;

                if (targetRow !== undefined && sourceRow !== targetRow) {
                  if (!angular.isFunction(allowRowSwitching) || allowRowSwitching(taskScope.task, targetRow)) {
                    targetRow.moveTaskToRow(taskScope.task, true);
                    taskHasBeenChanged = true;
                  }
                }
              }

              let allowMoving = ganttUtils.firstProperty([taskMovable, rowMovable], 'allowMoving', scope.allowMoving);
              if (allowMoving) {
                x = x - mouseStartOffsetX;

                if (taskOutOfRange !== 'truncate') {
                  if (x < 0) {
                    x = 0;
                  } else if (x + taskScope.task.width >= taskScope.gantt.width) {
                    x = taskScope.gantt.width - taskScope.task.width;
                  }
                }

                taskScope.task.moveTo(x, true);
                taskScope.$digest();

                if (taskHasBeenChanged) {
                  taskScope.row.rowsManager.gantt.api.tasks.raise.move(taskScope.task);
                }
                taskHasBeenChanged = true;
              }
            } else if (taskScope.task.moveMode === 'E') {
              if (x <= taskScope.task.left) {
                x = taskScope.task.left;
                taskScope.task.moveMode = 'W';
                setGlobalCursor(getCursor(taskScope.task.moveMode));
              }

              if (taskOutOfRange !== 'truncate' && x >= taskScope.gantt.width) {
                x = taskScope.gantt.width;
              }

              taskScope.task.setTo(x, true);
              taskScope.$digest();

              if (taskHasBeenChanged) {
                taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
              }
              taskHasBeenChanged = true;
            } else {
              if (x > taskScope.task.left + taskScope.task.width) {
                x = taskScope.task.left + taskScope.task.width;
                taskScope.task.moveMode = 'E';
                setGlobalCursor(getCursor(taskScope.task.moveMode));
              }

              if (taskOutOfRange !== 'truncate' && x < 0) {
                x = 0;
              }

              taskScope.task.setFrom(x, true);
              taskScope.$digest();

              if (taskHasBeenChanged) {
                taskScope.row.rowsManager.gantt.api.tasks.raise.resize(taskScope.task);
              }
              taskHasBeenChanged = true;
            }

            if (!oldTaskHasBeenChanged && taskHasBeenChanged && !taskHasBeenMovedFromAnotherRow) {
              if (taskScope.task.moveMode === 'M') {
                taskScope.row.rowsManager.gantt.api.tasks.raise.moveBegin(taskScope.task);
              } else {
                taskScope.row.rowsManager.gantt.api.tasks.raise.resizeBegin(taskScope.task);
              }
            }
          };

          let scrollScreen = function (evt) {
            let mousePos = ganttMouseOffset.getOffsetForElement(ganttBodyElement[0], evt);
            let leftScreenBorder = ganttScrollElement[0].scrollLeft;
            let screenWidth = ganttScrollElement[0].offsetWidth;
            let scrollWidth = ganttScrollElement[0].scrollWidth;
            let rightScreenBorder = leftScreenBorder + screenWidth;
            let keepOnScrolling = false;

            if (mousePos.x < moveStartX) {
              // Scroll to the left
              if (leftScreenBorder > 0 && mousePos.x <= leftScreenBorder + scrollTriggerDistance) {
                mousePos.x -= scrollSpeed;
                keepOnScrolling = true;
                taskScope.row.rowsManager.gantt.api.scroll.left(scrollSpeed);
              }
            } else {
              // Scroll to the right
              if (rightScreenBorder < scrollWidth && mousePos.x >= rightScreenBorder - scrollTriggerDistance) {
                mousePos.x += scrollSpeed;
                keepOnScrolling = true;
                taskScope.row.rowsManager.gantt.api.scroll.right(scrollSpeed);
              }
            }

            if (keepOnScrolling) {
              scrollInterval = $timeout(function () {
                handleMove(evt);
              }, 100, true);
            }
          };

          let clearScrollInterval = function () {
            if (scrollInterval !== undefined) {
              $timeout.cancel(scrollInterval);
              scrollInterval = undefined;
            }
          };

          let getMoveMode = function (x) {
            let distance = 0;

            let taskMovable = taskScope.task.model.movable;
            let rowMovable = taskScope.task.row.model.movable;

            if (typeof(taskMovable) === 'boolean') {
              taskMovable = {enabled: taskMovable};
            }

            if (typeof(rowMovable) === 'boolean') {
              rowMovable = {enabled: rowMovable};
            }

            let allowResizing = ganttUtils.firstProperty([taskMovable, rowMovable], 'allowResizing', scope.allowResizing);
            let allowRowSwitching = ganttUtils.firstProperty([taskMovable, rowMovable], 'allowRowSwitching', scope.allowRowSwitching);
            let allowMoving = ganttUtils.firstProperty([taskMovable, rowMovable], 'allowMoving', scope.allowMoving);

            // Define resize&move area. Make sure the move area does not get too small.
            if (allowResizing) {
              distance = foregroundElement[0].offsetWidth < taskWithSmallWidth ? resizeAreaWidthSmall : resizeAreaWidthBig;
            }

            if (allowResizing && x > foregroundElement[0].offsetWidth - distance) {
              return 'E';
            } else if (allowResizing && x < distance) {
              return 'W';
            } else if ((allowMoving || allowRowSwitching) && x >= distance && x <= foregroundElement[0].offsetWidth - distance) {
              return 'M';
            } else {
              return '';
            }
          };

          let getCursor = function (mode) {
            switch (mode) {
              case 'E':
                return 'e-resize';
              case 'W':
                return 'w-resize';
              case 'M':
                return 'move';
            }
          };

          let setGlobalCursor = function (cursor) {
            taskElement.css('cursor', cursor);
            angular.element($document[0].body).css({
              '-moz-user-select': cursor === '' ? '' : '-moz-none',
              '-webkit-user-select': cursor === '' ? '' : 'none',
              '-ms-user-select': cursor === '' ? '' : 'none',
              'user-select': cursor === '' ? '' : 'none',
              'cursor': cursor
            });
          };

          let enableMoveMode = function (mode, x) {
            // Clone taskModel
            if (taskScope.task.originalModel === undefined) {
              taskScope.task.originalRow = taskScope.task.row;
              taskScope.task.originalModel = taskScope.task.model;
              taskScope.task.model = angular.copy(taskScope.task.originalModel);
            }

            // Init mouse start variables
            if (!taskHasBeenMovedFromAnotherRow) {
              moveStartX = x;
              mouseStartOffsetX = x - taskScope.task.modelLeft;
            }

            // Init task move
            taskHasBeenChanged = false;
            taskScope.task.moveMode = mode;
            taskScope.task.isMoving = true;
            taskScope.task.active = true;

            // Apply CSS style
            let taskElement = taskScope.task.$element;
            if (taskScope.task.moveMode === 'M') {
              taskElement.addClass('gantt-task-resizing');
            } else {
              taskElement.addClass('gantt-task-moving');
            }

            // Add move event handler
            let taskMoveHandler = function (evt) {
              evt.stopImmediatePropagation();
              if (_hasTouch) {
                evt = ganttMouseOffset.getTouch(evt);
              }

              handleMove(evt);
            };
            let moveSmartEvent = ganttSmartEvent(taskScope, windowElement, _moveEvents, taskMoveHandler);
            moveSmartEvent.bind();

            // Remove move event handler on mouse up / touch end
            ganttSmartEvent(taskScope, windowElement, _releaseEvents, function (evt) {
              if (_hasTouch) {
                evt = ganttMouseOffset.getTouch(evt);
              }
              moveSmartEvent.unbind();
              disableMoveMode();
              taskScope.$digest();
            }).bindOnce();

            setGlobalCursor(getCursor(mode));
          };

          let disableMoveMode = function () {
            if (taskScope.task.originalModel !== undefined) {

              taskScope.task.originalModel.from = taskScope.task.model.from;
              taskScope.task.originalModel.to = taskScope.task.model.to;
              taskScope.task.originalModel.lct = taskScope.task.model.lct;
              taskScope.task.originalModel.est = taskScope.task.model.est;

              taskScope.task.model = taskScope.task.originalModel;
              if (taskScope.task.row.model.id !== taskScope.task.originalRow.model.id) {
                let targetRow = taskScope.task.row;
                targetRow.removeTask(taskScope.task.model.id, false, true);
                taskScope.task.row = taskScope.task.originalRow;
                targetRow.moveTaskToRow(taskScope.task, false);
              }
              delete taskScope.task.originalModel;
              delete taskScope.task.originalRow;

              taskScope.$apply();
            }

            taskHasBeenMovedFromAnotherRow = false;
            taskScope.task.isMoving = false;
            taskScope.task.active = false;

            // Remove CSS class
            let taskElement = taskScope.task.$element;
            taskElement.removeClass('gantt-task-moving');
            taskElement.removeClass('gantt-task-resizing');

            // Stop any active auto scroll
            clearScrollInterval();

            // Set mouse cursor back to default
            setGlobalCursor('');

            // Raise task changed event
            if (taskHasBeenChanged === true) {
              // Raise move end event
              if (taskScope.task.moveMode === 'M') {
                taskScope.row.rowsManager.gantt.api.tasks.raise.moveEnd(taskScope.task);
              } else {
                taskScope.row.rowsManager.gantt.api.tasks.raise.resizeEnd(taskScope.task);
              }

              taskHasBeenChanged = false;
              taskScope.task.row.sortTasks(); // Sort tasks so they have the right z-order
              taskScope.row.rowsManager.gantt.api.tasks.raise.change(taskScope.task);
            }

            taskScope.task.moveMode = undefined;
          };

          // Stop scroll cycle (if running) when scope is destroyed.
          // This is needed when the task is moved to a new row during scroll because
          // the old scope will continue to scroll otherwise
          taskScope.$on('$destroy', function () {
            taskScope.destroyed = true;
            clearScrollInterval();
          });

          if (taskScope.task.isResizing) {
            taskHasBeenMovedFromAnotherRow = true;
            enableMoveMode('E', taskScope.task.mouseOffsetX);
            delete taskScope.task.isResizing;
          } else if (taskScope.task.isMoving) {
            // In case the task has been moved to another row a new controller is created by angular.
            // Enable the move mode again if this was the case.
            taskHasBeenMovedFromAnotherRow = true;
            enableMoveMode('M', taskScope.task.mouseOffsetX);
          }
        }
      });
    }
  };
}
