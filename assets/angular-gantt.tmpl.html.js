angular.module('templates.gantt', ['template/default.bouds.tmpl.html', 'template/default.tooltip.tmpl.html', 'template/gantt.task.drag.tmpl.html', 'template/gantt.task.tmpl.html', 'template/gantt.tmpl.html']);

angular.module('template/default.bouds.tmpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/default.bouds.tmpl.html',
    '<div ng-show=\'visible\' class=\'gantt-task-bounds\' ng-style=\'getCss()\' ng-class=\'getClass()\'></div>');
}]);

angular.module('template/default.tooltip.tmpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/default.tooltip.tmpl.html',
    '<div class="gantt-task-info" ng-style="css">\n' +
    '    <div class="gantt-task-info-content">\n' +
    '        {{ task.subject }}</br>\n' +
    '        <small>\n' +
    '            {{ task.isMilestone === true && (task.from | date:\'MMM d, HH:mm\') || (task.from | date:\'MMM d, HH:mm\') + \' - \' + (task.to | date:\'MMM d, HH:mm\') }}\n' +
    '        </small>\n' +
    '    </div>\n' +
    '</div>');
}]);

angular.module('template/gantt.task.drag.tmpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/gantt.task.drag.tmpl.html',
    '<div data-drag="true" data-jqyoui-options="jqyouiOptions" ng-model="taskToDrag" jqyoui-draggable="{onStart:\'onStart\', onStop :\'onStop\'}">\n' +
    '    <div class="btn btn-default"  ng-if="!dragActive">{{task.subject}}</div>\n' +
    '    <div ng-if="dragActive" ng-class="(task.isMilestone === true && [\'gantt-task-milestone\'] || [\'gantt-task\']).concat(task.classes)"\n' +
    '         ng-style="{\'height\': \'1.6em\', \'width\': task.width +\'em\', \'z-index\': 1000, \'background-color\': task.color}">\n' +
    '        <!--<gantt-bounds template-url="template/default.bouds.tmpl.html" ng-if="task.bounds !== undefined" ng-model="task"></gantt-bounds>-->\n' +
    '        <!--<gantt-tooltip template-url="template/default.tooltip.tmpl.html" ng-if="showTooltips && (task.isMouseOver || task.isMoving)" ng-model="task"></gantt-tooltip>-->\n' +
    '        <div class="gantt-task-content"><span>{{ (task.isMilestone === true && \'&nbsp;\' || task.subject) }}</span><span ng-if="task.over"> - OVER</span></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '');
}]);

angular.module('template/gantt.task.tmpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/gantt.task.tmpl.html',
    '<div ng-class="(task.isMilestone === true && [\'gantt-task-milestone\'] || [\'gantt-task\']).concat(task.classes)"\n' +
    '     ng-style="{\'left\': ((task.isMilestone === true || task.width === 0) && (task.left-0.3) || task.left)+\'em\', \'width\': task.width +\'em\', \'z-index\': (task.isMoving === true && 1  || task.priority || \'\'), \'background-color\': task.color}">\n' +
    '    <gantt-bounds template-url="template/default.bouds.tmpl.html" ng-if="task.bounds !== undefined" ng-model="task"></gantt-bounds>\n' +
    '    <gantt-tooltip template-url="template/default.tooltip.tmpl.html" ng-if="showTooltips && (task.isMouseOver || task.isMoving)" ng-model="task"></gantt-tooltip>\n' +
    '    <div class="gantt-task-content"><span>{{ (task.isMilestone === true && \'&nbsp;\' || task.subject) }}</span></div>\n' +
    '</div>');
}]);

angular.module('template/gantt.tmpl.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/gantt.tmpl.html',
    '<div class="gantt">\n' +
    '    <div class="gantt-labels"\n' +
    '         ng-style="(labelsWidth > 0 && {\'width\': labelsWidth+\'px\'} || {})"\n' +
    '         gantt-label-resizable="labelsWidth" gantt-label-resize-min="50" on-label-resized="raiseLabelsResized(width)" >\n' +
    '        <div class="gantt-labels-head"\n' +
    '             ng-show="gantt.columns.length > 0">\n' +
    '            <div class="gantt-labels-head-row"\n' +
    '                 ng-style="{\'margin-top\': ((gantt.getActiveHeadersCount()-1)*2)+\'em\'}">\n' +
    '                <span>Description</span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="gantt-labels-body"\n' +
    '             ng-style="(maxHeight > 0 && {\'max-height\': (maxHeight-ganttHeader.offsetHeight)+\'px\'} || {})"\n' +
    '             ng-show="gantt.columns.length > 0">\n' +
    '            <div gantt-vertical-scroll-receiver\n' +
    '                 ng-style="{\'position\': \'relative\'}">\n' +
    '                <div class="gantt-labels-row gantt-row-height"\n' +
    '                     ng-class-odd="\'gantt-background-row\'"\n' +
    '                     ng-class-even="\'gantt-background-row-alt\'"\n' +
    '                     ng-click="raiseLabelClickedEvent($event, row)"\n' +
    '                     ng-dblclick="raiseLabelDblClickedEvent($event, row)"\n' +
    '                     gantt-right-click="raiseLabelContextMenuEvent($event, row)"\n' +
    '                     ng-repeat="row in gantt.rows | filter:rowFilter track by $index">\n' +
    '                    <gantt-sortable swap="swapRows(a,b)" active="allowRowSorting" ng-model="row">\n' +
    '                        <span>{{ row.description }}</span>\n' +
    '                    </gantt-sortable>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="gantt-head"\n' +
    '         ng-show="gantt.columns.length > 0">\n' +
    '        <div gantt-horizontal-scroll-receiver\n' +
    '             ng-style="{\'position\': \'relative\', \'width\': gantt.width+\'em\'}">\n' +
    '            <div class="gantt-head-row"\n' +
    '                 ng-class="(gantt.headers.week !== undefined && \'gantt-head-row-bottom\' || \'\')"\n' +
    '                 ng-if="gantt.headers.month !== undefined">\n' +
    '                <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"\n' +
    '                      ng-repeat="c in gantt.headers.month | ganttColumnLimit:scroll_start:scroll_width track by $index">\n' +
    '                    {{ c.date | date:\'MMMM yyyy\' }}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '            <div class="gantt-head-row" ng-if="gantt.headers.week !== undefined">\n' +
    '                <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"\n' +
    '                      ng-repeat="c in gantt.headers.week | ganttColumnLimit:scroll_start:scroll_width track by $index">\n' +
    '                    {{ c.week }}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '            <div class="gantt-head-row" ng-if="gantt.headers.day !== undefined">\n' +
    '                <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"\n' +
    '                      ng-repeat="c in gantt.headers.day | ganttColumnLimit:scroll_start:scroll_width track by $index">\n' +
    '                    {{ viewScale === \'hour\' && (c.date | date:\'dd EEEE\') || (c.date | date:\'dd\') }}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '            <div class="gantt-head-row" ng-if="gantt.headers.hour !== undefined">\n' +
    '                <span ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"\n' +
    '                      ng-repeat="c in gantt.headers.hour | ganttColumnLimit:scroll_start:scroll_width track by $index">\n' +
    '                    {{ c.date | date:\'HH\' }}\n' +
    '                </span>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="gantt-scrollable"\n' +
    '         gantt-scroll-sender\n' +
    '         gantt-limit-updater\n' +
    '         ng-style="(maxHeight > 0 && {\'max-height\': (maxHeight-ganttHeader.offsetHeight)+\'px\', \'overflow-y\': \'scroll\'} || {\'overflow-y\': \'hidden\'})"\n' +
    '         ng-style="{\'overflow-x\': (gantt.rows.length == 0 && \'hidden\' || \'scroll\')}">\n' +
    '        <div class="gantt-body"\n' +
    '             ng-style="{\'width\': gantt.width+\'em\'}">\n' +
    '            <div class="gantt-body-background">\n' +
    '                <div class="gantt-row-height"\n' +
    '                     ng-class-odd="\'gantt-background-row\'"\n' +
    '                     ng-class-even="\'gantt-background-row-alt\'"\n' +
    '                     ng-repeat="row in gantt.rows | filter:rowFilter track by $index">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="gantt-body-foreground">\n' +
    '                <div ng-class="(viewScale === \'hour\' && !c.isWorkHour && \'gantt-foreground-col-nonworkhour\' || (c.isWeekend && \'gantt-foreground-col-weekend\' || \'gantt-foreground-col\'))"\n' +
    '                     ng-style="{\'width\': c.width+\'em\', \'left\': c.left+\'em\'}"\n' +
    '                     ng-repeat="c in gantt.columns | ganttColumnLimit:scroll_start:scroll_width track by $index">\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="gantt-body-content" data-drop="true" ng-model=\'taskDropped\' data-jqyoui-options="jqyouiOptions" jqyoui-droppable="{onDrop: \'onDrop\', onOver: \'onOver\'}">\n' +
    '                <div class="gantt-row gantt-row-height"\n' +
    '                     id="gantt-row-{{row.id}}"\n' +
    '                     ng-click="raiseDOMRowClickedEvent($event, row)"\n' +
    '                     ng-dblclick="raiseDOMRowDblClickedEvent($event, row)"\n' +
    '                     gantt-right-click="raiseDOMRowContextMenuEvent($event, row)"\n' +
    '                     ng-repeat="row in gantt.rows | filter:rowFilter track by row.id">\n' +
    '                    <gantt-task ng-repeat="task in row.tasks | ganttTaskLimit:scroll_start:scroll_width track by task.id"></gantt-task>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
