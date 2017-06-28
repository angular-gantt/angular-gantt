import moment from 'moment'
import {ITimeoutService} from 'angular'
import {GanttDebounce} from '../util/debounce.factory'
import {GanttDirectiveBuilder} from '../util/directiveBuilder.factory'

export default function (GanttDirectiveBuilder: {new(directiveName: string, templateUrl?: string, require?: string | string[], restrict?: string): GanttDirectiveBuilder},
                         $timeout: ITimeoutService,
                         ganttDebounce: GanttDebounce) {
  'ngInject'

  let builder = new GanttDirectiveBuilder('ganttScrollable')
  builder.controller = function ($scope, $element) {
    $scope.gantt.scroll.$element = $element
    let lastScrollLeft
    let autoExpandTimer

    let autoExpandColumns = function (el, date, direction) {
      let autoExpand = $scope.gantt.options.value('autoExpand')
      if (autoExpand !== 'both' && autoExpand !== true && autoExpand !== direction) {
        return
      }

      let from
      let to

      let viewScale = $scope.gantt.options.value('viewScale')
      viewScale = viewScale.trim()
      if (viewScale.charAt(viewScale.length - 1) === 's') {
        viewScale = viewScale.substring(0, viewScale.length - 1)
      }
      let viewScaleValue
      let viewScaleUnit
      let splittedViewScale

      if (viewScale) {
        splittedViewScale = viewScale.split(' ')
      }
      if (splittedViewScale && splittedViewScale.length > 1) {
        viewScaleValue = parseFloat(splittedViewScale[0])
        viewScaleUnit = splittedViewScale[splittedViewScale.length - 1]
      } else {
        viewScaleValue = 1
        viewScaleUnit = viewScale
      }

      if (direction === 'left') {
        from = moment(date).add(-5 * viewScaleValue, viewScaleUnit)
        $scope.fromDate = from
      } else {
        to = moment(date).add(5 * viewScaleValue, viewScaleUnit)
        $scope.toDate = to
      }

      $scope.gantt.api.scroll.raise.scroll(el.scrollLeft, date, direction)
    }

    $element.bind('scroll', ganttDebounce(function () {
      let el = $element[0]
      let currentScrollLeft = el.scrollLeft
      let direction
      let date

      $scope.gantt.scroll.cachedScrollLeft = currentScrollLeft
      $scope.gantt.columnsManager.updateVisibleColumns()
      $scope.gantt.rowsManager.updateVisibleObjects()

      if (currentScrollLeft < lastScrollLeft && currentScrollLeft === 0) {
        direction = 'left'
        date = $scope.gantt.columnsManager.from
      } else if (currentScrollLeft > lastScrollLeft && el.offsetWidth + currentScrollLeft >= el.scrollWidth - 1) {
        direction = 'right'
        date = $scope.gantt.columnsManager.to
      }

      lastScrollLeft = currentScrollLeft

      if (date !== undefined) {
        if (autoExpandTimer) {
          $timeout.cancel(autoExpandTimer)
        }

        autoExpandTimer = $timeout(function () {
          autoExpandColumns(el, date, direction)
        }, 300)
      } else {
        $scope.gantt.api.scroll.raise.scroll(currentScrollLeft)
      }
    }, 5))

    $scope.getScrollableCss = function () {
      let css = {}

      let maxHeight = $scope.gantt.options.value('maxHeight')
      if (!maxHeight) {
        maxHeight = $scope.gantt.getContainerHeight()
      }

      if (maxHeight > 0) {
        css['max-height'] = maxHeight - $scope.gantt.header.getHeight() + 'px'
        css['overflow-y'] = 'auto'

        if ($scope.gantt.scroll.isVScrollbarVisible()) {
          css['border-right'] = 'none'
        }
      }

      let columnWidth = this.gantt.options.value('columnWidth')
      let bodySmallerThanGantt = $scope.gantt.width === 0 ? false : $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth()
      if (columnWidth !== undefined && bodySmallerThanGantt) {
        css['width'] = ($scope.gantt.width + this.gantt.scroll.getBordersWidth()) + 'px'
      }

      return css
    }
  }
  return builder.build()
}
