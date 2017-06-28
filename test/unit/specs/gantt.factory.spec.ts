// tslint:disable:no-unused-expression

import angular, {ICompileService, IRootScopeService, ITimeoutService} from 'angular'
import 'angular-mocks'

import jQuery from 'jquery'

import moment from 'moment'

import { expect } from 'chai'

describe('Gantt', function () {
  // Load the module with MainController
  beforeEach(angular.mock.module('gantt'))

  let Gantt
  let $rootScope: IRootScopeService
  let $compile: ICompileService
  let $timeout: ITimeoutService

  let mockData = [
    {
      name: 'Milestones',
      height: '3em',
      sortable: false,
      drawTask: false,
      classes: 'gantt-row-milestone',
      color: '#45607D',
      tasks: [
        // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
        {
          name: 'Kickoff',
          color: '#93C47D',
          from: '2013-10-07T09:00:00',
          to: '2013-10-07T10:00:00',
          data: 'Can contain any custom data or object'
        },
        {
          name: 'Concept approval',
          color: '#93C47D',
          from: new Date(2013, 9, 18, 18, 0, 0),
          to: new Date(2013, 9, 18, 18, 0, 0),
          est: new Date(2013, 9, 16, 7, 0, 0),
          lct: new Date(2013, 9, 19, 0, 0, 0)
        },
        {
          name: 'Development finished',
          color: '#93C47D',
          from: new Date(2013, 10, 15, 18, 0, 0),
          to: new Date(2013, 10, 15, 18, 0, 0)
        },
        {
          name: 'Shop is running',
          color: '#93C47D',
          from: new Date(2013, 10, 22, 12, 0, 0),
          to: new Date(2013, 10, 22, 12, 0, 0)
        },
        {
          name: 'Go-live',
          color: '#93C47D',
          from: new Date(2013, 10, 29, 16, 0, 0),
          to: new Date(2013, 10, 29, 16, 0, 0)
        }
      ],
      data: 'Can contain any custom data or object'
    },
    {
      name: 'Status meetings', tasks: [
        {name: 'Demo #1', color: '#9FC5F8', from: new Date(2013, 9, 25, 15, 0, 0), to: new Date(2013, 9, 25, 18, 30, 0)},
        {name: 'Demo #2', color: '#9FC5F8', from: new Date(2013, 10, 1, 15, 0, 0), to: new Date(2013, 10, 1, 18, 0, 0)},
        {name: 'Demo #3', color: '#9FC5F8', from: new Date(2013, 10, 8, 15, 0, 0), to: new Date(2013, 10, 8, 18, 0, 0)},
        {name: 'Demo #4', color: '#9FC5F8', from: new Date(2013, 10, 15, 15, 0, 0), to: new Date(2013, 10, 15, 18, 0, 0)},
        {name: 'Demo #5', color: '#9FC5F8', from: new Date(2013, 10, 24, 9, 0, 0), to: new Date(2013, 10, 24, 10, 0, 0)}
      ]
    },
    {
      name: 'Kickoff', movable: {allowResizing: false}, tasks: [
        {
          name: 'Day 1', color: '#9FC5F8', from: new Date(2013, 9, 7, 9, 0, 0), to: new Date(2013, 9, 7, 17, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}, movable: false
        },
        {
          name: 'Day 2', color: '#9FC5F8', from: new Date(2013, 9, 8, 9, 0, 0), to: new Date(2013, 9, 8, 17, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}
        },
        {
          name: 'Day 3', color: '#9FC5F8', from: new Date(2013, 9, 9, 8, 30, 0), to: new Date(2013, 9, 9, 12, 0, 0),
          progress: {percent: 100, color: '#3C8CF8'}
        }
      ]
    },
    {
      name: 'Create concept', tasks: [
        {
          name: 'Create concept',
          content: '<i class="fa fa-cog"></i>{{task.model.name}}',
          color: '#F1C232',
          from: new Date(2013, 9, 10, 8, 0, 0),
          to: new Date(2013, 9, 16, 18, 0, 0),
          est: new Date(2013, 9, 8, 8, 0, 0),
          lct: new Date(2013, 9, 18, 20, 0, 0),
          progress: 100
        }
      ]
    },
    {
      name: 'Finalize concept', tasks: [
        {
          name: 'Finalize concept',
          color: '#F1C232',
          from: new Date(2013, 9, 17, 8, 0, 0),
          to: new Date(2013, 9, 18, 18, 0, 0),
          progress: 100
        }
      ]
    },
    {
      name: 'Development',
      children: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4'],
      content: '<i class="fa fa-file-code-o"></i> {{row.model.name}}'
    },
    {
      name: 'Sprint 1', tooltips: false, tasks: [
        {
          name: 'Product list view',
          color: '#F1C232',
          from: new Date(2013, 9, 21, 8, 0, 0),
          to: new Date(2013, 9, 25, 15, 0, 0),
          progress: 25
        }
      ]
    },
    {
      name: 'Sprint 2', tasks: [
        {
          name: 'Order basket',
          color: '#F1C232',
          from: new Date(2013, 9, 28, 8, 0, 0),
          to: new Date(2013, 10, 1, 15, 0, 0)
        }
      ]
    },
    {
      name: 'Sprint 3', tasks: [
        {name: 'Checkout', color: '#F1C232', from: new Date(2013, 10, 4, 8, 0, 0), to: new Date(2013, 10, 8, 15, 0, 0)}
      ]
    },
    {
      name: 'Sprint 4', tasks: [
        {
          name: 'Login & Signup & Admin Views',
          color: '#F1C232',
          from: new Date(2013, 10, 11, 8, 0, 0),
          to: new Date(2013, 10, 15, 15, 0, 0)
        }
      ]
    },
    {name: 'Hosting', content: '<i class="fa fa-server"></i> {{row.model.name}}'},
    {
      name: 'Setup', tasks: [
        {name: 'HW', color: '#F1C232', from: new Date(2013, 10, 18, 8, 0, 0), to: new Date(2013, 10, 18, 12, 0, 0)}
      ]
    },
    {
      name: 'Config', tasks: [
        {
          name: 'SW / DNS/ Backups',
          color: '#F1C232',
          from: new Date(2013, 10, 18, 12, 0, 0),
          to: new Date(2013, 10, 21, 18, 0, 0)
        }
      ]
    },
    {name: 'Server', parent: 'Hosting', children: ['Setup', 'Config']},
    {
      name: 'Deployment', parent: 'Hosting', tasks: [
        {
          name: 'Depl. & Final testing',
          color: '#F1C232',
          from: new Date(2013, 10, 21, 8, 0, 0),
          to: new Date(2013, 10, 22, 12, 0, 0),
          'classes': 'gantt-task-deployment'
        }
      ]
    },
    {
      name: 'Workshop', tasks: [
        {
          name: 'On-side education',
          color: '#F1C232',
          from: new Date(2013, 10, 24, 9, 0, 0),
          to: new Date(2013, 10, 25, 15, 0, 0)
        }
      ]
    },
    {
      name: 'Content', tasks: [
        {
          name: 'Supervise content creation',
          color: '#F1C232',
          from: new Date(2013, 10, 26, 9, 0, 0),
          to: new Date(2013, 10, 29, 16, 0, 0)
        }
      ]
    },
    {
      name: 'Documentation', tasks: [
        {
          name: 'Technical/User documentation',
          color: '#F1C232',
          from: new Date(2013, 10, 26, 8, 0, 0),
          to: new Date(2013, 10, 28, 18, 0, 0)
        }
      ]
    }
  ]

  let checkData = function (data, ganttElement) {
    let tasks = []
    angular.forEach(data, function (row) {
      if (row.tasks) {
        tasks = tasks.concat(row.tasks)
      }
    })

    let rowElements = jQuery(ganttElement).find('div.gantt-body-rows div.gantt-row')
    let taskElements = jQuery(ganttElement).find('div.gantt-task')

    expect(rowElements.length).to.be.eq(data.length)
    expect(taskElements.length).to.be.eq(tasks.length)

    for (let i = 0; i < rowElements.length; i++) {
      let rowElement = jQuery(rowElements[i])

      let rowTaskElements = rowElement.find('div.gantt-task, div.gantt-task-milestone')
      let rowModel = data[i]

      for (let j = 0; j < rowTaskElements.length; j++) {
        let rowTaskElement = jQuery(rowTaskElements[j])

        let taskModel = rowModel.tasks[j]
        let taskText = rowTaskElement.find('.gantt-task-content').text()
        expect(taskText).to.be.eq(taskModel.name)

        if (taskModel.classes) {
          let taskClasses = taskModel.classes
          if (!angular.isArray(taskClasses)) {
            taskClasses = [taskClasses]
          }
          angular.forEach(taskClasses, function (taskClass) {
            expect(rowTaskElement.hasClass(taskClass)).to.be.ok
          })
        }
      }
    }
  }

  beforeEach(inject(['$rootScope', '$compile', '$timeout', 'Gantt', function ($tRootScope: IRootScopeService, $tCompile: ICompileService, $tTimeout: ITimeoutService, tGantt) {
    Gantt = tGantt
    $rootScope = $tRootScope
    $compile = $tCompile
    $timeout = $tTimeout
  }]))

  it('should register API and call api.on.ready event',
    function () {
      let $scope = $rootScope.$new()

      let ganttApi
      let ready = false
      $scope.api = function (api) {
        ganttApi = api

        ganttApi.core.on.ready($scope, function () {
          ready = true
        })
      }

      $compile('<div gantt api="api"></div>')($scope)
      $scope.$digest()
      $timeout.flush()

      expect(ganttApi).to.be.not.undefined
      expect(ready).to.be.ok

      ganttApi = undefined
      ready = false

      $compile('<div gantt api="api"></div>')($scope)
      $scope.$digest()
      $timeout.flush()

      expect(ganttApi).to.be.not.undefined
      expect(ready).to.be.ok
    }
  )

  it('should load with no data',
    function () {
      let $scope = $rootScope.$new()
      let ganttElement = $compile('<div gantt></div>')($scope)
      $scope.$digest()
      $timeout.flush()
      checkData([], ganttElement)
    })

  it('should load and modify data from $scope.data',
    function () {
      let $scope = $rootScope.$new()

      $scope.data = angular.copy(mockData)
      let ganttElement = $compile('<div gantt data="data"></div>')($scope)
      $scope.$digest()
      $timeout.flush()

      checkData($scope.data, ganttElement)

      $scope.data = []
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data = angular.copy(mockData)
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].name = 'Modified' // Change row name
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks.splice(1, 0) // Remove a task
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks = undefined // Removes all row task
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks = [] // Set task array back
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks.push(angular.copy((mockData[2] as any).tasks[1])) // Add a task
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks[0].name = 'Modified'
      $scope.$digest()
      checkData($scope.data, ganttElement)

      $scope.data[2].tasks[0].classes = ['other-custom-class']
      $scope.$digest()
      checkData($scope.data, ganttElement)
    }
  )

  it('should load data from API',
    function () {
      let $scope = $rootScope.$new()

      let data = angular.copy(mockData)

      let ganttApi
      let ready = false
      $scope.api = function (api) {
        ganttApi = api

        ganttApi.core.on.ready($scope, function () {
          ready = true
          ganttApi.data.load(data)
        })
      }

      let ganttElement = $compile('<div gantt api="api" data="data"></div>')($scope)
      $scope.$digest()
      $timeout.flush()

      expect($scope.data).to.be.eq(data)
      checkData(data, ganttElement)
    }
  )

  it('should destroy scope properly',
    function () {
      let $scope = $rootScope.$new()

      $scope.data = angular.copy(mockData)
      $compile('<div gantt data="data"></div>')($scope)
      $scope.$digest()
      $timeout.flush()

      $scope.$destroy()
    }
  )

  describe('from-date/to-date', function () {
    let $scope
    let ganttElement
    let ganttApi
    beforeEach(function () {
      $scope = $rootScope.$new()

      $scope.data = angular.copy(mockData)
      $scope.fromDate = undefined
      $scope.toDate = undefined

      $scope.api = function (api) {
        ganttApi = api
      }

      ganttElement = $compile('<div gantt data="data" api="api" from-date="fromDate" to-date="toDate"><gantt-table></gantt-table></div>')($scope)
      $scope.$digest()
      $timeout.flush()
    })

    it('should support native date',
      function () {
        $scope.fromDate = new Date(2013, 1, 1)
        $scope.toDate = new Date(2014, 1, 1)

        $scope.$digest()

        checkData($scope.data, ganttElement)
      }
    )

    it('should support null date',
      function () {
        $scope.fromDate = null
        $scope.toDate = null

        $scope.$digest()

        checkData($scope.data, ganttElement)
      }
    )

    it('should support moment',
      function () {
        $scope.fromDate = moment(new Date(2013, 1, 1))
        $scope.toDate = moment(new Date(2014, 1, 1))

        $scope.$digest()

        checkData($scope.data, ganttElement)
      }
    )

    it('should support invalid moment',
      function () {
        $scope.fromDate = moment(null)
        $scope.toDate = moment(null)

        $scope.$digest()

        checkData($scope.data, ganttElement)
      }
    )

  })
})
