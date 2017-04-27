import GanttUtilsService from '../../core/logic/util/utils.service';
import {GanttTask, GanttTaskModel} from '../../core/logic/task/task.factory';
import {GanttRow} from '../../core/logic/row/row.factory';

export default function (ganttUtils: GanttUtilsService,
                         GanttTask: {new(row: GanttRow, model: GanttTaskModel): GanttTask}) {
  'ngInject';

  let TaskGroup = function (row, pluginScope) {
    let self = this;

    self.row = row;
    self.pluginScope = pluginScope;

    self.descendants = self.pluginScope.hierarchy.descendants(self.row);

    self.tasks = [];
    self.overviewTasks = [];
    self.promotedTasks = [];
    self.showGrouping = false;

    let groupRowGroups = self.row.model.groups;
    if (typeof(groupRowGroups) === 'boolean') {
      groupRowGroups = {enabled: groupRowGroups};
    }

    let getTaskDisplay = function (task) {
      let taskGroups = task.model.groups;
      if (typeof(taskGroups) === 'boolean') {
        taskGroups = {enabled: taskGroups};
      }

      let rowGroups = task.row.model.groups;
      if (typeof(rowGroups) === 'boolean') {
        rowGroups = {enabled: rowGroups};
      }

      let enabledValue = ganttUtils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'enabled', self.pluginScope.enabled);

      if (enabledValue) {
        let display = ganttUtils.firstProperty([taskGroups, rowGroups, groupRowGroups], 'display', self.pluginScope.display);
        return display;
      }
    };

    for (let descendant of self.descendants) {
      let tasks = descendant.tasks;

      for (let task of tasks) {
        let taskDisplay = getTaskDisplay(task);
        if (taskDisplay !== undefined) {
          self.tasks.push(task);
          let clone = new GanttTask(self.row, task.model);

          if (taskDisplay === 'overview') {
            self.overviewTasks.push(clone);
          } else if (taskDisplay === 'promote') {
            self.promotedTasks.push(clone);
          } else {
            self.showGrouping = true;
          }
        }
      }
    }

    self.from = undefined;
    if (groupRowGroups) {
      self.from = groupRowGroups.from;
    }
    if (self.from === undefined) {
      for (let task of self.tasks) {
        if (self.from === undefined || task.model.from < self.from) {
          self.from = task.model.from;
        }
      }
    }

    self.to = undefined;
    if (groupRowGroups) {
      self.to = groupRowGroups.to;
    }
    if (self.to === undefined) {
      for (let task of self.tasks) {
        if (self.to === undefined || task.model.to > self.to) {
          self.to = task.model.to;
        }
      }
    }

    if (self.showGrouping) {
      self.left = row.rowsManager.gantt.getPositionByDate(self.from);
      self.width = row.rowsManager.gantt.getPositionByDate(self.to) - self.left;
    }
  };
  return TaskGroup;
}
