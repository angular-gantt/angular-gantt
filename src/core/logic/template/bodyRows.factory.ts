import {GanttBody} from './body.factory'

export class GanttBodyRows {
  private body: GanttBody

  constructor (body: GanttBody) {
    this.body = body
  }
}

export default function () {
  'ngInject'

  return GanttBodyRows
}
