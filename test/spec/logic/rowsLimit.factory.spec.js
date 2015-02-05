'use strict';
describe('Unit: Gantt', function() {
	beforeEach(function(){
		module('gantt');
		module('gantt.row.limit');
	});

	var Gantt;
	var moment;
	var $controller;
    var $rootScope;
    var $compile;
    var $timeout;
	var $document;

	var mockData = [
        // Order is optional. If not specified it will be assigned automatically
        {
            'name': 'Milestones', 'height': '3em', classes: 'gantt-row-milestone', 'color': '#45607D', 'tasks': [
            // Dates can be specified as string, timestamp or javascript date object. The data attribute can be used to attach a custom object
            {
                'name': 'Kickoff',
                'color': '#93C47D',
                'from': '2013-10-07T09:00:00',
                'to': '2013-10-07T10:00:00',
                'data': 'Can contain any custom data or object'
            },
            {
                'name': 'Concept approval',
                'color': '#93C47D',
                'from': new Date(2013, 9, 18, 18, 0, 0),
                'to': new Date(2013, 9, 18, 18, 0, 0),
                'est': new Date(2013, 9, 16, 7, 0, 0),
                'lct': new Date(2013, 9, 19, 0, 0, 0)
            },
            {
                'name': 'Development finished',
                'color': '#93C47D',
                'from': new Date(2013, 10, 15, 18, 0, 0),
                'to': new Date(2013, 10, 15, 18, 0, 0)
            },
            {
                'name': 'Shop is running',
                'color': '#93C47D',
                'from': new Date(2013, 10, 22, 12, 0, 0),
                'to': new Date(2013, 10, 22, 12, 0, 0)
            },
            {
                'name': 'Go-live',
                'color': '#93C47D',
                'from': new Date(2013, 10, 29, 16, 0, 0),
                'to': new Date(2013, 10, 29, 16, 0, 0)
            }
        ], 'data': 'Can contain any custom data or object'
        },
        {
            'name': 'Status meetings', 'height': '20px','tasks': [
            {
                'name': 'Demo',
                'color': '#9FC5F8',
                'from': new Date(2013, 9, 25, 15, 0, 0),
                'to': new Date(2013, 9, 25, 18, 30, 0)
            },
            {
                'name': 'Demo',
                'color': '#9FC5F8',
                'from': new Date(2013, 10, 1, 15, 0, 0),
                'to': new Date(2013, 10, 1, 18, 0, 0)
            },
            {
                'name': 'Demo',
                'color': '#9FC5F8',
                'from': new Date(2013, 10, 8, 15, 0, 0),
                'to': new Date(2013, 10, 8, 18, 0, 0)
            },
            {
                'name': 'Demo',
                'color': '#9FC5F8',
                'from': new Date(2013, 10, 15, 15, 0, 0),
                'to': new Date(2013, 10, 15, 18, 0, 0)
            },
            {
                'name': 'Demo',
                'color': '#9FC5F8',
                'from': new Date(2013, 10, 24, 9, 0, 0),
                'to': new Date(2013, 10, 24, 10, 0, 0)
            }
        ]
        },
        {
            'name': 'Kickoff', 'height': '20px', 'tasks': [
            {
                'name': 'Day 1',
                'color': '#9FC5F8',
                'from': new Date(2013, 9, 7, 9, 0, 0),
                'to': new Date(2013, 9, 7, 17, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}
            },
            {
                'name': 'Day 2',
                'color': '#9FC5F8',
                'from': new Date(2013, 9, 8, 9, 0, 0),
                'to': new Date(2013, 9, 8, 17, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}
            },
            {
                'name': 'Day 3',
                'color': '#9FC5F8',
                'from': new Date(2013, 9, 9, 8, 30, 0),
                'to': new Date(2013, 9, 9, 12, 0, 0),
                'progress': {'percent': 100, 'color': '#3C8CF8'}
            }
        ]
        },
        {
            'name': 'Create concept', 'height': '20px', 'tasks': [
            {
                'name': 'Create concept',
                'color': '#F1C232',
                'from': new Date(2013, 9, 10, 8, 0, 0),
                'to': new Date(2013, 9, 16, 18, 0, 0),
                'est': new Date(2013, 9, 8, 8, 0, 0),
                'lct': new Date(2013, 9, 18, 20, 0, 0),
                'progress': 100
            }
        ]
        },
        {
            'name': 'Finalize concept', 'height': '20px', 'tasks': [
            {
                'name': 'Finalize concept',
                'color': '#F1C232',
                'from': new Date(2013, 9, 17, 8, 0, 0),
                'to': new Date(2013, 9, 18, 18, 0, 0),
                'progress': 100
            }
        ]
        },
        {
            'name': 'Sprint 1', 'height': '20px', 'tasks': [
            {
                'name': 'Product list view',
                'color': '#F1C232',
                'from': new Date(2013, 9, 21, 8, 0, 0),
                'to': new Date(2013, 9, 25, 15, 0, 0),
                'progress': 25
            }
        ]
        },
        {
            'name': 'Sprint 2', 'height': '20px', 'tasks': [
            {
                'name': 'Order basket',
                'color': '#F1C232',
                'from': new Date(2013, 9, 28, 8, 0, 0),
                'to': new Date(2013, 10, 1, 15, 0, 0)
            }
        ]
        },
        {
            'name': 'Sprint 3', 'height': '20px', 'tasks': [
            {
                'name': 'Checkout',
                'color': '#F1C232',
                'from': new Date(2013, 10, 4, 8, 0, 0),
                'to': new Date(2013, 10, 8, 15, 0, 0)
            }
        ]
        },
        {
            'name': 'Sprint 4', 'height': '20px', 'tasks': [
            {
                'name': 'Login&Singup and admin view',
                'color': '#F1C232',
                'from': new Date(2013, 10, 11, 8, 0, 0),
                'to': new Date(2013, 10, 15, 15, 0, 0)
            }
        ]
        },
        {
            'name': 'Setup server', 'height': '20px', 'tasks': [
            {
                'name': 'HW',
                'color': '#F1C232',
                'from': new Date(2013, 10, 18, 8, 0, 0),
                'to': new Date(2013, 10, 18, 12, 0, 0)
            }
        ]
        },
        {
            'name': 'Config server', 'height': '20px', 'tasks': [
            {
                'name': 'SW / DNS/ Backups',
                'color': '#F1C232',
                'from': new Date(2013, 10, 18, 12, 0, 0),
                'to': new Date(2013, 10, 21, 18, 0, 0)
            }
        ]
        },
        {
            'name': 'Deployment', 'height': '20px', 'tasks': [
            {
                'name': 'Depl. & Final testing',
                'color': '#F1C232',
                'from': new Date(2013, 10, 21, 8, 0, 0),
                'to': new Date(2013, 10, 22, 12, 0, 0),
                'classes': 'gantt-task-deployment'
            }
        ]
        },
        {
            'name': 'Workshop', 'height': '20px', 'tasks': [
            {
                'name': 'On-side education',
                'color': '#F1C232',
                'from': new Date(2013, 10, 24, 9, 0, 0),
                'to': new Date(2013, 10, 25, 15, 0, 0)
            }
        ]
        },
        {
            'name': 'Content', 'height': '20px', 'tasks': [
            {
                'name': 'Supervise content creation',
                'color': '#F1C232',
                'from': new Date(2013, 10, 26, 9, 0, 0),
                'to': new Date(2013, 10, 29, 16, 0, 0)
            }
        ]
        },
        {
            'name': 'Documentation', 'height': '20px', 'tasks': [
            {
                'name': 'Technical/User documentation',
                'color': '#F1C232',
                'from': new Date(2013, 10, 26, 8, 0, 0),
                'to': new Date(2013, 10, 28, 18, 0, 0)
            }
        ]
        }
    ];

    beforeEach(inject(['$controller', '$rootScope', '$compile', '$timeout','$document', 'Gantt', 'moment', function(_$controller_, _$rootScope_, _$compile_, _$timeout_, _$document_ , _Gantt_, _moment_) {
        Gantt = _Gantt_;
        moment = _moment_;
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $timeout = _$timeout_;
        $document = _$document_;
    }]));



	it('check on top no before row', function(){

		var $scope = $rootScope.$new();

        $scope.data = angular.copy(mockData);
		$scope.api = function(api){
			
			api.rows.on.viewUpdate($scope, function(){
				expect(api.gantt.rowsManager.visibleRows.length).toEqual(15);
			});
		};

		$compile('<div gantt api="api" data="data" max-height="120">'+
			'<angular-gantt-row-limit></angular-gantt-row-limit>' +
			'</div>')($scope);
        $scope.$digest();
        $timeout.flush();
	});
});