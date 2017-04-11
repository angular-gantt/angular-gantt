require('./labelsBody.tmpl.html');

export default function (GanttDirectiveBuilder, ganttLayout) {
  'ngInject';
  let builder = new GanttDirectiveBuilder('ganttLabelsBody', 'plugins/labels/labelsBody.tmpl.html');
  builder.controller = function ($scope) {
    let hScrollBarHeight = ganttLayout.getScrollBarHeight();

    $scope.getLabelsCss = function () {
      let css = {};

      let maxHeight = $scope.maxHeight;
      if (!maxHeight) {
        maxHeight = $scope.gantt.getContainerHeight();
      }

      let bodyScrollBarHeight = $scope.gantt.scroll.isHScrollbarVisible() ? hScrollBarHeight : 0;
      css['max-height'] = maxHeight - bodyScrollBarHeight - $scope.gantt.header.getHeight() + 'px';

      return css;
    };
  };
  return builder.build();
}
