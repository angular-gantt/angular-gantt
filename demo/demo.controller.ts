import angular from 'angular'

import moment from 'moment'

export default function ($scope, $timeout, $log, ganttUtils, GanttObjectModel, DemoService, ganttMouseOffset, ganttDebounce) {
  'ngInject'

  let objectModel
  let dataToRemove

  // Event handler
  let logScrollEvent = function (left, date, direction) {
    if (date !== undefined) {
      $log.info('[Event] api.on.scroll: ' + left + ', ' + (date === undefined ? 'undefined' : date.format()) + ', ' + direction)
    }
  }

  // Event handler
  let logDataEvent = function (eventName) {
    $log.info('[Event] ' + eventName)
  }

  // Event handler
  let logTaskEvent = function (eventName, task) {
    $log.info('[Event] ' + eventName + ': ' + task.model.name)
  }

  // Event handler
  let logRowEvent = function (eventName, row) {
    $log.info('[Event] ' + eventName + ': ' + row.model.name)
  }

  // Event handler
  let logTimespanEvent = function (eventName, timespan) {
    $log.info('[Event] ' + eventName + ': ' + timespan.model.name)
  }

  // Event handler
  let logLabelsEvent = function (eventName, width) {
    $log.info('[Event] ' + eventName + ': ' + width)
  }

  // Event handler
  let logColumnsGenerateEvent = function (columns, headers) {
    $log.info('[Event] ' + 'columns.on.generate' + ': ' + columns.length + ' column(s), ' + headers.length + ' header(s)')
  }

  // Event handler
  let logRowsFilterEvent = function (rows, filteredRows) {
    $log.info('[Event] rows.on.filter: ' + filteredRows.length + '/' + rows.length + ' rows displayed.')
  }

  // Event handler
  let logTasksFilterEvent = function (tasks, filteredTasks) {
    $log.info('[Event] tasks.on.filter: ' + filteredTasks.length + '/' + tasks.length + ' tasks displayed.')
  }

  // Event handler
  let logReadyEvent = function () {
    $log.info('[Event] core.on.ready')
  }

  // Event utility function
  let addEventName = function (eventName, func) {
    return function (data) {
      return func(eventName, data)
    }
  }

  // angular-gantt options
  $scope.options = {
    mode: 'custom',
    scale: 'day',
    sortMode: undefined,
    sideMode: 'TreeTable',
    daily: false,
    maxHeight: false,
    width: false,
    zoom: 1,
    columns: ['model.name', 'from', 'to'],
    treeTableColumns: ['from', 'to'],
    columnsHeaders: {'model.name': 'Name', 'from': 'From', 'to': 'To'},
    columnsClasses: {'model.name': 'gantt-column-name', 'from': 'gantt-column-from', 'to': 'gantt-column-to'},
    columnsFormatters: {
      'from': function (from) {
        return from !== undefined ? from.format('lll') : undefined
      },
      'to': function (to) {
        return to !== undefined ? to.format('lll') : undefined
      }
    },
    treeHeaderContent: '<i class="fa fa-align-justify"></i> {{getHeader()}}',
    columnsHeaderContents: {
      'model.name': '<i class="fa fa-align-justify"></i> {{getHeader()}}',
      'from': '<i class="fa fa-calendar"></i> {{getHeader()}}',
      'to': '<i class="fa fa-calendar"></i> {{getHeader()}}'
    },
    autoExpand: 'none',
    taskOutOfRange: 'truncate',
    fromDate: moment(null),
    toDate: undefined,
    rowContent: '<i class="fa fa-align-justify"></i> {{row.model.name}}',
    taskContent: '<i class="fa fa-tasks"></i> {{task.model.name}}',
    allowSideResizing: true,
    labelsEnabled: true,
    currentDate: 'line',
    currentDateValue: new Date(2013, 9, 23, 11, 20, 0),
    draw: false,
    readOnly: false,
    groupDisplayMode: 'group',
    filterTask: '',
    filterRow: '',
    timeFrames: {
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
    },
    dateFrames: {
      'weekend': {
        evaluator: function (date) {
          return date.isoWeekday() === 6 || date.isoWeekday() === 7
        },
        targets: ['weekend']
      },
      '11-november': {
        evaluator: function (date) {
          return date.month() === 10 && date.date() === 11
        },
        targets: ['holiday']
      }
    },
    timeFramesWorkingMode: 'hidden',
    timeFramesNonWorkingMode: 'visible',
    columnMagnet: '15 minutes',
    timeFramesMagnet: true,
    dependencies: {
      enabled: true,
      conflictChecker: true
    },
    movable: {
      allowRowSwitching: function (task, targetRow) {
        return task.row.model.name !== 'Milestones' && targetRow.model.name !== 'Milestones'
      }
    },
    corner: {
      headersLabels: function (key) {
        return key.charAt(0).toUpperCase() + key.slice(1)
      },
      headersLabelsTemplates: '{{getLabel(header)}} <i class="fa fa-calendar"></i>'
    },
    targetDataAddRowIndex: undefined,
    canDraw: function (event) {
      let isLeftMouseButton = event.button === 0 || event.button === 1
      return $scope.options.draw && !$scope.options.readOnly && isLeftMouseButton
    },
    drawTaskFactory: function () {
      return {
        id: ganttUtils.randomUuid(),  // Unique id of the task.
        name: 'Drawn task', // Name shown on top of each task.
        color: '#AA8833' // Color of the task in HEX format (Optional).
      }
    },
    api: function (api) {
      // API Object is used to control methods and events from angular-gantt.
      $scope.api = api

      api.core.on.ready($scope, function () {
        // Log various events to console
        api.scroll.on.scroll($scope, logScrollEvent)
        api.core.on.ready($scope, logReadyEvent)

        api.data.on.remove($scope, addEventName('data.on.remove', logDataEvent))
        api.data.on.load($scope, addEventName('data.on.load', logDataEvent))
        api.data.on.clear($scope, addEventName('data.on.clear', logDataEvent))
        api.data.on.change($scope, addEventName('data.on.change', logDataEvent))

        api.tasks.on.add($scope, addEventName('tasks.on.add', logTaskEvent))
        api.tasks.on.change($scope, addEventName('tasks.on.change', logTaskEvent))
        api.tasks.on.rowChange($scope, addEventName('tasks.on.rowChange', logTaskEvent))
        api.tasks.on.remove($scope, addEventName('tasks.on.remove', logTaskEvent))

        if (api.tasks.on.moveBegin) {
          api.tasks.on.moveBegin($scope, addEventName('tasks.on.moveBegin', logTaskEvent))
          // api.tasks.on.move($scope, addEventName('tasks.on.move', logTaskEvent));
          api.tasks.on.moveEnd($scope, addEventName('tasks.on.moveEnd', logTaskEvent))

          api.tasks.on.resizeBegin($scope, addEventName('tasks.on.resizeBegin', logTaskEvent))
          // api.tasks.on.resize($scope, addEventName('tasks.on.resize', logTaskEvent));
          api.tasks.on.resizeEnd($scope, addEventName('tasks.on.resizeEnd', logTaskEvent))
        }

        if (api.tasks.on.drawBegin) {
          api.tasks.on.drawBegin($scope, addEventName('tasks.on.drawBegin', logTaskEvent))
          // api.tasks.on.draw($scope, addEventName('tasks.on.draw', logTaskEvent));
          api.tasks.on.drawEnd($scope, addEventName('tasks.on.drawEnd', logTaskEvent))
        }

        api.rows.on.add($scope, addEventName('rows.on.add', logRowEvent))
        api.rows.on.change($scope, addEventName('rows.on.change', logRowEvent))
        api.rows.on.move($scope, addEventName('rows.on.move', logRowEvent))
        api.rows.on.remove($scope, addEventName('rows.on.remove', logRowEvent))

        api.side.on.resizeBegin($scope, addEventName('labels.on.resizeBegin', logLabelsEvent))
        // api.side.on.resize($scope, addEventName('labels.on.resize', logLabelsEvent));
        api.side.on.resizeEnd($scope, addEventName('labels.on.resizeEnd', logLabelsEvent))

        api.timespans.on.add($scope, addEventName('timespans.on.add', logTimespanEvent))
        api.columns.on.generate($scope, logColumnsGenerateEvent)

        api.rows.on.filter($scope, logRowsFilterEvent)
        api.tasks.on.filter($scope, logTasksFilterEvent)

        api.data.on.change($scope, function (newData) {
          if (dataToRemove === undefined) {
            dataToRemove = [
              {'id': newData[2].id}, // Remove Kickoff row
              {
                'id': newData[0].id, 'tasks': [
                {'id': newData[0].tasks[0].id},
                {'id': newData[0].tasks[3].id}
                ]
              }, // Remove some Milestones
              {
                'id': newData[7].id, 'tasks': [
                {'id': newData[7].tasks[0].id}
                ]
              } // Remove order basket from Sprint 2
            ]
          }
        })

        // When gantt is ready, load data.
        // `data` attribute could have been used too.
        $scope.load()

        // Add some DOM events
        api.directives.on.new($scope, function (directiveName, directiveScope, element) {
          if (directiveName === 'ganttTask') {
            element.bind('click', function (event) {
              event.stopPropagation()
              logTaskEvent('task-click', directiveScope.task)
            })
            element.bind('mousedown touchstart', function (event) {
              event.stopPropagation()
              $scope.live.row = directiveScope.task.row.model
              if (directiveScope.task.originalModel !== undefined) {
                $scope.live.task = directiveScope.task.originalModel
              } else {
                $scope.live.task = directiveScope.task.model
              }
              $scope.$digest()
            })
          } else if (directiveName === 'ganttRow') {
            element.bind('click', function (event) {
              event.stopPropagation()
              logRowEvent('row-click', directiveScope.row)
            })
            element.bind('mousedown touchstart', function (event) {
              event.stopPropagation()
              $scope.live.row = directiveScope.row.model
              $scope.$digest()
            })
          } else if (directiveName === 'ganttRowLabel') {
            element.bind('click', function () {
              logRowEvent('row-label-click', directiveScope.row)
            })
            element.bind('mousedown touchstart', function () {
              $scope.live.row = directiveScope.row.model
              $scope.$digest()
            })
          }
        })

        api.tasks.on.rowChange($scope, function (task) {
          $scope.live.row = task.row.model
        })

        objectModel = new GanttObjectModel(api)
      })
    }
  }

  $scope.handleTaskIconClick = function (taskModel) {
    alert('Icon from ' + taskModel.name + ' task has been clicked.')
  }

  $scope.handleRowIconClick = function (rowModel) {
    alert('Icon from ' + rowModel.name + ' row has been clicked.')
  }

  $scope.expandAll = function () {
    $scope.api.tree.expandAll()
  }

  $scope.collapseAll = function () {
    $scope.api.tree.collapseAll()
  }

  $scope.$watch('options.sideMode', function (newValue, oldValue) {
    if (newValue !== oldValue) {
      $scope.api.side.setWidth(undefined)
      $timeout(function () {
        $scope.api.columns.refresh()
      })
    }
  })

  $scope.canAutoWidth = function (scale) {
    if (scale.match(/.*?hour.*?/) || scale.match(/.*?minute.*?/)) {
      return false
    }
    return true
  }

  $scope.getColumnWidth = function (widthEnabled, scale, zoom) {
    if (!widthEnabled && $scope.canAutoWidth(scale)) {
      return undefined
    }

    if (scale.match(/.*?week.*?/)) {
      return 150 * zoom
    }

    if (scale.match(/.*?month.*?/)) {
      return 300 * zoom
    }

    if (scale.match(/.*?quarter.*?/)) {
      return 500 * zoom
    }

    if (scale.match(/.*?year.*?/)) {
      return 800 * zoom
    }

    return 40 * zoom
  }

  // Reload data action
  $scope.load = function () {
    $scope.data = DemoService.getSampleData()
    dataToRemove = undefined

    $scope.timespans = DemoService.getSampleTimespans()
  }

  $scope.reload = function () {
    $scope.load()
  }

  // Remove data action
  $scope.remove = function () {
    $scope.api.data.remove(dataToRemove)
    $scope.api.dependencies.refresh()
  }

  // Clear data action
  $scope.clear = function () {
    $scope.data = []
  }

  // Add data to target row index
  $scope.addOverlapTaskToTargetRowIndex = function () {
    let targetDataAddRowIndex = parseInt($scope.options.targetDataAddRowIndex, 10)

    if (targetDataAddRowIndex) {
      let targetRow = $scope.data[$scope.options.targetDataAddRowIndex]

      if (targetRow && targetRow.tasks && targetRow.tasks.length > 0) {
        let firstTaskInRow = targetRow.tasks[0]
        let copiedColor = firstTaskInRow.color
        let firstTaskEndDate = firstTaskInRow.to.toDate()
        let overlappingFromDate = new Date(firstTaskEndDate)

        overlappingFromDate.setDate(overlappingFromDate.getDate() - 1)

        let overlappingToDate = new Date(overlappingFromDate)

        overlappingToDate.setDate(overlappingToDate.getDate() + 7)

        targetRow.tasks.push({
          'name': 'Overlapping',
          'from': overlappingFromDate,
          'to': overlappingToDate,
          'color': copiedColor
        })
      }
    }
  }

  // Visual two way binding.
  $scope.live = {}

  let debounceValue = 1000

  let listenTaskJson = ganttDebounce(function (taskJson) {
    if (taskJson !== undefined) {
      let task = angular.fromJson(taskJson)
      objectModel.cleanTask(task)
      let model = $scope.live.task
      angular.merge(model, task)
    }
  }, debounceValue)
  $scope.$watch('live.taskJson', listenTaskJson)

  let listenRowJson = ganttDebounce(function (rowJson) {
    if (rowJson !== undefined) {
      let row = angular.fromJson(rowJson)
      objectModel.cleanRow(row)
      let tasks = row.tasks

      delete row.tasks
      delete row.drawTask

      let rowModel = $scope.live.row

      angular.merge(rowModel, row)

      let newTasks = {}
      let i
      let l

      if (tasks !== undefined) {
        for (i = 0, l = tasks.length; i < l; i++) {
          objectModel.cleanTask(tasks[i])
        }

        for (i = 0, l = tasks.length; i < l; i++) {
          newTasks[tasks[i].id] = tasks[i]
        }

        if (rowModel.tasks === undefined) {
          rowModel.tasks = []
        }
        for (i = rowModel.tasks.length - 1; i >= 0; i--) {
          let existingTask = rowModel.tasks[i]
          let newTask = newTasks[existingTask.id]
          if (newTask === undefined) {
            rowModel.tasks.splice(i, 1)
          } else {
            objectModel.cleanTask(newTask)
            angular.merge(existingTask, newTask)
            delete newTasks[existingTask.id]
          }
        }
      } else {
        delete rowModel.tasks
      }

      angular.forEach(newTasks, function (newTask) {
        rowModel.tasks.push(newTask)
      })
    }
  }, debounceValue)
  $scope.$watch('live.rowJson', listenRowJson)

  $scope.$watchCollection('live.task', function (task) {
    $timeout(function () {
      $scope.live.taskJson = angular.toJson(task, true)
      $scope.live.rowJson = angular.toJson($scope.live.row, true)
    })
  })

  $scope.$watchCollection('live.row', function (row) {
    $timeout(function () {
      $scope.live.rowJson = angular.toJson(row, true)
      if (row !== undefined && row.tasks !== undefined && row.tasks.indexOf($scope.live.task) < 0) {
        $scope.live.task = row.tasks[0]
      }
    })

  })

  $scope.$watchCollection('live.row.tasks', function () {
    $timeout(function () {
      $scope.live.rowJson = angular.toJson($scope.live.row, true)
    })
  })

}
