// tslint:disable:no-unused-expression

import angular, {IRootScopeService} from 'angular'
import 'angular-mocks'

import { expect } from 'chai'

describe('Api', () => {
  beforeEach(angular.mock.module('gantt'))

  let GanttApi
  let scope: IRootScopeService

  beforeEach(angular.mock.inject(['$rootScope', 'GanttApi', function ($tRootScope: IRootScopeService, tGanttApi) {
    GanttApi = tGanttApi
    scope = $tRootScope
  }]))

  it('Register and Unregister events properly',
    function () {
      let api = new GanttApi(this)

      let called1 = false
      let called2 = false

      api.registerEvent('test', 'called')
      this.testMethod = function () {
        called1 = true
        api.test.raise.called()
      }

      let unregister = api.test.on.called(scope, function () {
        called2 = true
      })

      this.testMethod()

      expect(called1).to.be.ok
      expect(called2).to.be.ok

      called1 = false
      called2 = false

      unregister()

      this.testMethod()

      expect(called1).to.be.ok
      expect(called2).to.be.not.ok
    }
  )

  it('Can temporary suppress events',
    function () {
      let api = new GanttApi(this)

      let called1 = false
      let called2 = false

      let self = this

      api.registerEvent('test', 'called')
      this.testMethod = function () {
        called1 = true
        api.test.raise.called()
      }

      let calledHandler = function () {
        called2 = true
      }
      api.test.on.called(scope, calledHandler)

      api.suppressEvents(calledHandler, function () {
        self.testMethod()
      })

      expect(called1).to.be.ok
      expect(called2).to.be.not.ok

      called1 = false
      called2 = false

      this.testMethod()

      expect(called1).to.be.ok
      expect(called2).to.be.ok
    }
  )
})
