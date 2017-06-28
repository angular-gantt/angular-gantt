// tslint:disable:no-unused-expression

import angular, {IRootScopeService} from 'angular'
import 'angular-mocks'

import { expect } from 'chai'

describe('Options', () => {
  beforeEach(angular.mock.module('gantt'))

  let Options
  let $rootScope: IRootScopeService
  let $compile

  beforeEach(inject(['$rootScope', '$compile', 'GanttOptions', function ($tRootScope: IRootScopeService, $tCompile, tOptions) {
    Options = tOptions
    $rootScope = $tRootScope
    $compile = $tCompile
  }]))

  it('should return undefined for a non existing option value',
    function () {
      let $scope = $rootScope.$new()

      let options = new Options($scope, {})

      let value = options.value('non existing')

      expect(value).to.be.undefined
    }
  )

  it('should return the value for a existing option value (non-boolean)',
    function () {
      let $scope = $rootScope.$new()

      $scope.existing = 100
      let options = new Options($scope, {})

      let value = options.value('existing')

      expect(value).to.eq(100)
    }
  )

  it('should return the default value for a non existing option value (non-boolean)',
    function () {
      let $scope = $rootScope.$new()

      let options = new Options($scope, {
        'default': 100
      })

      let value = options.value('default')

      expect(value).to.eq(100)
    }
  )

  it('should return false for a existing non-truthy option value',
    function () {
      let $scope = $rootScope.$new()

      $scope.existing = false
      let options = new Options($scope, {})

      let value = options.value('existing')

      expect(value).to.eq(false)
    }
  )

  it('should return true for a existing truthy option value',
    function () {
      let $scope = $rootScope.$new()

      $scope.existing = true
      let options = new Options($scope, {})

      let value = options.value('existing')

      expect(value).to.eq(true)
    }
  )

  it('should return false as default value for a non existing non-truthy option value',
    function () {
      let $scope = $rootScope.$new()

      let options = new Options($scope, {
        'default': false
      })

      let value = options.value('default')

      expect(value).to.eq(false)
    }
  )

  it('should return true as default value for a non existing truthy option value',
    function () {
      let $scope = $rootScope.$new()

      let options = new Options($scope, {
        'default': true
      })

      let value = options.value('default')

      expect(value).to.eq(true)
    }
  )

  it('should return false for a non-truthy option value which has a default value',
    function () {
      let $scope = $rootScope.$new()

      $scope.existing = false
      let options = new Options($scope, {
        'existing': true
      })

      let value = options.value('existing')

      expect(value).to.eq(false)
    }
  )

  it('should return true for a truthy boolean option value which has a default value',
    function () {
      let $scope = $rootScope.$new()

      $scope.existing = true
      let options = new Options($scope, {
        'existing': false
      })

      let value = options.value('existing')

      expect(value).to.eq(true)
    }
  )

  it('should set an option value to the specified value',
    function () {
      let $scope = $rootScope.$new()

      let options = new Options($scope, {})

      options.set('toSet', 100)
      expect($scope.toSet).to.eq(100)

      let value = options.value('toSet')
      expect(value).to.eq(100)
    }
  )
})
