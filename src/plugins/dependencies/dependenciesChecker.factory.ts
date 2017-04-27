export default function () {
  'ngInject';

  /**
   * Creates a new DependenciesChecker object.
   *
   * @constructor
   */
  let GanttDependenciesChecker = function (manager) {
    function handleTaskConflict(conflictsList, task) {
      if (!(task.model.id in conflictsList) && task.$element) {
        task.$element.addClass('gantt-task-conflict');
        conflictsList[task.model.id] = task;
      }
    }

    function handleTaskNonConflict(conflictsList, allTasks) {
      // tslint:disable:one-variable-per-declaration
      for (let i = 0, l = allTasks.length; i < l; i++) {
        let task = allTasks[i];
        if (!(task.model.id in conflictsList) && task.$element) {
          task.$element.removeClass('gantt-task-conflict');
        }
      }
    }

    /**
     * Refresh the conflict status of given tasks.
     *
     * @param tasks
     */
    this.refresh = function (tasks) {
      let allTasks = tasks.slice(0);
      let conflictsList = [];

      for (let task of tasks) {
        let taskDependencies = manager.getTaskDependencies(task);

        for (let dependency of taskDependencies) {
          let fromTask = dependency.getFromTask();
          let toTask = dependency.getToTask();

          if (!(fromTask in allTasks)) {
            allTasks.push(fromTask);
          }

          if (!(toTask in allTasks)) {
            allTasks.push(toTask);
          }

          if (fromTask.model.to > toTask.model.from) {
            handleTaskConflict(conflictsList, fromTask);
            handleTaskConflict(conflictsList, toTask);
          }
        }
      }

      handleTaskNonConflict(conflictsList, allTasks);
    };

    this.removeConflictClass = function (task) {
      task.$element.removeClass('gantt-task-conflict');
    };

    /**
     * Remove the conflict status of given tasks.
     *
     * @param tasks
     */
    this.clear = function (tasks) {
      let allTasks = tasks.slice(0);
      handleTaskNonConflict([], allTasks);
    };

  };
  return GanttDependenciesChecker;
}
