import {GanttTask} from '../../logic/task/task.factory'
import {Gantt} from '../../logic/gantt.factory'

export interface IFilterGanttTaskLimit {
  (array: GanttTask[], gantt: Gantt): GanttTask[]
}

export default function () {
  'ngInject'

  // Returns only the tasks which are visible on the screen
  // Use the task width and position to decide if a task is still visible

  return function (input: GanttTask[], gantt: Gantt): GanttTask[] { // TODO: type
    let firstColumn = gantt.columnsManager.getFirstColumn()
    let lastColumn = gantt.columnsManager.getLastColumn()

    if (firstColumn !== undefined && lastColumn !== undefined) {
      let fromDate = firstColumn.date
      let toDate = lastColumn.endDate

      let res: GanttTask[] = []

      let scrollLeft = gantt.scroll.getScrollLeft()
      let scrollContainerWidth = gantt.getWidth() - gantt.side.getWidth()

      // tslint:disable:one-variable-per-declaration
      for (let i = 0, l = input.length; i < l; i++) {
        let task = input[i]

        if (task.active) {
          res.push(task)
        } else {
          // If the task can be drawn with gantt columns only.
          if (task.model.to >= fromDate && task.model.from <= toDate) {

            if (task.left === undefined) {
              task.updatePosAndSize()
            }

            // If task has a visible part on the screen
            if (!scrollContainerWidth ||
              task.left >= scrollLeft && task.left <= scrollLeft + scrollContainerWidth ||
              task.left + task.width >= scrollLeft && task.left + task.width <= scrollLeft + scrollContainerWidth ||
              task.left < scrollLeft && task.left + task.width > scrollLeft + scrollContainerWidth) {

              res.push(task)
            }
          }
        }
      }

      return res
    } else {
      return input.splice(0)
    }
  }
}
