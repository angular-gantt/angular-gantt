'use strict';

describe('Service: Sample', function() {

    // load the service's module
    beforeEach(module('angularGanttDemoApp'));

    // instantiate service
    var Sample;
    beforeEach(inject(function(_Sample_) {
        Sample = _Sample_;
    }));

    it('should do something', function() {
        expect(!!Sample).toBe(true);
    });

});
