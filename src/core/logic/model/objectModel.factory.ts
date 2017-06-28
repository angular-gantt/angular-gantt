import moment from 'moment'

import {GanttApi} from '../api/api.factory'
import GanttUtils from '../util/utils.service'

export class GanttObjectModel {
  static ganttUtils: GanttUtils

  private api: GanttApi

  constructor (api: GanttApi) {
    this.api = api

    this.api.registerEvent('tasks', 'clean')
    this.api.registerEvent('rows', 'clean')
    this.api.registerEvent('timespans', 'clean')
  }

  cleanTask (model) {
    if (model.id === undefined) {
      model.id = GanttObjectModel.ganttUtils.randomUuid()
    }

    if (model.from !== undefined && !moment.isMoment(model.from)) {
      model.from = moment(model.from)
    }

    if (model.to !== undefined && !moment.isMoment(model.to)) {
      model.to = moment(model.to)
    }

    (this.api as any).tasks.raise.clean(model)
  }

  cleanRow (model) {
    if (model.id === undefined) {
      model.id = GanttObjectModel.ganttUtils.randomUuid()
    }

    if (model.from !== undefined && !moment.isMoment(model.from)) {
      model.from = moment(model.from)
    }

    if (model.to !== undefined && !moment.isMoment(model.to)) {
      model.to = moment(model.to)
    }

    (this.api as any).rows.raise.clean(model)
  }

  cleanTimespan (model) {
    if (model.id === undefined) {
      model.id = GanttObjectModel.ganttUtils.randomUuid()
    }

    if (model.from !== undefined && !moment.isMoment(model.from)) {
      model.from = moment(model.from)
    }

    if (model.to !== undefined && !moment.isMoment(model.to)) {
      model.to = moment(model.to)
    }

    (this.api as any).timespans.raise.clean(model)
  }
}

export default function (ganttUtils: GanttUtils) {
  'ngInject'

  GanttObjectModel.ganttUtils = ganttUtils
  return GanttObjectModel
}
