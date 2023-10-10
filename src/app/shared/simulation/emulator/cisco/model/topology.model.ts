import {Device, IDevice} from "./device.model";
import {Type} from "class-transformer";
import {IConnection, Connection} from "./connection.model";
import {diff} from "./utils/diff";
import {BaseModel} from "./base.model";
import {toJSONObject} from "./utils/formatters";
import {ISerialize} from "./interfaces/serialize.interface";

export interface ITopology {
    name: string;
    devices: IDevice[];
    connections: IConnection[];
    inspect(): any;
}

export class Topology extends BaseModel implements ITopology, ISerialize {

    name: string = "";

    @Type(() => Device)
    devices: Device[] = [];

    @Type(() => Connection)
    connections: Connection[] = [];

    serialize(diffOnly: boolean = false): any {
        // get the snapshot
        let snapshot: any = this.getSnapshot();
        // If diffOnly, keep the snapshots, they will be cleaned up by diff, otherwise remove them
        // get JSON Object (snapshots are not present, which is why we get the snapshot first)
        let returnVal = toJSONObject(this, !diffOnly);
        // if we are getting the diffOnly
        if (diffOnly) {
            // be sure to remove empty objects
            returnVal = diff(returnVal, snapshot, true);
        }
        return returnVal;
    }

    inspect(): any {
        let data = this.serialize();
        return this.iterate(data);
    }

    ignoreProps = ["$class", "_snapshot", "ignoreProps"];

    private iterate(source: any) {
        let data: any;
        if (source instanceof Array) {
            data = {};
            for (let i = 0; i < source.length; i++) {
                let name = (source[i].name || i).toString().split('/').join('_');
                data[name] = this.iterate(source[i]);
            }
            return data;
        } else if (typeof source === 'object') {
            data = {};
            for (let prop in source) {
                if (source.hasOwnProperty(prop) && this.ignoreProps.indexOf(prop) === -1) {
                    data[prop] = this.iterate(source[prop]);
                }
            }
            return data;
        }
        return source;
    }

    constructor() {
        super();
        this.takeSnapshot();
    }

    toJSON() {
        return {
            $class: this.$class,
            name: this.name,
            devices: this.devices,
            connections: this.connections
        }
    }
}
