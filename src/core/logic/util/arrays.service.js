(function(){
    'use strict';
    angular.module('gantt').service('ganttArrays', [function() {
        return {
            moveToIndex: function(array, oldIndex, newIndex) {
                if (newIndex >= array.length) {
                    var k = newIndex - array.length;
                    while ((k--) + 1) {
                        array.push(undefined);
                    }
                }
                array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
                return array;
            },
            getRemovedIds: function(newArray, oldArray, idProperty) {
                if (idProperty === undefined) {
                    idProperty = 'id';
                }

                var i, l;
                var removedIds = [];

                if (oldArray !== undefined) {
                    for (i = 0, l = oldArray.length; i < l; i++) {
                        removedIds.push(oldArray[i][idProperty]);
                    }
                }

                if (newArray !== undefined) {
                    for (i = 0, l = newArray.length; i < l; i++) {
                        var newObject = newArray[i];

                        if (newObject[idProperty] !== undefined) {
                            var newObjectIndex = removedIds.indexOf(newObject[idProperty]);
                            if (newObjectIndex > -1) {
                                removedIds.splice(newObjectIndex, 1);
                            }
                        }
                    }
                }

                return removedIds;
            },
            indexOfId: function(array, value, idProperties) {
                var i;
                if (idProperties === undefined) {
                    idProperties = 'id';
                } else if (idProperties instanceof Array) {
                    for (i = array.length - 1; i >= 0; i--) {
                        var arrayValue = array[i];
                        for (var k = 0, l = idProperties.length; k < l; k++) {
                            arrayValue = arrayValue[idProperties[k]];
                        }
                        if (arrayValue === value) {
                            return i;
                        }
                    }
                    return -1;
                }
                for (i = array.length - 1; i >= 0; i--) {
                    if (array[i][idProperties] === value) {
                        return i;
                    }
                }
                return -1;
            },
            removeId: function(array, value, idProperties) {
                var indexOf = this.indexOfId(array, value, idProperties);
                if (indexOf > -1) {
                    return array.splice(indexOf, 1)[0];
                }
            },
            remove: function(array, value) {
                var index = array.indexOf(value);
                if (index > -1) {
                    array.splice(index, 1);
                    return true;
                }
                return false;
            }
        };
    }]);
}());

