import {IAugmentedJQuery} from 'angular'
import {GanttHeaderColumns} from './headerColumns.factory'
import {Gantt} from '../gantt.factory'

export class GanttHeader {
  static GanttHeaderColumns: { new(gantt: Gantt): GanttHeaderColumns }

  gantt: Gantt
  columns: GanttHeaderColumns

  $element: IAugmentedJQuery

  constructor (gantt: Gantt) {
    this.gantt = gantt
    this.columns = new GanttHeader.GanttHeaderColumns(this.gantt)
  }

  getHeight () {
    return this.$element[0].offsetHeight
  }
}

export default function (GanttHeaderColumns: { new(element: Gantt): GanttHeaderColumns }) {
  'ngInject'

  GanttHeader.GanttHeaderColumns = GanttHeaderColumns
  return GanttHeader
}
