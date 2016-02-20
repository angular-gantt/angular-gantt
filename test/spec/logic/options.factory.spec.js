(function() {
    'use strict';
    describe('Options', function() {
        // Load the module with MainController
        beforeEach(function() {
            module('gantt');
        });

        var Options;
        var $controller;
        var $rootScope;
        var $compile;

        beforeEach(inject(['$controller', '$rootScope', '$compile', 'GanttOptions', function(_$controller_, _$rootScope_, _$compile_, _Options_) {
            Options = _Options_;
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $compile = _$compile_;
        }]));

        it('should return undefined for a non existing option value',
            function() {
                var $scope = $rootScope.$new();

                var options = new Options($scope, {});

                var value = options.value('non existing');

                expect(value).toBeUndefined();
            }
        );

        it('should return the value for a existing option value (non-boolean)',
            function() {
                var $scope = $rootScope.$new();

                $scope.existing = 100;
                var options = new Options($scope, {});

                var value = options.value('existing');

                expect(value).toEqual(100);
            }
        );

        it('should return the default value for a non existing option value (non-boolean)',
            function() {
                var $scope = $rootScope.$new();

                var options = new Options($scope, {
                    'default': 100
                });

                var value = options.value('default');

                expect(value).toEqual(100);
            }
        );

        it('should return false for a existing non-truthy option value',
            function() {
                var $scope = $rootScope.$new();

                $scope.existing = false;
                var options = new Options($scope, {});

                var value = options.value('existing');

                expect(value).toEqual(false);
            }
        );

        it('should return true for a existing truthy option value',
            function() {
                var $scope = $rootScope.$new();

                $scope.existing = true;
                var options = new Options($scope, {});

                var value = options.value('existing');

                expect(value).toEqual(true);
            }
        );

        it('should return false as default value for a non existing non-truthy option value',
            function() {
                var $scope = $rootScope.$new();

                var options = new Options($scope, {
                    'default': false
                });

                var value = options.value('default');

                expect(value).toEqual(false);
            }
        );

        it('should return true as default value for a non existing truthy option value',
            function() {
                var $scope = $rootScope.$new();

                var options = new Options($scope, {
                    'default': true
                });

                var value = options.value('default');

                expect(value).toEqual(true);
            }
        );

        it('should return false for a non-truthy option value which has a default value',
            function() {
                var $scope = $rootScope.$new();

                $scope.existing = false;
                var options = new Options($scope, {
                    'existing': true
                });

                var value = options.value('existing');

                expect(value).toEqual(false);
            }
        );

        it('should return true for a truthy boolean option value which has a default value',
            function() {
                var $scope = $rootScope.$new();

                $scope.existing = true;
                var options = new Options($scope, {
                    'existing': false
                });

                var value = options.value('existing');

                expect(value).toEqual(true);
            }
        );

        it('should set an option value to the specified value',
            function() {
                var $scope = $rootScope.$new();

                var options = new Options($scope, {});

                options.set('toSet', 100);
                expect($scope.toSet).toEqual(100);

                var value = options.value('toSet');
                expect(value).toEqual(100);
            }
        );
    });
})();
