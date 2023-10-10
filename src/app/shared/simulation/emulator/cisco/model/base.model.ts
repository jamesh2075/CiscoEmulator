import {toJSONObject} from "./utils/formatters";
import {ISerialize} from "./interfaces/serialize.interface";
import {IDefault} from "./interfaces/default.interface";
import {diff} from "./utils/diff";
import {ISnapshot} from "./interfaces/snapshot.interface";

export class BaseModel implements ISerialize, ISnapshot, IDefault {

    // properties that start with $ will be included
    private $defaultValues: any;
    // properties that start with _ will not be included
    private _snapshot: any;

    $class: string;

    setDefaultValues(val: any) {
        this.$defaultValues = val;
        Object.assign(this, val);
        this.takeSnapshot();
    }

    getDefaultValues(): any {
        return this.$defaultValues;
    }

    /**
     * Restores default values back to model. An optional properties list can be provided to restore only certain properties
     * @param props - props to filter, if empty restores all
     * @param traverse - traverse children to restore their default values
     */
    restoreDefaultValues(props: string[] = [], traverse: boolean = true) {
        if (this.$defaultValues) {

            let defaultValues: any = this.$defaultValues;
            if (props.length) {
                defaultValues = {};
                for (let prop of props) {
                    defaultValues[prop] = this.$defaultValues[prop];
                }
            }

            if (traverse) {
                for (let prop in this) {
                    if (this[prop] instanceof Array) {
                        let list: any[] = this[prop];
                        for (let i = 0; i < list.length; i++) {
                            if (list[i] instanceof BaseModel) {
                                list[i].restoreDefaultValues();
                            }
                        }
                    }
                    else if (this[prop] instanceof BaseModel) {
                        let item: BaseModel = this[prop] as BaseModel;
                        item.restoreDefaultValues();
                    }
                }
            }

            Object.assign(this, defaultValues);
        }
    }

    /**
     * Get a snapshot of the current state of the model; can be used to diff values later.
     */
    takeSnapshot(): any {
        this.$class = this['constructor'].name;
        this._snapshot = toJSONObject(this, true);
        return this._snapshot;
    }

    getSnapshot(): any {
        return this._snapshot;
    }

    serialize(diffOnly: boolean = false) {
        let snapshot = this.getSnapshot();
        // If diffOnly, keep the snapshots, they will be cleaned up by diff, otherwise remove them
        let returnVal = toJSONObject(this, !diffOnly);
        if (diffOnly) {
            returnVal = diff(returnVal, snapshot);
        }
        return returnVal;
    }

    // ATTENTION: DO NOT TOUCH THIS UNLESS YOU TALK TO ROB.
    toJSON() {
        let data: any = {};
        for (let prop in this) {
            // Build Target: ES5
            if (typeof this[prop] !== "function") {
                if (prop === '_snapshot') { // BE SURE TO INCLUDE _snapshot
                    data[prop] = this[prop];
                }
                if (prop[0] !== '_') { // DO NOT INCLUDE PROPERTIES THAT START WITH AN UNDERSCORE
                    data[prop] = this[prop];
                }
            }

            // Build Target: ES6 (currentlyl it is skipping properties like "interface" on GibabitEthernet)
            // if (typeof this[prop] !== "function") {
            //     if (prop === '_snapshot') {
            //         data[prop] = this[prop];
            //     }
            //     if (prop[0] === '_') {
            //         let getter = prop.substr(1);
            //         let val = this[getter];
            //         if(val !== undefined) {
            //             data[getter] = val;
            //         }
            //     } else {
            //         data[prop] = this[prop];
            //     }
            // }
        }
        return data;
    }
}
