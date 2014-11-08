'use strict';
gantt.service('ganttArrays', [function() {
    return {
        moveToIndex: function (array, oldIndex, newIndex) {
            if (newIndex >= array.length) {
                var k = newIndex - array.length;
                while ((k--) + 1) {
                    array.push(undefined);
                }
            }
            array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
            return array;
        }
    };
}]);
