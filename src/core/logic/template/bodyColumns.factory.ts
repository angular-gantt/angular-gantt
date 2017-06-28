import {GanttBody} from './body.factory'

export class GanttBodyColumns {
  private body: GanttBody

  constructor (body: GanttBody) {
    this.body = body
  }
}

export default function () {
  'ngInject'

  return GanttBodyColumns
}
