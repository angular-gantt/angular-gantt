'use strict';

describe('Service: Uuid', function() {

    // load the service's module
    beforeEach(module('angularGanttDemoApp'));

    // instantiate service
    var Uuid;
    beforeEach(inject(function(_Uuid_) {
        Uuid = _Uuid_;
    }));

    it('should do something', function() {
        expect(!!Uuid).toBe(true);
    });

});
