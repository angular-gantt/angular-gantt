import angular, {IFilterFilterComparatorFunc, ITimeoutService} from 'angular'

import moment from 'moment'

import GanttArrays from '../util/arrays.service'
import {GanttRow, GanttRowModel} from './row.factory'
import {IGanttFilterService} from '../../../index'
import {Gantt} from '../gantt.factory'

export class GanttRowsManager {
  static GanttRow: { new(rowsManager: GanttRowsManager, model: GanttRowModel): GanttRow }
  static $filter: IGanttFilterService
  static $timeout: ITimeoutService
  static ganttArrays: GanttArrays

  gantt: Gantt
  rowsMap: { [id: string]: GanttRow } = {}
  rows: GanttRow[] = []
  sortedRows: GanttRow[] = []
  filteredRows: GanttRow[] = []
  customFilteredRows: GanttRow[] = []
  visibleRows: GanttRow[] = []
  rowsTaskWatchers: { (): void }[] = []
  customRowSorters: { (rows: GanttRow[]): GanttRow[] }[] = []
  customRowFilters: { (rows: GanttRow[]): GanttRow[] }[] = []

  _defaultFilterImpl: { (sortedRows: GanttRow[], filterRow: GanttRow[], filterRowComparator: (IFilterFilterComparatorFunc<GanttRow> | boolean)): GanttRow[]}
  filterImpl: { (sortedRows: GanttRow[], filterRow: GanttRow[], filterRowComparator: (IFilterFilterComparatorFunc<GanttRow> | boolean)): GanttRow[]}

  constructor (gantt: Gantt) {
    this.gantt = gantt

    this._defaultFilterImpl = (sortedRows: GanttRow[], filterRow: GanttRow[], filterRowComparator: IFilterFilterComparatorFunc<GanttRow>|boolean) => {
      return GanttRowsManager.$filter('filter')(sortedRows, filterRow, filterRowComparator)
    }
    this.filterImpl = this._defaultFilterImpl

    this.customRowSorters = []
    this.customRowFilters = []

    this.gantt.$scope.$watchGroup(['filterTask', 'filterTaskComparator'], (newValues, oldValues) => {
      if (newValues !== oldValues) {
        this.updateVisibleTasks()
      }
    })

    this.gantt.$scope.$watchGroup(['filterRow', 'filterRowComparator'], (newValues, oldValues) => {
      if (newValues !== oldValues) {
        this.updateVisibleRows()
      }
    })

    this.gantt.$scope.$watch('sortMode', (newValue, oldValue) => {
      if (newValue !== oldValue) {
        this.sortRows()
      }
    })

    // Listen to vertical scrollbar visibility changes to update columns width
    let _oldVScrollbarVisible = this.gantt.scroll.isVScrollbarVisible()
    this.gantt.$scope.$watchGroup(['maxHeight', 'gantt.rowsManager.visibleRows.length'], (newValue, oldValue) => {
      if (newValue !== oldValue) {
        GanttRowsManager.$timeout(() => {
          let newVScrollbarVisible = this.gantt.scroll.isVScrollbarVisible()
          if (newVScrollbarVisible !== _oldVScrollbarVisible) {
            _oldVScrollbarVisible = newVScrollbarVisible
            this.gantt.columnsManager.updateColumnsMeta()
          }
        })
      }
    })

    this.gantt.api.registerMethod('rows', 'sort', GanttRowsManager.prototype.sortRows, this)
    this.gantt.api.registerMethod('rows', 'applySort', GanttRowsManager.prototype.applySort, this)
    this.gantt.api.registerMethod('rows', 'refresh', GanttRowsManager.prototype.updateVisibleObjects, this)

    this.gantt.api.registerMethod('rows', 'removeRowSorter', GanttRowsManager.prototype.removeCustomRowSorter, this)
    this.gantt.api.registerMethod('rows', 'addRowSorter', GanttRowsManager.prototype.addCustomRowSorter, this)

    this.gantt.api.registerMethod('rows', 'removeRowFilter', GanttRowsManager.prototype.removeCustomRowFilter, this)
    this.gantt.api.registerMethod('rows', 'addRowFilter', GanttRowsManager.prototype.addCustomRowFilter, this)

    this.gantt.api.registerMethod('rows', 'setFilterImpl', GanttRowsManager.prototype.setFilterImpl, this)

    this.gantt.api.registerEvent('tasks', 'add')
    this.gantt.api.registerEvent('tasks', 'change')
    this.gantt.api.registerEvent('tasks', 'viewChange')

    this.gantt.api.registerEvent('tasks', 'beforeRowChange')
    this.gantt.api.registerEvent('tasks', 'beforeViewRowChange')
    this.gantt.api.registerEvent('tasks', 'rowChange')
    this.gantt.api.registerEvent('tasks', 'viewRowChange')
    this.gantt.api.registerEvent('tasks', 'remove')
    this.gantt.api.registerEvent('tasks', 'filter')

    this.gantt.api.registerEvent('tasks', 'displayed')

    this.gantt.api.registerEvent('rows', 'add')
    this.gantt.api.registerEvent('rows', 'change')
    this.gantt.api.registerEvent('rows', 'remove')
    this.gantt.api.registerEvent('rows', 'move')

    this.gantt.api.registerEvent('rows', 'displayed')

    this.gantt.api.registerEvent('rows', 'filter')

    this.updateVisibleObjects()
  }

  resetNonModelLists () {
    this.rows = []
    this.sortedRows = []
    this.filteredRows = []
    this.customFilteredRows = []
    this.visibleRows = []
  }

  /**
   * Copy to new row (add) or merge with existing (update)
   *
   * @param rowModel
   * @param modelOrderChanged
   * @returns {boolean} true if updated, false if added.
   */
  addRow (rowModel: GanttRowModel, modelOrderChanged): boolean {
    let row
    let i
    let l
    let isUpdate = false

    this.gantt.objectModel.cleanRow(rowModel)

    if (rowModel.id in this.rowsMap) {
      row = this.rowsMap[rowModel.id]

      if (modelOrderChanged) {
        this.rows.push(row)
        this.sortedRows.push(row)
        this.filteredRows.push(row)
        this.customFilteredRows.push(row)
        this.visibleRows.push(row)
      }

      if (row.model === rowModel) {
        return
      }

      let toRemoveIds = GanttRowsManager.ganttArrays.getRemovedIds(rowModel.tasks, row.model.tasks)
      for (i = 0, l = toRemoveIds.length; i < l; i++) {
        let toRemoveId = toRemoveIds[i]
        row.removeTask(toRemoveId)
      }

      row.model = rowModel
      isUpdate = true
    } else {
      row = new GanttRowsManager.GanttRow(this, rowModel)
      this.rowsMap[rowModel.id] = row
      this.rows.push(row)
      this.sortedRows.push(row)
      this.filteredRows.push(row)
      this.customFilteredRows.push(row)
      this.visibleRows.push(row)
    }

    if (rowModel.tasks !== undefined && rowModel.tasks.length > 0) {
      for (i = 0, l = rowModel.tasks.length; i < l; i++) {
        let taskModel = rowModel.tasks[i]
        row.addTask(taskModel)
      }

      row.updateVisibleTasks()
    }

    if (isUpdate) {
      (this.gantt.api as any).rows.raise.change(row)
    } else {
      (this.gantt.api as any).rows.raise.add(row)
    }

    if (!isUpdate) {
      let watcher = this.gantt.$scope.$watchCollection(() => {
        return rowModel.tasks
      }, (newTasks, oldTasks) => {
        if (newTasks !== oldTasks) {
          let i
          let l

          let toRemoveIds = GanttRowsManager.ganttArrays.getRemovedIds(newTasks, oldTasks)
          for (i = 0, l = toRemoveIds.length; i < l; i++) {
            let toRemove = toRemoveIds[i]
            row.removeTask(toRemove)
          }

          if (newTasks !== undefined) {
            for (i = 0, l = newTasks.length; i < l; i++) {
              let toAdd = newTasks[i]
              row.addTask(toAdd)
            }

            row.updateVisibleTasks()
          }
        }
      })

      this.rowsTaskWatchers.push(watcher)
    }

    return isUpdate
  }

  removeRow (rowId): GanttRow {
    if (rowId in this.rowsMap) {
      delete this.rowsMap[rowId]

      let removedRow

      let indexOf = GanttRowsManager.ganttArrays.indexOfId(this.rows, rowId, ['model', 'id'])
      if (indexOf > -1) {
        removedRow = this.rows.splice(indexOf, 1)[0] // Remove from array
        let unregisterFunction = this.rowsTaskWatchers.splice(indexOf, 1)[0] // Remove watcher
        if (unregisterFunction) {
          unregisterFunction()
        }
      }

      GanttRowsManager.ganttArrays.removeId(this.sortedRows, rowId, ['model', 'id'])
      GanttRowsManager.ganttArrays.removeId(this.filteredRows, rowId, ['model', 'id'])
      GanttRowsManager.ganttArrays.removeId(this.customFilteredRows, rowId, ['model', 'id'])
      GanttRowsManager.ganttArrays.removeId(this.visibleRows, rowId, ['model', 'id']);

      (this.gantt.api as any).rows.raise.remove(removedRow)
      return removedRow
    }

    return undefined
  }

  removeAll () {
    this.rowsMap = {}
    this.rows = []
    this.sortedRows = []
    this.filteredRows = []
    this.customFilteredRows = []
    this.visibleRows = []

    for (let unregisterFunction of this.rowsTaskWatchers) {
      unregisterFunction()
    }
    this.rowsTaskWatchers = []
  }

  sortRows () {
    let expression = this.gantt.options.value('sortMode')

    if (expression !== undefined) {
      let reverse = false
      if ((typeof expression === 'string' || expression instanceof String) && expression.charAt(0) === '-') {
        reverse = true
        expression = expression.substr(1)
      }

      let angularOrderBy = GanttRowsManager.$filter('orderBy')
      this.sortedRows = angularOrderBy(this.rows, expression, reverse)
    } else {
      this.sortedRows = this.rows.slice()
    }

    this.sortedRows = this.applyCustomRowSorters(this.sortedRows)

    this.updateVisibleRows()
  }

  removeCustomRowSorter (sorterFunction: { (rows: GanttRow[]): GanttRow[] }) {
    let i = this.customRowSorters.indexOf(sorterFunction)
    if (i > -1) {
      this.customRowSorters.splice(i, 1)
    }
  }

  addCustomRowSorter (sorterFunction: { (rows: GanttRow[]): GanttRow[] }) {
    this.customRowSorters.push(sorterFunction)
  }

  applyCustomRowSorters (rows: GanttRow[]) {
    let sortedRows = rows
    for (let customRowSorter of this.customRowSorters) {
      sortedRows = customRowSorter(sortedRows)
    }
    return sortedRows
  }

  /**
   * Applies current view sort to data model.
   */
  applySort () {
    let data = this.gantt.$scope.data
    data.splice(0, data.length) // empty data.
    let rows = []
    for (let row of this.sortedRows) {
      data.push(row.model)
      rows.push(row)
    }

    this.rows = rows
  }

  moveRow (row, targetRow) {
    let sortMode = this.gantt.options.value('sortMode')
    if (sortMode !== undefined) {
      // Apply current sort to model
      this.applySort()
      this.gantt.options.set('sortMode', undefined)
    }

    let targetRowIndex = this.rows.indexOf(targetRow)
    let rowIndex = this.rows.indexOf(row)

    if (targetRowIndex > -1 && rowIndex > -1 && targetRowIndex !== rowIndex) {
      GanttRowsManager.ganttArrays.moveToIndex(this.rows, rowIndex, targetRowIndex)
      GanttRowsManager.ganttArrays.moveToIndex(this.rowsTaskWatchers, rowIndex, targetRowIndex)
      GanttRowsManager.ganttArrays.moveToIndex(this.gantt.$scope.data, rowIndex, targetRowIndex);

      (this.gantt.api as any).rows.raise.change(row);
      (this.gantt.api as any).rows.raise.move(row, rowIndex, targetRowIndex)

      this.updateVisibleObjects()
      this.sortRows()
    }
  }

  updateVisibleObjects () {
    this.updateVisibleRows()
    this.updateVisibleTasks()
  }

  updateVisibleRows () {
    let oldFilteredRows = this.filteredRows
    let filterRow = this.gantt.options.value('filterRow')
    if (filterRow) {
      if (typeof(filterRow) === 'object') {
        filterRow = {model: filterRow}
      }

      let filterRowComparator = this.gantt.options.value('filterRowComparator')
      if (typeof(filterRowComparator) === 'function') {
        // fix issue this.gantt is undefined

        let gantt = this.gantt
        filterRowComparator = (actual, expected) => {
          // fix actual.model is undefined
          return gantt.options.value('filterRowComparator')(actual, expected)
        }
      }

      this.filteredRows = this.filterImpl(this.sortedRows, filterRow, filterRowComparator)
    } else {
      this.filteredRows = this.sortedRows.slice(0)
    }

    let raiseEvent = !angular.equals(oldFilteredRows, this.filteredRows)
    this.customFilteredRows = this.applyCustomRowFilters(this.filteredRows)

    // TODO: Implement rowLimit like columnLimit to enhance performance for gantt with many rows
    this.visibleRows = this.customFilteredRows;

    (this.gantt.api as any).rows.raise.displayed(this.sortedRows, this.filteredRows, this.visibleRows)

    if (raiseEvent) {
      (this.gantt.api as any).rows.raise.filter(this.sortedRows, this.filteredRows)
    }
  }

  removeCustomRowFilter (filterFunction: { (rows: GanttRow[]): GanttRow[] }) {
    let i = this.customRowFilters.indexOf(filterFunction)
    if (i > -1) {
      this.customRowFilters.splice(i, 1)
    }
  }

  addCustomRowFilter (filterFunction: { (rows: GanttRow[]): GanttRow[] }) {
    this.customRowFilters.push(filterFunction)
  }

  applyCustomRowFilters (rows: GanttRow[]) {
    let filteredRows = rows
    for (let customRowFilter of this.customRowFilters) {
      filteredRows = customRowFilter(filteredRows)
    }
    return filteredRows
  }

  setFilterImpl (filterImpl) {
    if (!filterImpl) {
      this.filterImpl = this._defaultFilterImpl
    } else {
      this.filterImpl = filterImpl
    }
  }

  updateVisibleTasks () {
    let oldFilteredTasks = []
    let filteredTasks = []
    let tasks = []
    let visibleTasks = []

    for (let row of this.rows) {
      oldFilteredTasks = oldFilteredTasks.concat(row.filteredTasks)
      row.updateVisibleTasks()
      filteredTasks = filteredTasks.concat(row.filteredTasks)
      visibleTasks = visibleTasks.concat(row.visibleTasks)
      tasks = tasks.concat(row.tasks)
    }

    (this.gantt.api as any).tasks.raise.displayed(tasks, filteredTasks, visibleTasks)

    let filterEvent = !angular.equals(oldFilteredTasks, filteredTasks)

    if (filterEvent) {
      (this.gantt.api as any).tasks.raise.filter(tasks, filteredTasks, visibleTasks)
    }
  }

  /**
   * Update the position/size of all tasks in the Gantt
   */
  updateTasksPosAndSize () {
    for (let row of this.rows) {
      row.updateTasksPosAndSize()
    }
  }

  getExpandedFrom (from?: moment.Moment) {
    from = from ? moment(from) : from

    let minRowFrom = from
    for (let row of this.rows) {
      if (minRowFrom === undefined || minRowFrom > row.from) {
        minRowFrom = row.from
      }
    }
    if (minRowFrom && (!from || minRowFrom < from)) {
      return minRowFrom
    }
    return from
  }

  getExpandedTo (to?: moment.Moment) {
    to = to ? moment(to) : to

    let maxRowTo = to
    for (let row of this.rows) {
      if (maxRowTo === undefined || maxRowTo < row.to) {
        maxRowTo = row.to
      }
    }
    let toDate = this.gantt.options.value('toDate')
    if (maxRowTo && (!toDate || maxRowTo > toDate)) {
      return maxRowTo
    }
    return to
  }

  getDefaultFrom () {
    let defaultFrom
    for (let row of this.rows) {
      if (defaultFrom === undefined || row.from < defaultFrom) {
        defaultFrom = row.from
      }
    }
    return defaultFrom
  }

  getDefaultTo () {
    let defaultTo
    for (let row of this.rows) {
      if (defaultTo === undefined || row.to > defaultTo) {
        defaultTo = row.to
      }
    }
    return defaultTo
  }
}

export default function (GanttRow: { new(rowsManager: GanttRowsManager, model: GanttRowModel): GanttRow },
                         ganttArrays: GanttArrays,
                         $filter: IGanttFilterService,
                         $timeout: ITimeoutService) {
  'ngInject'

  GanttRowsManager.GanttRow = GanttRow
  GanttRowsManager.$filter = $filter
  GanttRowsManager.$timeout = $timeout
  GanttRowsManager.ganttArrays = ganttArrays
  return GanttRowsManager
}
