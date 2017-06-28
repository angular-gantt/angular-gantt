import moment from 'moment'

import GanttUtilsService from '../../core/logic/util/utils.service'

export default function ($document, ganttMouseOffset, ganttUtils: GanttUtilsService) {
  'ngInject'
  return {
    restrict: 'E',
    require: '^gantt',
    scope: {
      enabled: '=?',
      moveThreshold: '=?',
      taskFactory: '=?'
    },
    link: function (scope, element, attrs, ganttCtrl) {
      let api = ganttCtrl.gantt.api

      // Load options from global options attribute.
      if (scope.options && typeof(scope.options.drawtask) === 'object') {
        for (let option in scope.options.drawtask) {
          scope[option] = scope.options.drawtask[option]
        }
      }

      if (scope.enabled === undefined) {
        scope.enabled = true
      }

      if (scope.moveThreshold === undefined) {
        scope.moveThreshold = 0
      }

      if (scope.taskFactory === undefined) {
        scope.taskFactory = function () {
          return {} // New empty task.
        }
      }

      api.registerEvent('tasks', 'draw')
      api.registerEvent('tasks', 'drawBegin')
      api.registerEvent('tasks', 'drawEnd')

      let newTaskModel = function (row) {
        if (row.model.drawTask && typeof(row.model.drawTask.taskFactory) === 'function') {
          return row.model.drawTask.taskFactory()
        } else {
          return scope.taskFactory()
        }
      }

      api.directives.on.new(scope, function (directiveName, directiveScope, element) {
        if (directiveName === 'ganttRow') {
          let addNewTask = function (x) {
            let startDate = api.core.getDateByPosition(x, true)
            let endDate = moment(startDate)

            let taskModel = newTaskModel(directiveScope.row)
            taskModel.from = startDate
            taskModel.to = endDate

            let task = directiveScope.row.addTask(taskModel)
            task.isResizing = true
            task.updatePosAndSize()
            directiveScope.row.updateVisibleTasks()

            directiveScope.row.$scope.$digest()

            return task
          }

          let addEventListeners = function (task) {
            let raiseDrawEvent = function () {
              directiveScope.row.rowsManager.gantt.api.tasks.raise.draw(task)
            }

            directiveScope.row.rowsManager.gantt.api.tasks.raise.drawBegin(task)

            $document.on('mousemove', raiseDrawEvent)

            $document.one('mouseup', function () {
              directiveScope.row.rowsManager.gantt.api.tasks.raise.drawEnd(task)
              $document.off('mousemove', raiseDrawEvent)
            })
          }

          let deferDrawing = function (startX) {
            let moveTrigger = function (evt) {
              let currentX = ganttMouseOffset.getOffset(evt).x

              if (Math.abs(startX - currentX) >= scope.moveThreshold) {
                element.off('mousemove', moveTrigger)
                let task = addNewTask(startX)
                addEventListeners(task)
              }
            }

            element.on('mousemove', moveTrigger)
            $document.one('mouseup', function () {
              element.off('mousemove', moveTrigger)
            })
          }

          let drawHandler = function (evt) {
            let evtTarget = (evt.target ? evt.target : evt.srcElement)

            let rowDrawTask = directiveScope.row.model.drawTask

            if (typeof(rowDrawTask) === 'boolean' || typeof(rowDrawTask) === 'function') {
              rowDrawTask = {enabled: rowDrawTask}
            }

            let enabledValue = ganttUtils.firstProperty([rowDrawTask], 'enabled', scope.enabled)
            let enabled = typeof(enabledValue) === 'function' ? enabledValue(evt, directiveScope.row) : enabledValue
            if (enabled && evtTarget.className.indexOf('gantt-row') > -1) {
              let x = ganttMouseOffset.getOffset(evt).x

              if (scope.moveThreshold === 0) {
                let task = addNewTask(x)
                addEventListeners(task)
              } else {
                deferDrawing(x)
              }
            }
          }

          element.on('mousedown', drawHandler)
          directiveScope.drawTaskHandler = drawHandler
        }
      })

      api.directives.on.destroy(scope, function (directiveName, directiveScope, element) {
        if (directiveName === 'ganttRow') {
          element.off('mousedown', directiveScope.drawTaskHandler)
          delete directiveScope.drawTaskHandler
        }
      })
    }
  }
}
