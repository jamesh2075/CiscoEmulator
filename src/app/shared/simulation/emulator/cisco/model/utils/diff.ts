import {isArray, isDate, isEmpty, isEqual, isObject} from "./validators";

const SNAPSHOT = '_snapshot';
const CLASS_TYPE = '$class';
const DEFAULT_VALUES = '$defaultValues';

export let diff = function (target: any, source: any, excludeEmptyObjects = false) {
    let returnVal: any = {}, dateStr;
    for (let name in target) {
        if (typeof source !== "string" && name in source) {
            if (isDate(target[name])) {
                dateStr = isDate(source[name]) ? source[name].toISOString() : source[name];
                if (target[name].toISOString() !== dateStr) {
                    returnVal[name] = target[name];
                }
            } else if (isObject(target[name]) && !isArray(target[name])) {
                if (name === DEFAULT_VALUES) {
                    returnVal[name] = target[name];
                } else {
                    const result = diff(target[name], source[name], excludeEmptyObjects);
                    if (!isEmpty(result)) {
                        returnVal[name] = result;
                    }
                }

            } else if (isArray(target[name])) {
                if (!isEmpty(target[name])) {
                    const list: any[] = returnVal[name] = [];
                    const arr: any[] = target[name];
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i][SNAPSHOT]) {
                            let val = diff(arr[i], arr[i][SNAPSHOT], excludeEmptyObjects);
                            if (val !== null) {
                                delete val[SNAPSHOT];
                                list[i] = val;
                            }
                        }
                        else {
                            list[i] = arr[i];
                        }
                    }
                }
            } else if (!isEqual(source[name], target[name]) || name === CLASS_TYPE) {
                returnVal[name] = target[name];
            }
        } else {
            returnVal[name] = target[name];
            if (returnVal[name][SNAPSHOT]) {
                let val = diff(returnVal[name], returnVal[name][SNAPSHOT], excludeEmptyObjects);
                if (val !== null) {
                    delete val[SNAPSHOT];
                    returnVal[name] = val;
                }
            }
        }
    }

    delete returnVal[SNAPSHOT]; // This needs to be deleted prior to checking for excludeEmptyClasses

    if (isEmpty(returnVal)) {
        return null;
    }

    if (excludeEmptyObjects) {
        // filter off if the only property is $class
        let propNames = Object.keys(returnVal);
        if (propNames.length === 1 && returnVal.hasOwnProperty(CLASS_TYPE)) {
            return null;
        }
    }

    return returnVal;
};
