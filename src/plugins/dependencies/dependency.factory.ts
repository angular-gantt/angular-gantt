import GanttUtilsService from '../../core/logic/util/utils.service';

export default function (ganttUtils: GanttUtilsService, ganttDom) {
  'ngInject';

  /**
   * Constructor of Dependency object.
   *
   * @param manager Dependency manager used by this dependency
   * @param task Task declaring the dependency
   * @param model model of the dependency
   *
   * @constructor
   *
   * @see https://jsplumbtoolkit.com/community/apidocs/classes/jsPlumb.html#method_connect
   */
  let Dependency = function (manager, task, model) {
    let self = this;

    this.manager = manager;
    this.task = task;
    this.model = model;
    this.connection = undefined;
    this.fallbackEndpoints = [];

    /**
     * Check if this dependency is connected.
     *
     * @returns {boolean}
     */
    this.isConnected = function () {
      if (this.connection) {
        return true;
      }
      return false;
    };

    /**
     * Disconnect this dependency.
     */
    this.disconnect = function () {
      if (this.connection) {
        if (this.connection.endpoints) {
          if (this.manager.plumb.detach) {
            // JSPlumb < 2.4.0
            this.manager.plumb.detach(this.connection);
          } else {
            // JSPlumb >= 2.4.0
            this.manager.plumb.deleteConnection(this.connection);
          }
        }
        this.connection.$dependency = undefined;
        this.connection = undefined;
      }

      this.deleteFallbackEndpoints();
    };

    this.deleteFallbackEndpoints = function () {
      if (this.fallbackEndpoints) {
        for (let fallbackEndpoints of this.fallbackEndpoints) {
          self.manager.plumb.deleteEndpoint(fallbackEndpoints);
        }
        this.fallbackEndpoints = [];
      }
    };

    this.getFromTaskId = function () {
      if (this.model.from !== undefined) {
        return this.model.from;
      }
      return this.task.model.id;
    };

    this.getToTaskId = function () {
      if (this.model.to !== undefined) {
        return this.model.to;
      }
      return this.task.model.id;
    };

    this.getFromTask = function () {
      if (this.model.from !== undefined) {
        return this.manager.getTask(this.model.from);
      }
      return this.task;
    };

    this.getToTask = function () {
      if (this.model.to !== undefined) {
        return this.manager.getTask(this.model.to);
      }
      return this.task;
    };

    this.removeFromTaskModel = function () {
      let modelIndex = ganttUtils.angularIndexOf(this.task.model.dependencies, this.model);
      if (modelIndex >= 0) {
        this.task.model.dependencies.splice(modelIndex, 1);
      }
      return modelIndex;
    };

    let isTaskVisible = function (task) {
      if (task === undefined || task.$element === undefined) {
        return false;
      }
      let element = task.$element[0];
      return ganttDom.isElementVisible(element);
    };

    /**
     * Connect this dependency if both elements are available.
     *
     * @returns {boolean}
     */
    this.connect = function () {
      let fromTask = this.getFromTask();
      let toTask = this.getToTask();

      if (!isTaskVisible(fromTask)) {
        fromTask = undefined;
      }

      if (!isTaskVisible(toTask)) {
        toTask = undefined;
      }

      if (fromTask && toTask) {
        let connection = this.manager.connect(fromTask, toTask, this.model);
        if (connection) {
          connection.$dependency = this;
          this.connection = connection;
          return true;
        }
      }

      this.deleteFallbackEndpoints();
      if (fromTask !== undefined) {
        let toFallbackEndpoint = this.manager.pluginScope.fallbackEndpoints[1];
        this.fallbackEndpoints.push(this.manager.plumb.addEndpoint(fromTask.$element, toFallbackEndpoint));
      }
      if (toTask !== undefined) {
        let fromFallbackEndpoint = this.manager.pluginScope.fallbackEndpoints[0];
        this.fallbackEndpoints.push(this.manager.plumb.addEndpoint(toTask.$element, fromFallbackEndpoint));
      }
      return false;
    };
  };
  return Dependency;
}
