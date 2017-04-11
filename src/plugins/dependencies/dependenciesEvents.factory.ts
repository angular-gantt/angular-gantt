export default function () {
  'ngInject';
  /**
   * Creates a new DependenciesEvents object.
   *
   * @param manager DependenciesManager object
   * @constructor
   */
  let DependenciesEvents = function (manager) {
    let self = this;

    this.manager = manager;

    // Deny the start of a drag when in readonly
    let denyDragWhenReadOnly = function () {
      return !self.manager.pluginScope.readOnly;
    };

    this.manager.plumb.bind('beforeDrag', denyDragWhenReadOnly);
    this.manager.plumb.bind('beforeStartDetach', denyDragWhenReadOnly);

    // Deny drop on the same task.
    let denyDropOnSameTask = function (params) {
      return params.sourceId !== params.targetId;
    };

    this.manager.plumb.bind('beforeDrop', denyDropOnSameTask);

    // Notify the manager that a connection is being created.
    this.manager.plumb.bind('connectionDrag', function (connection) {
      self.manager.setDraggingConnection(connection);
    });

    this.manager.plumb.bind('connectionDragStop', function () {
      self.manager.setDraggingConnection(undefined);
    });

    this.manager.plumb.bind('beforeDrop', function () {
      self.manager.setDraggingConnection(undefined);
      return true;
    });

    let createConnection = function (info, mouseEvent) {
      if (mouseEvent) {
        let oldDependency;
        if (info.connection.$dependency) {
          oldDependency = info.connection.$dependency;
        }

        let sourceEndpoint = info.sourceEndpoint;
        let targetEndpoint = info.targetEndpoint;

        let sourceModel = sourceEndpoint.$task.model;

        let dependenciesModel = sourceModel.dependencies;
        if (dependenciesModel === undefined) {
          dependenciesModel = [];
          sourceModel.dependencies = dependenciesModel;
        }

        let connectionModel = {to: targetEndpoint.$task.model.id};
        dependenciesModel.push(connectionModel);

        if (oldDependency) {
          oldDependency.removeFromTaskModel();
          self.manager.removeDependency(oldDependency, true); // Connection will be disconnected later by jsPlumb.
        }

        let dependency = self.manager.addDependency(sourceEndpoint.$task, connectionModel);
        info.connection.$dependency = dependency;
        dependency.connection = info.connection;
        dependency.connection.setParameter('from', sourceEndpoint.$task);
        dependency.connection.setParameter('to', targetEndpoint.$task);
        dependency.connection.canvas.setAttribute('data-fromId', sourceEndpoint.$task.model.id);
        dependency.connection.canvas.setAttribute('data-toId', targetEndpoint.$task.model.id);

        self.manager.api.dependencies.raise.add(dependency);

      }
    };

    let updateConnection = function (info, mouseEvent) {
      if (mouseEvent) {
        let oldDependency;
        if (info.connection.$dependency) {
          oldDependency = info.connection.$dependency;
        }

        let sourceEndpoint = info.newSourceEndpoint;
        let targetEndpoint = info.newTargetEndpoint;

        let sourceModel = sourceEndpoint.$task.model;

        let dependenciesModel = sourceModel.dependencies;
        if (dependenciesModel === undefined) {
          dependenciesModel = [];
          sourceModel.dependencies = dependenciesModel;
        }

        let connectionModel = {to: targetEndpoint.$task.model.id};
        dependenciesModel.push(connectionModel);

        if (oldDependency) {
          oldDependency.removeFromTaskModel();
          self.manager.removeDependency(oldDependency, true); // Connection will be disconnected later by jsPlumb.
        }

        let dependency = self.manager.addDependency(sourceEndpoint.$task, connectionModel);
        info.connection.$dependency = dependency;
        dependency.connection = info.connection;
        dependency.connection.setParameter('from', sourceEndpoint.$task);
        dependency.connection.setParameter('to', targetEndpoint.$task);
        dependency.connection.canvas.setAttribute('data-fromId', sourceEndpoint.$task.model.id);
        dependency.connection.canvas.setAttribute('data-toId', targetEndpoint.$task.model.id);

        self.manager.api.dependencies.raise.change(dependency, oldDependency);
      }
    };

    let deleteConnection = function (info, mouseEvent) {
      if (mouseEvent) {
        let dependency = info.connection.$dependency;

        dependency.removeFromTaskModel();
        self.manager.removeDependency(dependency, true); // Connection will be disconnected later by jsPlumb.
        self.manager.api.dependencies.raise.remove(dependency);
      }
    };

    this.manager.plumb.bind('connectionMoved', updateConnection);
    this.manager.plumb.bind('connection', createConnection);
    this.manager.plumb.bind('connectionDetached', deleteConnection);

  };
  return DependenciesEvents;
}
