//
// suspendable.js
//
// Copyright (c) 2015 by Curalate, Inc.
//


    /* This directive is used to dynamically bind and unbind watchers in a scope.
     * This is useful when one is attempting to load pages with large numbers of interactive items
     * The directive will watch all of the scopes within (but not including) the element it was attached to.
     * Usage:
     *  <div class="container" suspendable>
     *      <div class="item" ng-repeat="item in items"></div>
     *  </div>
     *  In the example above, all scopes generated inside of div.container will have their watchers removed if the
     *  div.item is scrolled/resized out of view
     */
declare var prevUniqueNumber;

app.directive('suspendable', ['$timeout', ($timeout: ng.ITimeoutService) => {
    return {
        link: (scope, element, attrs:any) => {
            var $window = $(window),
                DEBUG = attrs.suspendableDebug === 'true',
                watchersForId = {},
                uniqueSuspendableId = Math.random().toString(32).slice(2),
                trackedEvents = ['scroll.suspendable-' + uniqueSuspendableId, 'resize.suspendable-' + uniqueSuspendableId],
                heartbeat,
                scopeCheckFunc;

            // Attach custom events "suspend" and "resume" to our "suspendable" element
            // Whenever these events get fired, we pass a unique identifier corresponding to
            // the contained ng-scope to suspend/resume. We keep a map of scopeId -> scope.$$watchers
            // Keep these events as raw jQuery, using $rootScope.$on and $rootScope.$emit as an event bus
            // led to additional performance issues
            element.on('suspend', (event, suspendId, scopeToSuspend)=> {
                if (!watchersForId[suspendId]) {
                    watchersForId[suspendId] = scopeToSuspend.$$watchers;
                    scopeToSuspend.$$watchers = [];
                }
            }).on('resume',(event, resumeId, scopeToResume)=> {
                if (watchersForId[resumeId]) {
                    scopeToResume.$$watchers = watchersForId[resumeId];
                    delete watchersForId[resumeId];
                }
            });

            // If the scope gets destroyed, unbind the listeners we created
            scope.$on('$destroy', ()=> {
                $window.off(trackedEvents.join(" "));
                element.off('suspend resume');
                clearInterval(heartbeat);
                watchersForId = null;
            });

            scopeCheckFunc = () => {
                var windowOffset = $window.scrollTop(),
                    windowHeight = $window.height(),
                    scopeElems = element.find('.ng-scope, .ng-isolate-scope');
                var scopes = [];
                for (var j = 0; j < scopeElems.length; j++) {
                    var to_add = {
                        scope: angular.element(scopeElems[j]).scope(),
                        elem: scopeElems[j]
                    }
                    scopes.push(to_add);
                }

                for (var i = 0;i < scopes.length; i++) {
                    var $elem = $(scopes[i].elem),
                        offset = $elem.offset();

                    if (!$elem.attr('data-scope-id')) {
                        $elem.attr('data-scope-id', uniqueNumber());
                    }

                    // TODO this implementation is naive and there should be finer grained checks around an element's position vs page position
                    var event = (offset.top <= windowOffset || offset.top >= windowOffset + windowHeight || !$elem.is(':visible')) ? 'suspend' : 'resume';

                    if (DEBUG) {
                        if (event === 'suspend') {
                            $elem.css("border-color", 'red');
                        } else if (event === 'resume') {
                            $elem.css("border-color", 'green');
                        }
                    }

                    element.trigger(event, [$elem.attr('data-scope-id'), scopes[i].scope]);
                }
            };

            // Clean up after long/fast scrolls and reattach if hidden elements become visible
            heartbeat = setInterval(scopeCheckFunc, 2500);

            // Attach namespaced scroll and resize events to the window object. Only call the listener every 50ms
            // The listener will find all scopes within the container, attach a unique ID if necessary, and trigger
            // the appropriate event based on window scroll position and element offset.
            $window.on((<any>trackedEvents).join(" "), $timeout(() => { scopeCheckFunc },50));
        }
    };
}]);

prevUniqueNumber = 0;
function uniqueNumber() {
    var date = Date.now();

    // If created at same millisecond as previous
    if (date <= prevUniqueNumber) {
        date = ++prevUniqueNumber;
    } else {
        prevUniqueNumber= date;
    }

    return date;
}

