/**
 * Mouse button cross browser normalization
 */
export default class GanttMouseButton {
  getButton(e: MouseEvent) {
    e = e || window.event as MouseEvent;

    if (!e.which) {
      if (e.button === undefined) {
        return 1;
      }
      return e.button < 2 ? 1 : e.button === 4 ? 2 : 3;
    } else {
      return e.which;
    }
  }
}
