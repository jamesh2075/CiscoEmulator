export let isUndefined = function (val: any): boolean {
    return val === undefined;
};

export let isDate = function (val: any): boolean {
    return val instanceof Date;
};

export let isArray = function (val: any): boolean {
    return val instanceof Array;
};

export let isObject = function (val: any): boolean {
    return val !== null && typeof val === 'object';
};

export let isString = function (val: any): boolean {
    return typeof val === 'string';
};

export let isNumber = function (val: any): boolean {
    return typeof val === 'number';
};

export let isEmpty = function isEmpty(val: any): boolean {
    if (isUndefined(val)) {
        return true;
    }

    if (val === null) {// diff returns null when they are empty.
        return true;
    }

    if (isString(val)) {
        return val === '';
    }

    if (isArray(val)) {
        return val.length === 0;
    }

    if (isObject(val)) {
        for (let e in val) {
            return false;
        }
        return true;
    }

    return false;
};

export let isEqual = function (source: any, target: any) {
    let sourceKeys, targetKeys, sourceLen, index, key, returnVal;

    // if the source is a Date type
    if (source instanceof Date) {
        // if the target is a Date type
        if (target instanceof Date) {
            // do a comparison
            return source.toString() === target.toString();
        }
        // otherwise the targets do not match
        else {
            return false;
        }
    } else if (source instanceof Array) { // if the source is an Array type
        // if the target
        if (target instanceof Array) {
            sourceLen = source.length;
            // if the lengths are the same
            if (sourceLen === target.length) {
                // loop through array
                for (index = 0; index < sourceLen; index++) {
                    // check if each item is equal
                    returnVal = isEqual(source[index], target[index]);
                    // if the values are not equal, return false
                    if (!returnVal) {
                        return false;
                    }
                }
                // if passes all conditions
                return true;
            } else { // the lengths are not the same
                return false;
            }
        } else { // the target is not an Array
            return false;
        }
    } else if (source === null) { // if the source is null
        // compare with target
        return source === target;
    } else if (typeof source === 'object') { // if the source is an Object type
        // if target is null
        if (target === null) {
            return source === target;
        } else if (typeof target === 'object') { // if the target is an object type
            // get the sorted keys of both the source and target
            sourceKeys = Object.keys(source).sort();
            targetKeys = Object.keys(target).sort();

            // if the keys match, loop through the keys
            if (sourceKeys.toString() === targetKeys.toString()) {
                sourceLen = sourceKeys.length;
                // loop through array
                for (index = 0; index < sourceLen; index++) {
                    key = sourceKeys[index];
                    // check if each item is equal
                    returnVal = isEqual(source[key], target[key]);
                    // if the values are not equal, return false
                    if (!returnVal) {
                        return false;
                    }
                }
                // if passes all conditions
                return true;
            }
            else {
                // if the keys do not match, then not equal
                return false;
            }
        }
        // if the target is not and object type
        else {
            return false;
        }
    }

    // string, number, boolean, null, undefined
    return source === target;
};
