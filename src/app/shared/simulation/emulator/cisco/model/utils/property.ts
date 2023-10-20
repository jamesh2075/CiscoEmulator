import {isArray, isUndefined} from './validators';

/**
 * @usage
 * let data = {
 *    a: {
 *      b: {
 *          c: 123
 *      }
 *    }
 * }
 * let prop = property(data)
 * prop.get('a.b.c') => 123;
 * prop.set('a.d.e', 456);
 * @type {RegExp}
 */


const aryIndexRx = /\[(.*?)\]/g;

export class Property {

    constructor(public data: any = {}) {
    }

    get(path = '', delimiter = '.'): any {
        // a.b['1'].c => a.b.1.c
        path = path.replace(/['"\[\]]/gm, delimiter);
        path = path.replace(/\.+/gm, '.');
        const arr = path.split(delimiter || '.');
        let space = '';
        let i = 0;
        const len = arr.length;

        let data = this.data;

        while (i < len) {
            space = arr[i];
            data = data[space];
            if (data === undefined) {
                break;
            }
            i += 1;
        }
        return data;
    }

    set(path = '', value: any = null, delimiter = '.') {
        if (isUndefined(path)) {
            throw new Error('property.set() requires "path"');
        }
        let data = this.data;
        const arr = pathToArray(path, delimiter, data);
        let space = '';
        let i = 0;
        const len = arr.length - 1;

        while (i < len) {
            space = arr[i];
            if (data[space] === undefined) {
                data = data[space] = {};
            } else {
                data = data[space];
            }
            i += 1;
        }
        if (arr.length > 0) {
            data[arr.pop()] = value;
        }
        return this.data;
    }


    default(path = '', value: any = null, delimiter = '.') {
        if (isUndefined(this.get(path, delimiter))) {
            this.set(path, value, delimiter);
        }
    };

    clear() {
        const d = this.data;
        for (const e in d) {
            if (d.hasOwnProperty(e)) {
                delete d[e];
            }
        }
    };

    path(path = '') {
        return this.set(path, {});
    };
}

export let property = (data: any) => {
    return new Property(data);
};

function pathToArray(path: any = '', delimiter = '.', data: any = {}): string[] {
    if (isArray(path)) {
        return path as Array<string>;
    }
    path = path.replace(aryIndexRx, function (m: string, g1: string) {
        if (g1.indexOf(`'`) !== -1 || g1.indexOf(`'`) !== -1) {
            return delimiter + g1;
        }
        return delimiter + property(data).get(g1);
    });
    return path.split(delimiter);
}
