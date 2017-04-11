require('angular-mocks');

describe('Api', function () {
  // Load the module with MainController
  beforeEach(function () {
    module('gantt');
  });

  var GanttApi;
  var scope;

  beforeEach(inject(['$controller', '$rootScope', 'GanttApi', function (_$controller_, _$rootScope_, _GanttApi_) {
    GanttApi = _GanttApi_;
    scope = _$rootScope_;
  }]));

  it('Register and Unregister events properly',
    function () {
      var api = new GanttApi(this);

      var called1 = false;
      var called2 = false;

      api.registerEvent('test', 'called');
      this.testMethod = function () {
        called1 = true;
        api.test.raise.called();
      };

      var unregister = api.test.on.called(scope, function () {
        called2 = true;
      });

      this.testMethod();

      expect(called1).toBeTruthy();
      expect(called2).toBeTruthy();

      called1 = false;
      called2 = false;

      unregister();

      this.testMethod();

      expect(called1).toBeTruthy();
      expect(called2).toBeFalsy();
    }
  );

  it('Can temporary suppress events',
    function () {
      var api = new GanttApi(this);

      var called1 = false;
      var called2 = false;

      var self = this;

      api.registerEvent('test', 'called');
      this.testMethod = function () {
        called1 = true;
        api.test.raise.called();
      };

      var calledHandler = function () {
        called2 = true;
      };
      api.test.on.called(scope, calledHandler);

      api.suppressEvents(calledHandler, function () {
        self.testMethod();
      });

      expect(called1).toBeTruthy();
      expect(called2).toBeFalsy();

      called1 = false;
      called2 = false;

      this.testMethod();

      expect(called1).toBeTruthy();
      expect(called2).toBeTruthy();
    }
  );
});
