import angular from 'angular'

import {ITimeoutService} from 'angular'

let prevUniqueNumber = 0

function uniqueNumber () {
  let date = Date.now()

  // If created at same millisecond as previous
  if (date <= prevUniqueNumber) {
    date = ++prevUniqueNumber
  } else {
    prevUniqueNumber = date
  }

  return date
}

export default function ($timeout: ITimeoutService) {
  'ngInject'

  return {
    link: (scope, element, attrs: any) => {
      let windowElement = angular.element(window)
      let DEBUG = attrs.ganttSuspendableDebug === '' || attrs.ganttSuspendableDebug === 'true'

      let watchersForId = {}

      let uniqueSuspendableId = Math.random().toString(32).slice(2)
      let trackedEvents = ['scroll.suspendable-' + uniqueSuspendableId, 'resize.suspendable-' + uniqueSuspendableId]
      let heartbeat
      let scopeCheckFunc

      function suspend (suspendableId, scopeToSuspend) {
        if (!watchersForId[suspendableId]) {
          watchersForId[suspendableId] = scopeToSuspend.$$watchers
          scopeToSuspend.$$watchers = []
        }
      }

      function resume (suspendableId, scopeToResume) {
        if (watchersForId[suspendableId]) {
          scopeToResume.$$watchers = watchersForId[suspendableId]
          delete watchersForId[suspendableId]
        }
      }

      function isHidden (el) {
        return (el.offsetParent === null)
      }

      function getCoords (elem) { // crossbrowser version
        let box = elem.getBoundingClientRect()

        let body = document.body
        let docEl = document.documentElement

        let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
        let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

        let clientTop = docEl.clientTop || body.clientTop || 0
        let clientLeft = docEl.clientLeft || body.clientLeft || 0

        let top = box.top + scrollTop - clientTop
        let left = box.left + scrollLeft - clientLeft

        return { top: Math.round(top), left: Math.round(left) }
      }

      // If the scope gets destroyed, unbind the listeners we created
      scope.$on('$destroy', () => {
        windowElement.off(trackedEvents.join(' '))
        clearInterval(heartbeat)
        watchersForId = null
      })

      scopeCheckFunc = () => {
        let windowOffset = window.scrollY
        let windowHeight = window.innerHeight
        let scopeElems = element[0].querySelectorAll('.ng-scope, .ng-isolate-scope')
        let scopes = []
        for (let scopeElem of scopeElems) {
          let toAdd = {
            scope: angular.element(scopeElem).scope(),
            elem: scopeElem
          }
          scopes.push(toAdd)
        }

        for (let scope of scopes) {
          let scopeElement = angular.element(scope.elem)

          if (!scopeElement.attr('data-suspendable-id')) {
            scopeElement.attr('data-suspendable-id', uniqueNumber())
          }

          // TODO this implementation is naive and there should be finer grained checks around an element's position vs page position
          let offset = getCoords(scope.elem)
          let handler = (offset.top <= windowOffset || offset.top >= windowOffset + windowHeight || isHidden(scope.elem)) ? suspend : resume

          if (DEBUG) {
            if (handler === suspend) {
              scopeElement.css('border-color', 'red')
              scopeElement.css('border-width', '1px')
              scopeElement.css('border-style', 'dotted')
              scopeElement.css('border-color', 'red')
            } else if (handler === resume) {
              scopeElement.css('border-color', 'green')
              scopeElement.css('border-width', '1px')
              scopeElement.css('border-style', 'dotted')
            }
          }

          handler(scopeElement.attr('data-suspendable-id'), scope.scope)
        }
      }

      // Clean up after long/fast scrolls and reattach if hidden elements become visible
      heartbeat = setInterval(scopeCheckFunc, 2500)

      // Attach namespaced scroll and resize events to the window object. Only call the listener every 50ms
      // The listener will find all scopes within the container, attach a unique ID if necessary, and trigger
      // the appropriate event based on window scroll position and element offset.
      windowElement.on(trackedEvents.join(' ') as any, $timeout(() => {
        scopeCheckFunc()
      }, 50))
    }
  }
}
