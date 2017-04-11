export default function (ganttUtils, GanttTask) {
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

    for (let i = 0; i < self.descendants.length; i++) {
      let tasks = self.descendants[i].tasks;

      for (let j = 0; j < tasks.length; j++) {
        let task = tasks[j];

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
      for (let i = 0; i < self.tasks.length; i++) {
        if (self.from === undefined || self.tasks[i].model.from < self.from) {
          self.from = self.tasks[i].model.from;
        }
      }
    }

    self.to = undefined;
    if (groupRowGroups) {
      self.to = groupRowGroups.to;
    }
    if (self.to === undefined) {
      for (let i = 0; i < self.tasks.length; i++) {
        if (self.to === undefined || self.tasks[i].model.to > self.to) {
          self.to = self.tasks[i].model.to;
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
