import {isUndefined} from './validators';

/**
 * Removes _snapshot property from data objects
 * @param data
 * @returns {any}
 */
function cleanup(data: any) {
    let val;
    if (data === null) {
        return data;
    }
    delete data._snapshot;
    for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
            val = data[prop];
            if (val && val instanceof Array || typeof val === 'object') {
                cleanup(val);
            }
        }
    }
}

/**
 * Safely converts data from to clean JSON objects
 * @param data
 * @returns {any}
 */
export let toJSONObject = function (data: any, performCleanup = false) {
    if (isUndefined(data)) {
        return undefined;
    }
    let json = JSON.parse(JSON.stringify(data));
    if (performCleanup) {
        cleanup(json);
    }
    return json;
};