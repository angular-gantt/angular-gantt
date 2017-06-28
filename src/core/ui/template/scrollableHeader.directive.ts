export default function (GanttDirectiveBuilder, ganttLayout) {
  'ngInject'
  let builder = new GanttDirectiveBuilder('ganttScrollableHeader')
  builder.controller = function ($scope) {
    let scrollBarWidth = ganttLayout.getScrollBarWidth()
    $scope.getScrollableHeaderCss = function () {
      let css = {}

      let maxHeightActivated = $scope.gantt.scroll.isVScrollbarVisible()
      let vScrollbarWidth = maxHeightActivated ? scrollBarWidth : 0
      let columnWidth = this.gantt.options.value('columnWidth')
      let bodySmallerThanGantt = $scope.gantt.width === 0 ? false : $scope.gantt.width < $scope.gantt.getWidth() - $scope.gantt.side.getWidth()

      if (columnWidth !== undefined && bodySmallerThanGantt) {
        css['width'] = ($scope.gantt.width - vScrollbarWidth + this.gantt.scroll.getBordersWidth()) + 'px'
      } else if (maxHeightActivated) {
        css['width'] = $scope.gantt.getWidth() - $scope.gantt.side.getWidth() - vScrollbarWidth + 'px'
      }

      /*
       if (oldMaxHeightActivated !== maxHeightActivated) {
       oldMaxHeightActivated = maxHeightActivated;
       $scope.gantt.columnsManager.updateColumnsMeta();
       }
       */

      return css
    }
  }
  return builder.build()
}
