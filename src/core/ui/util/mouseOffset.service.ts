export default class GanttMouseOffset {
  getTouch (evt: TouchEvent) {
    if (evt.touches !== undefined) {
      return evt.touches[0]
    }
    return evt
  }
  getOffset (evt: MouseEvent) {
    if (evt.offsetX && evt.offsetY) {
      return {x: evt.offsetX, y: evt.offsetY}
    }
    if (evt.layerX && evt.layerY) {
      return {x: evt.layerX, y: evt.layerY}
    }
    return this.getOffsetForElement(evt.target as Element, evt)
  }
  getOffsetForElement (el: Element, evt: MouseEvent) {
    let bb = el.getBoundingClientRect()
    return {x: evt.clientX - bb.left, y: evt.clientY - bb.top}
  }
}
