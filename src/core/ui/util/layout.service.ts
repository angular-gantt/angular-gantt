import {IDocumentService} from 'angular'

import {GanttColumn} from '../../logic/column/column.factory'

export default class GanttLayout {
  private $document: IDocumentService

  constructor ($document: IDocumentService) {
    'ngInject'

    this.$document = $document
  }

  /**
   * Compute the width of scrollbar.
   *
   * @returns {number} width of the scrollbar, in px.
   */
  getScrollBarWidth () {
    let inner = this.$document[0].createElement('p')
    inner.style.width = '100%'
    inner.style.height = '200px'

    let outer = this.$document[0].createElement('div')
    outer.style.position = 'absolute'
    outer.style.top = '0px'
    outer.style.left = '0px'
    outer.style.visibility = 'hidden'
    outer.style.width = '200px'
    outer.style.height = '150px'
    outer.style.overflow = 'hidden'
    outer.appendChild(inner)

    this.$document[0].body.appendChild(outer)

    let w1 = inner.offsetWidth
    outer.style.overflow = 'scroll'

    let w2 = inner.offsetWidth
    if (w1 === w2) {
      w2 = outer.clientWidth
    }

    this.$document[0].body.removeChild(outer)

    return (w1 - w2)
  }

  /**
   * Compute the height of scrollbar.
   *
   * @returns {number} height of the scrollbar, in px.
   */
  getScrollBarHeight () {
    let inner = this.$document[0].createElement('p')
    inner.style.width = '200px;'
    inner.style.height = '100%'

    let outer = this.$document[0].createElement('div')
    outer.style.position = 'absolute'
    outer.style.top = '0px'
    outer.style.left = '0px'
    outer.style.visibility = 'hidden'
    outer.style.width = '150px'
    outer.style.height = '200px'
    outer.style.overflow = 'hidden'
    outer.appendChild(inner)

    this.$document[0].body.appendChild(outer)

    let h1 = inner.offsetHeight
    outer.style.overflow = 'scroll'

    let h2 = inner.offsetHeight
    if (h1 === h2) {
      h2 = outer.clientHeight
    }

    this.$document[0].body.removeChild(outer)

    return (h1 - h2)
  }

  setColumnsWidthFactor (columns: GanttColumn[], widthFactor: number, originalLeftOffset = 0) {
    if (!columns) {
      return
    }

    for (let column of columns) {
      column.left = (widthFactor * (column.originalSize.left + originalLeftOffset)) - originalLeftOffset
      column.width = widthFactor * column.originalSize.width

      for (let timeFrame of column.timeFrames) {
        timeFrame.left = widthFactor * timeFrame.originalSize.left
        timeFrame.width = widthFactor * timeFrame.originalSize.width
      }
    }
  }
}
