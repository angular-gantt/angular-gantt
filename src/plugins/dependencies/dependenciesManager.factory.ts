import jsplumb from 'jsplumb'
import {GanttTask} from '../../core/logic/task/task.factory'

export default function (GanttDependency, GanttDependenciesEvents, GanttDependencyTaskMouseHandler) {
  'ngInject'

  let DependenciesManager = function (gantt, pluginScope, api) {
    let self = this

    this.gantt = gantt
    this.pluginScope = pluginScope
    this.api = api

    this.api.registerEvent('dependencies', 'add')
    this.api.registerEvent('dependencies', 'change')
    this.api.registerEvent('dependencies', 'remove')

    this.plumb = jsplumb.jsPlumb ? jsplumb.jsPlumb.getInstance() : jsplumb.getInstance() // Workaround for build issue.
    this.plumb.importDefaults(this.pluginScope.jsPlumbDefaults)

    this.dependenciesFrom = {}
    this.dependenciesTo = {}

    this.tasksList = []
    this.tasks = {}

    this.events = new GanttDependenciesEvents(this)

    this.pluginScope.$watch('enabled', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        self.refresh()
      }
    })

    this.pluginScope.$watch('readOnly', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        self.setTasks(self.tasksList)
        self.refresh()
      }
    })

    this.pluginScope.$watch('jsPlumbDefaults', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        self.plumb.importDefaults(newValue)
        self.refresh()
      }
    }, true)

    /**
     * Add all dependencies defined from a task. Dependencies will be added only if plugin is enabled.
     *
     * @param task
     * @param allowPartial if true, dependency linking to a missing task will still be added.
     */
    this.addDependenciesFromTask = function (task, allowPartial) {
      if (this.pluginScope.enabled) {
        let taskDependencies = task.model.dependencies

        if (taskDependencies !== undefined && taskDependencies) {
          if (!Array.isArray(taskDependencies)) {
            taskDependencies = [taskDependencies]
            task.model.dependencies = taskDependencies
          }

          // tslint:disable:one-variable-per-declaration
          for (let i = 0, l = taskDependencies.length; i < l; i++) {
            let dependency = self.addDependency(task, taskDependencies[i], allowPartial)
            if (dependency) {
              dependency.connect()
            }
          }
        }
      }
    }

    /**
     * Remove all dependencies defined for a task.
     *
     * @param task
     * @param keepConnection if true, dependency will not be disconnected.
     */
    this.removeDependenciesFromTask = function (task, keepConnection) {
      let dependencies = this.getTaskDependencies(task)

      if (dependencies) {
        for (let dependency of dependencies) {
          if (!keepConnection) {
            dependency.disconnect()
          }
          self.removeDependency(dependency)
        }
      }
    }

    /**
     * Add definition of a dependency.
     *
     * @param task Task defining the dependency.
     * @param model Model object for the dependency.
     * @param allowPartial if true, dependency linking to a missing task will still be added.
     */
    this.addDependency = function (task, model, allowPartial) {
      let dependency = new GanttDependency(this, task, model)
      let fromTaskId = dependency.getFromTaskId()
      let fromTask = dependency.getFromTask()
      let toTaskId = dependency.getToTaskId()
      let toTask = dependency.getToTask()
      let manager = dependency.manager

      if (!(fromTaskId in this.dependenciesFrom)) {
        this.dependenciesFrom[fromTaskId] = []
      }
      if (!(toTaskId in this.dependenciesTo)) {
        this.dependenciesTo[toTaskId] = []
      }

      if (!allowPartial && (!toTask || !fromTask)) {
        // Partial dependency is not allowed, remove it.
        this.removeDependency(dependency, true)

        manager.api.dependencies.raise.remove(dependency)

        return null
      } else {
        if (fromTaskId) {
          this.dependenciesFrom[fromTaskId].push(dependency)
        }

        if (toTaskId) {
          this.dependenciesTo[toTaskId].push(dependency)
        }
      }

      return dependency
    }

    /**
     * Remove definition of a dependency
     *
     * @param dependency Dependency object
     * @param keepConnection if true, dependency will not be disconnected.
     */
    this.removeDependency = function (dependency, keepConnection) {
      let fromDependencies = this.dependenciesFrom[dependency.getFromTaskId()]
      let fromRemove = []
      let i

      if (fromDependencies) {
        for (i = 0; i < fromDependencies.length; i++) {
          if (dependency === fromDependencies[i]) {
            fromRemove.push(dependency)
          }
        }
      }

      let toDependencies = this.dependenciesTo[dependency.getToTaskId()]
      let toRemove = []

      if (toDependencies) {
        for (i = 0; i < toDependencies.length; i++) {
          if (dependency === toDependencies[i]) {
            toRemove.push(dependency)
          }
        }
      }

      for (i = 0; i < fromRemove.length; i++) {
        if (!keepConnection) {
          fromRemove[i].disconnect()
        }
        fromDependencies.splice(fromDependencies.indexOf(dependency), 1)
      }

      for (i = 0; i < toRemove.length; i++) {
        if (!keepConnection) {
          toRemove[i].disconnect()
        }
        toDependencies.splice(toDependencies.indexOf(dependency), 1)
      }

      if (this.dependenciesFrom[dependency.getFromTaskId()] &&
        this.dependenciesFrom[dependency.getFromTaskId()].length === 0) {
        delete this.dependenciesFrom[dependency.getFromTaskId()]
      }

      if (this.dependenciesTo[dependency.getToTaskId()] &&
        this.dependenciesTo[dependency.getToTaskId()].length === 0) {
        delete this.dependenciesTo[dependency.getToTaskId()]
      }
    }

    this.getTaskDependencies = function (task: GanttTask) {
      let dependencies = []

      let fromDependencies = self.dependenciesFrom[task.model.id]
      if (fromDependencies) {
        dependencies = dependencies.concat(fromDependencies)
      }

      let toDependencies = self.dependenciesTo[task.model.id]
      if (toDependencies) {
        dependencies = dependencies.concat(toDependencies)
      }

      return dependencies
    }

    this.setDraggingConnection = function (connection) {
      if (connection) {
        self.draggingConnection = connection
        for (let taskId in self.tasks) {
          let task = self.tasks[taskId]
          task.dependencies.mouseHandler.release()
        }
      } else {
        self.draggingConnection = undefined
        for (let taskId in self.tasks) {
          let task = self.tasks[taskId]
          task.dependencies.mouseHandler.install()
        }
      }
    }

    let isTaskEnabled = function (task) {
      let rowDependencies = task.row.model.dependencies
      if (rowDependencies !== undefined) {
        return rowDependencies !== false
      }
      let taskDependencies = task.model.dependencies
      if (taskDependencies !== undefined) {
        return taskDependencies !== false
      }
      return true
    }

    let addTaskEndpoints = function (task) {
      if (!task.dependencies) {
        task.dependencies = {}
      }

      task.dependencies.endpoints = []

      if (self.pluginScope.endpoints && task.$element) {
        for (let endpoint of self.pluginScope.endpoints) {
          let endpointObject = self.plumb.addEndpoint(task.$element, endpoint)
          endpointObject.setVisible(false, true, true) // hide endpoint
          endpointObject.$task = task
          task.dependencies.endpoints.push(endpointObject)
        }
      }

    }

    let removeTaskEndpoint = function (task) {
      if (task.dependencies.endpoints) {
        for (let endpointObject of task.dependencies.endpoints) {
          self.plumb.deleteEndpoint(endpointObject)
          endpointObject.$task = undefined
        }

        task.dependencies.endpoints = undefined
      }
    }

    let addTaskMouseHandler = function (task) {
      if (!task.dependencies) {
        task.dependencies = {}
      }

      if (!self.pluginScope.readOnly) {
        task.dependencies.mouseHandler = new GanttDependencyTaskMouseHandler(self, task)
        task.dependencies.mouseHandler.install()
      }
    }

    let removeTaskMouseHandler = function (task) {
      if (task.dependencies.mouseHandler) {
        task.dependencies.mouseHandler.release()
        task.dependencies.mouseHandler = undefined
      }
    }

    /**
     * Set tasks objects that can be used to display dependencies.
     *
     * @param tasks
     */
    this.setTasks = function (tasks: GanttTask[]) {
      for (let taskId in self.tasks) {
        let task = self.tasks[taskId]
        removeTaskMouseHandler(task)
        removeTaskEndpoint(task)
      }

      let newTasks = {}
      let tasksList = []
      for (let task of tasks) {
        if (isTaskEnabled(task)) {
          newTasks[task.model.id] = task
          tasksList.push(task)
          addTaskEndpoints(task)
          addTaskMouseHandler(task)
        }
      }
      self.tasks = newTasks
      self.tasksList = tasks
    }

    let disconnectTaskDependencies = function (task) {
      let dependencies = self.getTaskDependencies(task)
      if (dependencies) {
        for (let dependency of dependencies) {
          dependency.disconnect()
        }
      }
      return dependencies
    }

    let connectTaskDependencies = function (task) {
      let dependencies = self.getTaskDependencies(task)
      if (dependencies) {
        for (let dependency of dependencies) {
          dependency.connect()
        }
      }
      return dependencies
    }

    /**
     * Set task object in replacement of an existing with the same id.
     *
     * @param task
     */
    this.setTask = function (task) {
      self.plumb.setSuspendDrawing(true)
      try {
        let oldTask = self.tasks[task.model.id]
        if (oldTask !== undefined) {
          disconnectTaskDependencies(oldTask)
          removeTaskMouseHandler(oldTask)
          removeTaskEndpoint(oldTask)
        }
        if (isTaskEnabled(task)) {
          self.tasks[task.model.id] = task
          addTaskEndpoints(task)
          addTaskMouseHandler(task)
          connectTaskDependencies(task)
        }
      } finally {
        self.plumb.setSuspendDrawing(false, true)
      }
    }

    /**
     * Retrieve the task from it's id.
     *
     * @param taskId id of the task element to retrieve.
     * @returns {*}
     */
    this.getTask = function (taskId) {
      return self.tasks[taskId]
    }

    let getSourceEndpoints = function (task) {
      return task.dependencies.endpoints.filter(function (endpoint) {
        return endpoint.isSource
      })
    }

    let getTargetEndpoints = function (task) {
      return task.dependencies.endpoints.filter(function (endpoint) {
        return endpoint.isTarget
      })
    }

    /**
     * Connects two tasks together using source endpoint from fromTask and target endpoint from toTask.
     *
     * @param fromTask
     * @param toTask
     * @param model
     * @returns connection object
     */
    this.connect = function (fromTask, toTask, model) {
      let sourceEndpoints = getSourceEndpoints(fromTask)
      let targetEndpoints = getTargetEndpoints(toTask)
      if (sourceEndpoints && targetEndpoints) {
        let sourceEndpoint
        let targetEndpoint

        if (model.connectParameters && model.connectParameters.sourceEndpointIndex) {
          sourceEndpoint = sourceEndpoints[model.connectParameters.sourceEndpointIndex]
        } else {
          sourceEndpoint = sourceEndpoints[0]
        }

        if (model.connectParameters && model.connectParameters.targetEndpointIndex) {
          targetEndpoint = targetEndpoints[model.connectParameters.targetEndpointIndex]
        } else {
          targetEndpoint = targetEndpoints[0]
        }

        let connection = self.plumb.connect({
          source: sourceEndpoint,
          target: targetEndpoint,
          parameters: {
            from: fromTask,
            to: toTask
          }
          // cssClass: 'gantt-endpoint start-endpoint target-endpoint connect-' + fromTask.model.id + '-' + toTask.model.id,
        }, model.connectParameters)
        connection.canvas.setAttribute('data-fromId', fromTask.model.id)
        connection.canvas.setAttribute('data-toId', toTask.model.id)
        return connection
      }
    }

    /**
     * Get all defined dependencies.
     *
     * @returns {Array}
     */
    this.getDependencies = function () {
      let allDependencies = []

      for (let fromId in this.dependenciesFrom) {
        let dependencies = this.dependenciesFrom[fromId]
        for (let dependency of dependencies) {
          if (!(dependency in allDependencies)) {
            allDependencies.push(dependency)
          }
        }
      }

      return allDependencies
    }

    /**
     * Refresh jsplumb status based on tasks dependencies models.
     */
    this.refresh = function (tasks) {
      self.plumb.setSuspendDrawing(true)

      try {
        let tasksDependencies
        let i
        if (tasks && !Array.isArray(tasks)) {
          tasks = [tasks]
        }

        if (tasks === undefined) {
          tasks = this.tasks
          tasksDependencies = this.getDependencies()
        } else {
          tasksDependencies = []
          for (let task of tasks) {
            let taskDependencies = self.getTaskDependencies(task)
            for (let taskDependency of taskDependencies) {
              if (!(taskDependency in tasksDependencies)) {
                tasksDependencies.push(taskDependency)
              }
            }
          }
        }

        for (i = 0; i < tasksDependencies.length; i++) {
          self.removeDependency(tasksDependencies[i])
        }

        for (let taskId in tasks) {
          let task = tasks[taskId]
          self.addDependenciesFromTask(task)
        }
      } finally {
        self.plumb.setSuspendDrawing(false, true)
      }
    }

    this.api.registerMethod('dependencies', 'refresh', this.refresh, this)
  }
  return DependenciesManager
}
