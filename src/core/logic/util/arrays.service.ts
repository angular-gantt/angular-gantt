export default function () {
  'ngInject';
  return {
    moveToIndex: function (array, oldIndex, newIndex) {
      if (newIndex >= array.length) {
        let k = newIndex - array.length;
        while ((k--) + 1) {
          array.push(undefined);
        }
      }
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
      return array;
    },
    getRemovedIds: function (newArray, oldArray, idProperty) {
      if (idProperty === undefined) {
        idProperty = 'id';
      }

      let i;
      let l;
      let removedIds = [];

      if (oldArray !== undefined) {
        for (i = 0, l = oldArray.length; i < l; i++) {
          removedIds.push(oldArray[i][idProperty]);
        }
      }

      if (newArray !== undefined) {
        for (i = 0, l = newArray.length; i < l; i++) {
          let newObject = newArray[i];

          if (newObject[idProperty] !== undefined) {
            let newObjectIndex = removedIds.indexOf(newObject[idProperty]);
            if (newObjectIndex > -1) {
              removedIds.splice(newObjectIndex, 1);
            }
          }
        }
      }

      return removedIds;
    },
    indexOfId: function (array, value, idProperties) {
      let i;
      if (idProperties === undefined) {
        idProperties = 'id';
      } else if (idProperties instanceof Array) {
        for (i = array.length - 1; i >= 0; i--) {
          let arrayValue = array[i];
          // tslint:disable:one-variable-per-declaration
          for (let k = 0, l = idProperties.length; k < l; k++) {
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
    removeId: function (array, value, idProperties) {
      let indexOf = this.indexOfId(array, value, idProperties);
      if (indexOf > -1) {
        return array.splice(indexOf, 1)[0];
      }
    },
    remove: function (array, value) {
      let index = array.indexOf(value);
      if (index > -1) {
        array.splice(index, 1);
        return true;
      }
      return false;
    }
  };
}
